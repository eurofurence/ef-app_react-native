import { useIsFocused } from "@react-navigation/core";
import React, { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import SearchPlus from "@expo/vector-icons/FontAwesome5";

import { labelTypeStyles } from "./Label";
import { withAlpha } from "@/context/Theme";
import { useThemeBackground, useThemeColor, useThemeColorValue } from "@/hooks/themes/useThemeHooks";

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
    }, [isFocused, filter, setFilter]);

    return (
        <View style={[styles.container, styleLighten]}>
            <SearchPlus name="search" size={18} color={colorText} style={styles.icon} />
            <TextInput
                style={[styles.searchField, styleText, labelTypeStyles.regular]}
                value={filter}
                onChangeText={setFilter}
                placeholder={placeholder ?? t("placeholder")}
                placeholderTextColor={withAlpha(colorText, 0.6)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        marginHorizontal: 5,
        marginVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: "white", // You can replace this with dynamic theming
    },
    icon: {
        marginRight: 8,
    },
    searchField: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
        borderWidth: 0,
    },
});
