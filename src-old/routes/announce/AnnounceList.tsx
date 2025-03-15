import { useIsFocused } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { announcementInstanceForAny } from "../../components/announce/AnnouncementCard";
import { AnnouncementList } from "../../components/announce/AnnouncementList";
import { Search } from "../../components/generic/atoms/Search";
import { Header } from "../../components/generic/containers/Header";
import { useFuseIntegration } from "../../hooks/searching/useFuseIntegration";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { selectActiveAnnouncements } from "../../store/eurofurence/selectors/announcements";
import { selectAnnounceAllSearchIndex } from "../../store/eurofurence/selectors/search";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Params handled by the screen in route, nothing so far.
 */
export type AnnounceListParams = undefined;

/**
 * The properties to the screen as a component.
 */
export type AnnounceListProps = StackScreenProps<IndexRouterParamsList, "AnnounceList">;

export const AnnounceList: FC<AnnounceListProps> = ({ navigation }) => {
    const { t } = useTranslation("Announcements");
    const isFocused = useIsFocused();
    const now = useNow(isFocused ? 5 : "static");

    const announcements = useAppSelector((state) => selectActiveAnnouncements(state, now));

    // Search integration.
    const [filter, setFilter, results] = useFuseIntegration(selectAnnounceAllSearchIndex);

    // Compose groups from either results limited to those announcements that
    // are active or using all active results if not searching.
    const announcementGroups = useMemo(() => {
        return (results?.filter((item) => announcements.includes(item)) ?? announcements).map((details) => announcementInstanceForAny(details, now));
    }, [announcements, results, now]);

    return (
        <View style={StyleSheet.absoluteFill}>
            <Header>{t("header")}</Header>
            <AnnouncementList
                navigation={navigation}
                announcements={announcementGroups}
                leader={
                    <>
                        <Search filter={filter} setFilter={setFilter} />
                    </>
                }
            />
        </View>
    );
};
