import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import "@testing-library/jest-native/extend-expect";

jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter");
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);
jest.useFakeTimers();
