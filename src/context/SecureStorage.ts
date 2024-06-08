import * as SecureStore from "expo-secure-store";

export const getItemAsync = (key: string) => SecureStore.getItemAsync(key);
export const setItemAsync = (key: string, value: string) => SecureStore.setItemAsync(key, value);
export const deleteItemAsync = (key: string) => SecureStore.deleteItemAsync(key);
