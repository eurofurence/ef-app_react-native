import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import "@testing-library/jest-native/extend-expect";

import initStoryshots from "@storybook/addon-storyshots";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);
jest.useFakeTimers();
// initStoryshots();
