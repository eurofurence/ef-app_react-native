import { useIsFocused } from "@react-navigation/core";
import { chain } from "lodash";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { appStyles } from "../../components/AppStyles";
import { EventCard, eventInstanceForAny } from "../../components/events/EventCard";
import { Label } from "../../components/generic/atoms/Label";
import { Floater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";
import { useNow } from "../../hooks/time/useNow";
import { useAppDispatch, useAppSelector } from "../../store";
import { unhideEvent } from "../../store/auxiliary/slice";
import { eventsSelector } from "../../store/eurofurence/selectors/records";
import { useZoneAbbr } from "../../hooks/time/useZoneAbbr";

export const RevealHidden = () => {
    const { t } = useTranslation("RevealHidden");
    const isFocused = useIsFocused();
    const now = useNow(isFocused ? 5 : "static");
    const dispatch = useAppDispatch();
    const zone = useZoneAbbr();
    const all = useAppSelector(eventsSelector.selectAll);
    const hidden = useMemo(
        () =>
            chain(all)
                .filter((item) => item.Hidden)
                .map((details) => eventInstanceForAny(details, now, zone))
                .value(),
        [all, now, zone],
    );
    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{t("title")}</Header>
            <Floater contentStyle={appStyles.trailer}>
                <Label type="lead" variant="middle" mt={30}>
                    {t("lead")}
                </Label>

                {hidden.map((item) => (
                    <EventCard key={item.details.Id} event={item} type="time" onPress={() => dispatch(unhideEvent(item.details.Id))} />
                ))}
            </Floater>
        </ScrollView>
    );
};
