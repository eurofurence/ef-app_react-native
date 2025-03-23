import * as React from "react";

export interface DrawerProps {
    location: string;
    title?: string;
    swipeEnabled?: boolean;
    headerShown?: boolean;
    headerLargeTitle?: boolean;
    headerLeft?: React.ReactNode;
    headerRight?: React.ReactNode;
}

export const DrawerScreensData: DrawerProps[] = [
    {
        location: "(areas)",
        headerShown: false,
        title: "Home",
        swipeEnabled: false,
    },
    {
        location: "+not-found",
        headerShown: false,
        swipeEnabled: false,
    },
];
