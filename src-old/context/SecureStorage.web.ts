import AsyncStorage from "@react-native-async-storage/async-storage";

export const getItemAsync = (key: string) => AsyncStorage.getItem(key);
export const setItemAsync = (key: string, value: string) => AsyncStorage.setItem(key, value);
export const deleteItemAsync = (key: string) => AsyncStorage.removeItem(key);

export const setItemToAsync = (key: string, value: string | null | undefined) =>
    value === undefined || value === null ? AsyncStorage.removeItem(key) : AsyncStorage.setItem(key, value);
