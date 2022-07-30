import { FC } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { useSignalLoading } from "../../context/LoadingContext";
import { useAppRoute } from "../../hooks/useAppNavigation";

/**
 * Params handled by the screen in route.
 */
export type ScreenEmptyParams = undefined;

/**
 * The properties to the screen as a component.
 */
export type ScreenEmptyProps = object;

/**
 * Placeholder screen.
 * @constructor
 */
export const ScreenEmpty: FC<ScreenEmptyProps> = () => {
    const { t } = useTranslation("EmptyScreen");
    const route = useAppRoute("Areas");

    // Indicate loading, as content is not present.
    useSignalLoading(true);

    return (
        <View style={{ padding: 30, paddingTop: 60 }}>
            <Label type="h1">{route.name}</Label>
            <Label type="h2">{t("notImplemented")}</Label>
        </View>
    );
};
