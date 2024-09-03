import Checkbox from "expo-checkbox";
import { noop } from "lodash";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useAppDispatch, useAppSelector } from "../../store";
import { setAnalytics, toggleDevMenu } from "../../store/settings/slice";
import { Label } from "../generic/atoms/Label";
import { Col } from "../generic/containers/Col";
import { SettingContainer } from "./SettingContainer";

/**
 * Analytics opt-in section with a checkbox to allow analytics.
 * @constructor
 */
export const AnalyticsOptIns = () => {
    const { t } = useTranslation("Settings");
    const dispatch = useAppDispatch();
    const analyticsEnabled = useAppSelector((state) => state.settingsSlice.analytics.enabled);
    return (
        <SettingContainer>
            <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => dispatch(setAnalytics(!analyticsEnabled))}
                onLongPress={() =>
                    Alert.alert(t("developer_settings_alert.title"), t("developer_settings_alert.body"), [
                        {
                            text: t("developer_settings_alert.cancel"),
                            onPress: noop,
                            style: "cancel",
                        },
                        {
                            text: t("developer_settings_alert.disable"),
                            onPress: () => dispatch(toggleDevMenu(false)),
                            style: "default",
                        },
                        {
                            text: t("developer_settings_alert.enable"),
                            onPress: () => dispatch(toggleDevMenu(true)),
                            style: "destructive",
                        },
                    ])
                }
                delayLongPress={1000}
            >
                <Col style={{ flex: 1 }}>
                    <Label variant="bold">{t("allowAnalytics")}</Label>
                    <Label variant="narrow">{t("allowAnalyticsSubtitle")}</Label>
                </Col>

                <Checkbox value={analyticsEnabled} />
            </TouchableOpacity>
        </SettingContainer>
    );
};
