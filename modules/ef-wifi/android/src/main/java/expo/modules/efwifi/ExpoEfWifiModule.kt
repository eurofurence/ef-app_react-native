package expo.modules.efwifi

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.net.wifi.WifiConfiguration
import android.net.wifi.WifiEnterpriseConfig
import android.net.wifi.WifiManager
import android.net.wifi.WifiNetworkSuggestion
import android.os.Build
import androidx.annotation.RequiresApi
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate

class ExpoEfWifiModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("EfWifi")

    Function("addEnterpriseNetwork") { ssid: String, identity: String, password: String, anonymousIdentity: String, subjectMatch: String ->
      addEnterpriseNetwork(ssid, identity, password, anonymousIdentity, subjectMatch)
    }
  }

  // Return codes, mirrored in src/components/wifi/efWifiModule.ts:
  // 0 OK, 1 wifi service unavailable, 2 CA cert unreadable,
  // 3 enterprise config rejected, 4 missing location permission (pre-Android 10), 5 apply failed
  private fun addEnterpriseNetwork(
    ssid: String,
    identity: String,
    password: String,
    anonymousIdentity: String,
    subjectMatch: String,
  ): Int {
    val context = appContext.reactContext?.applicationContext ?: return 1
    val wifiManager = context.getSystemService(Context.WIFI_SERVICE) as? WifiManager ?: return 1

    val caCerts = try {
      context.resources.openRawResource(R.raw.cacert).use { stream ->
        CertificateFactory.getInstance("X.509")
          .generateCertificates(stream)
          .map { it as X509Certificate }
          .toTypedArray()
      }
    } catch (e: Exception) {
      return 2
    }
    if (caCerts.isEmpty()) return 2

    val enterpriseConfig = try {
      WifiEnterpriseConfig().also {
        it.identity = identity
        it.password = password
        it.anonymousIdentity = anonymousIdentity
        it.eapMethod = WifiEnterpriseConfig.Eap.TTLS
        it.phase2Method = WifiEnterpriseConfig.Phase2.PAP
        it.caCertificates = caCerts
        it.altSubjectMatch = "DNS:$subjectMatch"
        it.domainSuffixMatch = subjectMatch
      }
    } catch (e: Exception) {
      return 3
    }

    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      addViaSuggestion(wifiManager, ssid, enterpriseConfig)
    } else {
      addViaLegacyConfiguration(context, wifiManager, ssid, enterpriseConfig)
    }
  }

  @RequiresApi(Build.VERSION_CODES.Q)
  private fun addViaSuggestion(wifiManager: WifiManager, ssid: String, enterpriseConfig: WifiEnterpriseConfig): Int {
    val suggestion = try {
      WifiNetworkSuggestion.Builder()
        .setSsid(ssid)
        .setWpa2EnterpriseConfig(enterpriseConfig)
        .build()
    } catch (e: Exception) {
      return 3
    }
    return when (wifiManager.addNetworkSuggestions(listOf(suggestion))) {
      WifiManager.STATUS_NETWORK_SUGGESTIONS_SUCCESS,
      WifiManager.STATUS_NETWORK_SUGGESTIONS_ERROR_ADD_DUPLICATE,
      -> 0
      else -> 5
    }
  }

  @Suppress("DEPRECATION")
  private fun addViaLegacyConfiguration(
    context: Context,
    wifiManager: WifiManager,
    ssid: String,
    enterpriseConfig: WifiEnterpriseConfig,
  ): Int {
    if (context.checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
      return 4
    }

    val quotedSsid = "\"$ssid\""
    val existing = try {
      wifiManager.configuredNetworks?.firstOrNull { it.SSID == quotedSsid }
    } catch (e: SecurityException) {
      return 4
    }

    val config = existing ?: WifiConfiguration()
    config.enterpriseConfig = enterpriseConfig
    config.SSID = quotedSsid
    config.hiddenSSID = false
    config.priority = 40
    config.status = WifiConfiguration.Status.DISABLED
    config.allowedKeyManagement.clear()
    config.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.WPA_EAP)
    config.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.IEEE8021X)
    config.allowedGroupCiphers.clear()
    config.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.CCMP)
    config.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.TKIP)
    config.allowedPairwiseCiphers.clear()
    config.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.CCMP)
    config.allowedAuthAlgorithms.clear()
    config.allowedAuthAlgorithms.set(WifiConfiguration.AuthAlgorithm.OPEN)
    config.allowedProtocols.clear()
    config.allowedProtocols.set(WifiConfiguration.Protocol.RSN)

    try {
      if (existing == null) {
        val networkId = wifiManager.addNetwork(config)
        if (networkId == -1) return 5
        wifiManager.enableNetwork(networkId, false)
      } else {
        if (wifiManager.updateNetwork(config) == -1) return 5
        wifiManager.enableNetwork(config.networkId, false)
      }
      wifiManager.saveConfiguration()
      wifiManager.setWifiEnabled(true)
    } catch (e: Exception) {
      return 5
    }
    return 0
  }
}
