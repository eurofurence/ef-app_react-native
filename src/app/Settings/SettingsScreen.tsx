import CheckBox from "@react-native-community/checkbox";
import React from "react";
import { useTranslation } from "react-i18next";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Row } from "../../components/Containers/Row";
import { Scroller } from "../../components/Containers/Scroller";
import { useAppDispatch, useAppSelector } from "../../store";
import { showTimeTravel } from "../../store/timetravel.slice";

const TimeTravelCheckbox = React.memo(() => {
    const { t } = useTranslation("Settings");
    const dispatch = useAppDispatch();
    const visible = useAppSelector((state) => state.timetravel.visible);
    return (
        <Row>
            <CheckBox value={visible} onValueChange={(value) => dispatch(showTimeTravel(value))} />
            <Label mb={15}>{t("timeTravel")}</Label>
        </Row>
    );
});

export const SettingsScreen = () => {
    return (
        <Scroller>
            <Section title={"Developer Settings"} />

            <TimeTravelCheckbox />
        </Scroller>
    );
};
