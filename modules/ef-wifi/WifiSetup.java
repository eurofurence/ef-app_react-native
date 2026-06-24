package org.eurofurence.connavigator;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.Manifest;
import android.annotation.TargetApi;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiEnterpriseConfig;
import android.net.wifi.WifiEnterpriseConfig.Eap;
import android.net.wifi.WifiEnterpriseConfig.Phase2;
import android.net.wifi.WifiManager;
import android.net.wifi.WifiNetworkSuggestion;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import java.io.InputStream;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Arrays;
import java.util.List;

public class WifiSetupModule extends ReactContextBaseJavaModule {
	@Override
	public String getName() {
		return "EfWifi";
	}

    // RETURNS:
    // 0 = OK
	// 1 = WifiManager unreachable / system API blocked
	// 2 = Couldn't find X.509 root CA
	// 3 = Failure to build WPA-Enterprise config
	// 4 = Missing list networks permissions
	// 5 = Failure at final apply step
    @ReactMethod
    public int addEnterpriseNetwork(String ssid, String identity, String password, String anonymous_identity, String subject_match) {
		WifiManager wifiManager = (WifiManager) this.getApplicationContext().getSystemService(WIFI_SERVICE);
        if (wifiManager == null) {
            return 1;
        }
		
        WifiConfiguration baseConfig = new WifiConfiguration();
		WifiEnterpriseConfig enterpriseConfig = new WifiEnterpriseConfig();
		
		try {
			CertificateFactory certFactory = CertificateFactory.getInstance("X.509");
			InputStream in = getResources().openRawResource(R.raw.cacert);
			X509Certificate caCert = (X509Certificate) certFactory.generateCertificate(in);
		} catch(e) {
			return 2;
		}

        enterpriseConfig.setIdentity(identity);
        enterpriseConfig.setPassword(password);
	    enterpriseConfig.setAnonymousIdentity(anonymous_identity);
        enterpriseConfig.setSubjectMatch("/CN=" + subject_match);
        enterpriseConfig.setAltSubjectMatch("DNS:" + subject_match);
		enterpriseConfig.setEapMethod(Eap.TTLS);
		enterpriseConfig.setPhase2Method(Phase2.PAP);
        enterpriseConfig.setCaCertificate(caCert);

        try {
			WifiNetworkSuggestion suggestion = new WifiNetworkSuggestion.Builder().setSsid(ssid).setWpa2EnterpriseConfig(enterpriseConfig).build();
			wifiManager.addNetworkSuggestions(Arrays.asList(suggestion));
			wifiManager.setWifiEnabled(true);
		} catch(e) {
			return 3;
		}

        List<WifiConfiguration> configs = null;
        for (int i = 0; i < 10 && configs == null; i++) {
            if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                return 4;
            }
            configs = wifiManager.getConfiguredNetworks();
            try {
                Thread.sleep(1);
            } catch (InterruptedException e) {}
        }

        boolean ssidExists = false;
        if (configs != null) {
            for (WifiConfiguration config : configs) {
                if (config.SSID.equals("\"" + ssid + "\"")) {
                    baseConfig = config;
                    ssidExists = true;
                    break;
                }
            }
        }

        baseConfig.enterpriseConfig = enterpriseConfig;
        baseConfig.SSID = "\"" + ssid + "\"";
        baseConfig.hiddenSSID = false;
        baseConfig.priority = 40;
        baseConfig.status = WifiConfiguration.Status.DISABLED;
        baseConfig.allowedKeyManagement.clear();
        baseConfig.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.WPA_EAP);
		baseConfig.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.WPA_EAP_SHA256);
        baseConfig.allowedGroupCiphers.clear();
        baseConfig.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.CCMP);
        baseConfig.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.TKIP);
        baseConfig.allowedPairwiseCiphers.clear();
        baseConfig.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.CCMP);
        baseConfig.allowedAuthAlgorithms.clear();
        baseConfig.allowedAuthAlgorithms.set(WifiConfiguration.AuthAlgorithm.OPEN);
        baseConfig.allowedProtocols.clear();
        baseConfig.allowedProtocols.set(WifiConfiguration.Protocol.RSN);

        try {
			if (!ssidExists) {
				int networkId = wifiManager.addNetwork(baseConfig);
				wifiManager.enableNetwork(networkId, false);
			} else {
				wifiManager.updateNetwork(baseConfig);
				wifiManager.enableNetwork(baseConfig.networkId, false);
			}
			
            wifiManager.saveConfiguration();
		} catch(e) {
			return 5;
		}
		return 0;
    }
}
