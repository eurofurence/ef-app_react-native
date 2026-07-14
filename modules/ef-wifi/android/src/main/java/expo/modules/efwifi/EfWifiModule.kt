package expo.modules.efwifi

import android.content.Intent
import android.net.wifi.WifiEnterpriseConfig
import android.net.wifi.WifiNetworkSuggestion
import android.os.Build
import android.provider.Settings
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.InputStream
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate

class EfWifiException(message: String) : CodedException(message)

class EfWifiModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("EfWifi")

    AsyncFunction("addEnterpriseNetwork") { request: Map<String, Any?> ->
      val activity = appContext.currentActivity ?: throw Exceptions.MissingActivity()

      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
        throw EfWifiException("Adding a network requires Android 11 (API 30) or newer.")
      }

      val ssid = request["ssid"] as? String ?: throw EfWifiException("Missing ssid")
      val identity = request["identity"] as? String ?: throw EfWifiException("Missing identity")
      val password = request["password"] as? String ?: throw EfWifiException("Missing password")
      val anonymousIdentity = request["anonymousIdentity"] as? String ?: "anonymous"
      val domainSuffixMatch = request["domainSuffixMatch"] as? String ?: ""

      // SECURITY: load bundled CA + set domain suffix match so the RADIUS server cert is validated.
      val context = activity.applicationContext
      val cf = CertificateFactory.getInstance("X.509")
      val caInput: InputStream = context.resources.openRawResource(R.raw.efwifi_ca)
      val caCert = caInput.use { cf.generateCertificate(it) as X509Certificate }

      val enterprise = WifiEnterpriseConfig().apply {
        eapMethod = WifiEnterpriseConfig.Eap.TTLS
        phase2Method = WifiEnterpriseConfig.Phase2.PAP
        this.identity = identity
        this.anonymousIdentity = anonymousIdentity
        this.password = password
        caCertificate = caCert
        if (domainSuffixMatch.isNotEmpty()) this.domainSuffixMatch = domainSuffixMatch
      }

      val suggestion = WifiNetworkSuggestion.Builder()
        .setSsid(ssid)
        .setWpa2EnterpriseConfig(enterprise)
        .build()

      val intent = Intent(Settings.ACTION_WIFI_ADD_NETWORKS).apply {
        putParcelableArrayListExtra(Settings.EXTRA_WIFI_NETWORK_LIST, arrayListOf(suggestion))
      }
      activity.startActivity(intent)
    }
  }
}
