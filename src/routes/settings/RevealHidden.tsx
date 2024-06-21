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
import { selectHiddenEvents } from "../../store/eurofurence/selectors/events";

export const RevealHidden = () => {
    const { t } = useTranslation("RevealHidden");
    const isFocused = useIsFocused();
    const now = useNow(isFocused ? 5 : "static");
    const dispatch = useAppDispatch();
    const hiddenEvents = useAppSelector(selectHiddenEvents);
    const all = useMemo(
        () =>
            chain(hiddenEvents)
                .orderBy("StartDateTimeUtc")
                .map((details) => eventInstanceForAny(details, now))
                .value(),
        [hiddenEvents, now],
    );
    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{t("title")}</Header>
            <Floater contentStyle={appStyles.trailer}>
                <Label type="lead" variant="middle" mt={30}>
                    {t("lead")}
                </Label>

                {all.map((item) => (
                    <EventCard key={item.details.Id} event={item} type="time" onPress={() => dispatch(unhideEvent(item.details.Id))} />
                ))}
            </Floater>
        </ScrollView>
    );
};
