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
      pkgs.pnpm
      pkgs.nodejs
      pkgs.nodePackages.expo-cli
      pkgs.android-tools
    ];

}
