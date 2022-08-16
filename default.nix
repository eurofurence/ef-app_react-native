let
  pkgs = import <nixpkgs> {
      config = {

        android_sdk.accept_license = true;
      };
  };
in

pkgs.stdenv.mkDerivation {
  name = "eurofurence-app-dev-env";

  buildInputs =
    [
      pkgs.yarn
      pkgs.nodejs
      pkgs.nodePackages.expo-cli
      pkgs.android-tools
      pkgs.androidenv.androidPkgs_9_0.androidsdk
      pkgs.jdk11
    ];

  shellHook = ''
    export ANDROID_SDK_ROOT=${pkgs.androidenv.androidPkgs_9_0.androidsdk}
    export ANDROID_HOME=$ANDROID_SDK_ROOT
    '';
}
