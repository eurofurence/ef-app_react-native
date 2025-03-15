import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDataCache } from "@/context/DataCacheProvider";
import { useAuxiliary } from "@/store/auxiliary/slice";
import { Label } from "../generic/atoms/Label";
import { Section } from "../generic/atoms/Section";
import { DealerDetails, EventDetails } from "@/store/eurofurence/types";

export const FavoritesChangedWarning = () => {
    const { t: tMenu } = useTranslation("Menu");
    const { t } = useTranslation("Home");
    const { getAllCache } = useDataCache();
    const { state } = useAuxiliary();
    const [favoriteEvents, setFavoriteEvents] = useState<EventDetails[]>([]);
    const [favoriteDealers, setFavoriteDealers] = useState<DealerDetails[]>([]);

    useEffect(() => {
        async function loadFavorites() {
            // Retrieve cached events and dealers from DataCacheProvider
            const eventCache = await getAllCache<EventDetails>("events");
            const dealerCache = await getAllCache<DealerDetails>("dealers");
            // Extract data and filter for favorites
            const events = eventCache.map((item) => item.data).filter((event: EventDetails) => event.Favorite);
            const dealers = dealerCache.map((item) => item.data).filter((dealer: DealerDetails) => dealer.Favorite);
            setFavoriteEvents(events);
            setFavoriteDealers(dealers);
        }
        loadFavorites();
    }, [getAllCache]);

    // Compute updated favorites based on lastViewTimesUtc from auxiliary state
    const changedEventFavorite = favoriteEvents.filter(
        (event) => state.lastViewTimesUtc && event.Id in state.lastViewTimesUtc && new Date(event.LastChangeDateTimeUtc) > new Date(state.lastViewTimesUtc[event.Id]),
    );

    const changedDealerFavorite = favoriteDealers.filter(
        (dealer) => state.lastViewTimesUtc && dealer.Id in state.lastViewTimesUtc && new Date(dealer.LastChangeDateTimeUtc) > new Date(state.lastViewTimesUtc[dealer.Id]),
    );

    if (!changedEventFavorite.length && !changedDealerFavorite.length) {
        return null;
    }

    return (
        <>
            <Section title={t("warnings.favorites_changed")} subtitle={t("warnings.favorites_changed_subtitle")} icon="update" />

            {changedEventFavorite.length > 0 && (
                <Label mt={5}>
                    <Label variant="bold">{tMenu("events")}: </Label>
                    {changedEventFavorite.map((event) => event.Title).join(", ")}
                </Label>
            )}
            {changedDealerFavorite.length > 0 && (
                <Label mt={5}>
                    <Label variant="bold">{tMenu("dealers")}: </Label>
                    {changedDealerFavorite.map((dealer) => dealer.DisplayNameOrAttendeeNickname).join(", ")}
                </Label>
            )}
        </>
    );
};
