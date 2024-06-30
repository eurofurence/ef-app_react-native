import { useIsFocused } from "@react-navigation/core";
import React, { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { withAlpha } from "../../../context/Theme";
import { useThemeBackground, useThemeColor, useThemeColorValue } from "../../../hooks/themes/useThemeHooks";

export type SearchProps = {
    filter: string;
    setFilter: (value: string) => void;
    placeholder?: string;
};

export const Search: FC<SearchProps> = ({ filter, setFilter, placeholder }) => {
    const { t } = useTranslation("Search");
    const styleLighten = useThemeBackground("inverted");
    const styleText = useThemeColor("invText");
    const colorText = useThemeColorValue("invText");

    // Connect clearing search on back if focused. // TODO: Test if this feels nice.
    const isFocused = useIsFocused();
    useEffect(() => {
        if (!isFocused) return;
        if (!filter.length) return;

        const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
            setFilter("");
            return true;
        });
        return () => subscription.remove();
    }, [isFocused, filter]);

    return (
        <TextInput
            style={[styles.searchField, styleLighten, styleText]}
            value={filter}
            onChangeText={setFilter}
            placeholder={placeholder ?? t("placeholder")}
            placeholderTextColor={withAlpha(colorText, 0.6)}
        />
    );
};

const styles = StyleSheet.create({
    searchField: {
        marginHorizontal: 5,
        marginVertical: 15,
        borderRadius: 10,
        padding: 10,
        flex: 1,
    },
});
