import { StyleSheet } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/core";
import { CountdownHeader } from "@/components/home/CountdownHeader";
import { Search } from "@/components/generic/atoms/Search";
import { useNow } from "@/hooks/time/useNow";
import { Floater, padFloater } from "@/components/generic/containers/Floater";
import { LanguageWarnings } from "@/components/home/LanguageWarnings";
import { appStyles } from "@/components/AppStyles";
import { RecentAnnouncements } from "@/components/announce/RecentAnnouncements";
import { GlobalSearch } from "@/components/home/GlobalSearch";
import { DeviceSpecificWarnings } from "@/components/home/DeviceSpecificWarnings";
import { useFuseIntegration } from "@/hooks/searching/useFuseIntegration";
import { TimezoneWarning } from "@/components/home/TimezoneWarning";
import { FavoritesChangedWarning } from "@/components/home/FavoritesChangedWarning";

export default function IndexScreen() {
    const isFocused = useIsFocused();
    const now = useNow(isFocused ? 5 : "static");

    // Search integration.
    const [filter, setFilter, results] = useFuseIntegration(selectGlobalSearchIndex, 15);

    const { synchronizeUi, isSynchronizing } = useSynchronizer();
    return (
        <ScrollView style={StyleSheet.absoluteFill} refreshControl={<RefreshControl refreshing={isSynchronizing} onRefresh={synchronizeUi} />}>
            <CountdownHeader />
            <Search filter={filter} setFilter={setFilter} />
            <Floater contentStyle={appStyles.trailer}>
                <LanguageWarnings parentPad={padFloater} />
                <TimezoneWarning parentPad={padFloater} />
                <DeviceSpecificWarnings />
                <FavoritesChangedWarning />
                {results ? (
                    <GlobalSearch navigation={navigation} now={now} results={results} />
                ) : (
                    <>
                        <RecentAnnouncements now={now} />
                        <UpcomingEventsList now={now} />
                        <TodayScheduleList now={now} />
                        <CurrentEventList now={now} />
                    </>
                )}
            </Floater>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});
