import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { withAlpha } from "../../../context/Theme";
import { useThemeBackground, useThemeColor, useThemeColorValue } from "../../../hooks/themes/useThemeHooks";

export type SearchProps = {
    filter: string;
    setFilter: (value: string) => void;
    placeholder: string;
};

export const Search: FC<SearchProps> = ({ filter, setFilter, placeholder }) => {
    const styleLighten = useThemeBackground("inverted");
    const styleText = useThemeColor("invText");
    const colorText = useThemeColorValue("invText");

    return (
        <TextInput
            style={[styles.searchField, styleLighten, styleText]}
            value={filter}
            onChangeText={setFilter}
            placeholder={placeholder}
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
