# The Eurofurence app - React Native

This repository holds the source code for a react-native version of the Eurofurence App. Feel free to inspect the code and do with it what you like!

## Contributing

All code contributions, including those of people having commit access, must go through a pull request and be approved by a maintainer before being merged. This is to ensure a proper review of all the code.

If you wish to help, you can learn more about how you can contribute to this project in the [contribution guide](CONTRIBUTING.md).

## F.A.Q.

### Why not an actual native app?

Simply put - We got tired of maintaining the mess that is the android ecosystem. Everything is hard and a struggle. React provides a straightforward way to develop applications and with React Native we can easily push this out to mobile devices.

### What is the difference between .aab and .apk?

When building the app, you will get .aab, this file is needed for Google Play. Then you can create an .apk for either direct app installation on Android, or for (how we use it) GitHub Releases for others to use.

# How to Build, Package & Submit

I welcome you fellow Developer. Here you can find the Installation Manual!

It is expected that you followed the [Contribution Manual](https://github.com/eurofurence/ef-app_react-native/blob/main/CONTRIBUTING.md) for installation.

## First of all, create a .jks Keystore File (For GitHub Release):

```bash
keytool -genkeypair \
  -v \
  -keystore ef-app.jks \
  -alias ef-app \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storetype PKCS12
```

You will be prompted for:

Keystore password, Key password & Your name / organization

Please keep the password somewhere safe. This will be required for each .apk creation.

## Build for iOS and Android

Run the following:

`pnpm local:ios:production`

And in a new terminal, you can also run for Android

`pnpm local:android:production`

And now we wait...

... Wanna hear a joke? Oh it finished.

## Submission for Apple, Google & GitHub

It's expected that the builds were successful and you now have 2 files, an .aab and an .ipa file.

### Apple

In MacOS, install and start [Transporter](https://apps.apple.com/app/transporter/id1450874784?mt=12), sign in and upload the .ipa file that has been generated.

Click on deliver and .. wait. There's so much waiting.

### Gowogle

Go to [Google Play Console for Developers](https://play.google.com/console/developers) -> select the Organization (Eurofurence) -> click on the app "Eurofurence" -> Test & Release -> Internal Testing -> Create new release -> Upload the .aab file you created

Upload and wait. Maybe write a nice changelog? You can check the "Next" button until it's no longer greyed out.

... More waiting.

### GitHub

To create the .apk for the GitHub release, use the following code:

```bash
bundletool build-apks \
  --bundle=build-REPLACEME.aab \ # For example build-1757518801688.aab
  --output=ef-app.apks \
  --mode=universal \
  --ks='/File/Location/Here/ef-app.jks' \ # Keystore file location
  --ks-key-alias=ef-app \ # Keystore name
  --ks-pass=pass:PasswordHere \ # This is the same password as you put in above
  --key-pass=pass:PasswordHere # This is the same password as you put in above

unzip ef-app.apks -d output_dir
```

Now in the output_dir folder, is a file called universal.apk (or something like that, there are only 2 files where 1 is the .apk)

Rename this file to VERSION-EF.apk (For example 6.2.1-EF.apk, this is for consistency) and upload it as GitHub release. We usually create a new tag and generate release notes with it.

## Thanks for reading 🧡
