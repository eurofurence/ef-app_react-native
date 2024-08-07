import * as Device from "expo-device";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import { useAppSelector } from "../../store";
import { Label } from "../generic/atoms/Label";
import { Section } from "../generic/atoms/Section";

export const DeviceSpecificWarnings = () => {
    const { t } = useTranslation("Home");
    const [scheduledNotifications] = useState(() => Platform.OS === "android" || Platform.OS === "ios");
    const [cacheImages] = useState(() => Platform.OS === "android" || Platform.OS === "ios");
    const pushNotifications = useMemo(() => scheduledNotifications && Device.isDevice, [scheduledNotifications]);
    const warningsHidden = useAppSelector((state) => state.auxiliary.deviceWarningsHidden);

    if (warningsHidden) {
        return null;
    }
    if (scheduledNotifications && pushNotifications && cacheImages) {
        // If we can do all things, do not return any warnings
        return null;
    }

    return (
        <>
            <Section title={t("warnings.title")} subtitle={t("warnings.subtitle")} icon="information" />

            {!scheduledNotifications && <Label mt={10}>{t("warnings.no_notifications")}</Label>}
            {!pushNotifications && <Label mt={10}>{t("warnings.no_push_notifications")}</Label>}
            {!cacheImages && <Label mt={10}>{t("warnings.no_image_caching")}</Label>}
        </>
    );
};
