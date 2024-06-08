import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

// TODO: is intent filter significant? probably yes but not verified, a lot of
//   random checking because fucky.

// TODO
// WebBrowser.maybeCompleteAuthSession();

Linking.addEventListener("url", (...args) => {
    console.log("Received URL", ...args);
    return false;
});
