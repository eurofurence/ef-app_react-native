import * as SecureStore from "expo-secure-store";
import { SecureStoreOptions } from "expo-secure-store";

const options: SecureStoreOptions = {
    // Option for iOS keychain.
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
};

export const getItemAsync = (key: string) => SecureStore.getItemAsync(key, options);
export const setItemAsync = (key: string, value: string) => SecureStore.setItemAsync(key, value, options);
export const deleteItemAsync = (key: string) => SecureStore.deleteItemAsync(key, options);

export const setItemToAsync = (key: string, value: string | null | undefined) =>
    value === undefined || value === null ? SecureStore.deleteItemAsync(key, options) : SecureStore.setItemAsync(key, value, options);
