import { router } from "expo-router";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Icon } from "../generic/atoms/Icon";
import { useTranslation } from "react-i18next";

export interface DrawerProps {
    location: string;
    title?: string;
    swipeEnabled?: boolean;
    headerShown?: boolean;
    headerLargeTitle?: boolean;
    headerLeft?: React.ReactNode;
    headerRight?: React.ReactNode;
}

const goBackCustom = () => {
    return (
        <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
    );
};

export const useDrawerScreensData = (): DrawerProps[] => {
    const { t } = useTranslation("Menu");
    
    return [
        {
            location: "(areas)",
            headerShown: false,
            title: t("home"),
        },
        {
            location: "knowledge/index",
            title: t("info"),
            headerLeft: goBackCustom(),
            headerShown: true,
        },
        {
            location: "knowledge/[knowledgeId]/index",
            title: t("info"),
            headerLeft: goBackCustom(),
            headerShown: true,
        },
        {
            location: "maps/[...slug]",
            headerLeft: goBackCustom(),
            headerShown: true,
        },
        {
            location: "+not-found",
            headerShown: false,
        },
    ];
};
