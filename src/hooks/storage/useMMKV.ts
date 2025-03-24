import { useCallback, useEffect, useState } from 'react';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export function useMMKVString<T extends string | undefined>(key: string, defaultValue?: T) {
    const [value, setValue] = useState<T>(() => {
        const storedValue = storage.getString(key);
        return (storedValue as T) ?? defaultValue as T;
    });

    useEffect(() => {
        const storedValue = storage.getString(key);
        if (storedValue !== undefined) {
            setValue(storedValue as T);
        }
    }, [key]);

    const setStoredValue = useCallback((newValue: T) => {
        if (newValue === undefined) {
            storage.delete(key);
        } else {
            storage.set(key, newValue);
        }
        setValue(newValue);
    }, [key]);

    return [value, setStoredValue] as const;
}

export function useMMKVBoolean(key: string, defaultValue = false) {
    const [value, setValue] = useState(() => {
        return storage.getBoolean(key) ?? defaultValue;
    });

    useEffect(() => {
        const storedValue = storage.getBoolean(key);
        if (storedValue !== undefined) {
            setValue(storedValue);
        }
    }, [key]);

    const setStoredValue = useCallback((newValue: boolean) => {
        storage.set(key, newValue);
        setValue(newValue);
    }, [key]);

    return [value, setStoredValue] as const;
}

export function useMMKVNumber(key: string, defaultValue = 0) {
    const [value, setValue] = useState(() => {
        return storage.getNumber(key) ?? defaultValue;
    });

    useEffect(() => {
        const storedValue = storage.getNumber(key);
        if (storedValue !== undefined) {
            setValue(storedValue);
        }
    }, [key]);

    const setStoredValue = useCallback((newValue: number) => {
        storage.set(key, newValue);
        setValue(newValue);
    }, [key]);

    return [value, setStoredValue] as const;
} 