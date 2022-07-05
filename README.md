# The Eurofurence app - React Native

This repository holds the source code for a react-native version of the Eurofurence App. Feel free to inspect the code and do with it what you like!

## How to contribute

You want to help us out? Awesome! We try to keep most of the development work in the open via issues but planning and major design stuff is handled internally.

However, you're more than welcome to contribute! Here's a list of things you could do:

- Submit bugfixes/changes via Pull Request
- Adding new translations to make the app more accessible
- Create issues for bugs, features, or other things you'd like to see
- Joining the testing group to test changes early

## Running and Contributing
### Running it yourself

You will need the Expo CLI installed globally to run any part of this project. You can do this with `npm install -g expo-cli`

After that you can run `yarn install && yarn start` to get started. A webpage will pop up that lets you interact with the app. The Metro bundler will point out what to do next.

To run this app on a device or emulator you will need the Expo GO app.

### Code Standards

We're light on actual requirements but there are some guiding principles at work.

- Make sure your code passes the lint check. `yarn lint` to lint and `yarn lint --fix` to automatically fix issues.
- Try to write tests. We're not going to require code coverage but it would be nice to have some certainty. Generally, try to test logic and user interaction. Stay away from snapshot tests unless you want to test complex objects or idempotent UI elements
- Use i18n wherever possible. There's a `useTranslation` hook for that!
- Keep it civil, we're all volunteering for this after all

There's a pipeline running to check most of this automatically.

### Branches

We work with short-lived feature branches. The aim is to quickly develop stuff and get it back into main without too much hassle. This keeps PR's small and contained.

Try to name the branch after the type of branch and a descriptive name. This helps us keep track of what is in progress.

*Good:* feature/include-dealers-den bug/messages-not-marked-read
*Bad*: refactoring feature/ticket-123 bug/its-borked

## F.A.Q.

### Why not an actual native app?

Simply put - We got tired of maintaining the mess that is the android ecosystem. Everything is hard and a struggle. React provides a straightforward way to develop applications and
with React Native we can easily push this out to mobile devices.
