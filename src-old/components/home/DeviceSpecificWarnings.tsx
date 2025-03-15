import * as Device from "expo-device";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import { useAppDispatch, useAppSelector } from "../../store";
import { hideDeviceWarnings } from "../../store/auxiliary/slice";
import { Label } from "../generic/atoms/Label";
import { Section } from "../generic/atoms/Section";

export const DeviceSpecificWarnings = () => {
    const { t } = useTranslation("Home", { keyPrefix: "warnings" });
    const [scheduledNotifications] = useState(() => Platform.OS === "android" || Platform.OS === "ios");
    const [cacheImages] = useState(() => Platform.OS === "android" || Platform.OS === "ios");
    const pushNotifications = useMemo(() => scheduledNotifications && Device.isDevice, [scheduledNotifications]);
    const warningsHidden = useAppSelector((state) => state.auxiliary.deviceWarningsHidden);
    const dispatch = useAppDispatch();

    if (warningsHidden) {
        return null;
    }
    if (scheduledNotifications && pushNotifications && cacheImages) {
        // If we can do all things, do not return any warnings
        return null;
    }

    return (
        <>
            <Section title={t("title")} subtitle={t("subtitle")} icon="information" />

            <Label type="para">
                {[
                    // Scheduled notification warning.
                    !scheduledNotifications && t("no_notifications"),
                    // Push notification warning.
                    !pushNotifications && t("no_push_notifications"),
                    // Image caching on web warning.
                    !cacheImages && t("no_image_caching"),
                ]
                    .filter(Boolean)
                    .join("\n\n")}
                <Label variant="bold" color="secondary" onPress={() => dispatch(hideDeviceWarnings())}>
                    {" " + t("hide")}
                </Label>
            </Label>
        </>
    );
};
