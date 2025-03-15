import * as Device from "expo-device";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { Label } from "../generic/atoms/Label";
import { Section } from "../generic/atoms/Section";
import { useAuxiliary } from "@/store/auxiliary/slice";

export const DeviceSpecificWarnings = () => {
    const { t } = useTranslation("Home", { keyPrefix: "warnings" });
    const [scheduledNotifications] = useState(() => Platform.OS === "android" || Platform.OS === "ios");
    const [cacheImages] = useState(() => Platform.OS === "android" || Platform.OS === "ios");
    const pushNotifications = useMemo(() => scheduledNotifications && Device.isDevice, [scheduledNotifications]);

    // NEW: Using Context Instead of Redux
    const { state, dispatch } = useAuxiliary();
    const { deviceWarningsHidden } = state;

    if (deviceWarningsHidden) {
        return null;
    }
    if (scheduledNotifications && pushNotifications && cacheImages) {
        return null;
    }

    return (
        <>
            <Section title={t("title")} subtitle={t("subtitle")} icon="information" />

            <Label type="para">
                {[!scheduledNotifications && t("no_notifications"), !pushNotifications && t("no_push_notifications"), !cacheImages && t("no_image_caching")]
                    .filter(Boolean)
                    .join("\n\n")}
                <Label variant="bold" color="secondary" onPress={() => dispatch({ type: "TOGGLE_DEVICE_WARNINGS" })}>
                    {" " + t("hide")}
                </Label>
            </Label>
        </>
    );
};
