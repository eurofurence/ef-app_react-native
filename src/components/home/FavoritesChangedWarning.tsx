import React from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "../../store";
import { selectUpdatedFavoriteDealers } from "../../store/eurofurence/selectors/dealers";
import { selectUpdatedFavoriteEvents } from "../../store/eurofurence/selectors/events";
import { Label } from "../generic/atoms/Label";
import { Section } from "../generic/atoms/Section";

export const FavoritesChangedWarning = () => {
    const { t: tMenu } = useTranslation("Menu");
    const { t } = useTranslation("Home");
    const changedEventFavorite = useAppSelector(selectUpdatedFavoriteEvents);
    const changedDealerFavorite = useAppSelector(selectUpdatedFavoriteDealers);
    if (!changedEventFavorite.length && !changedDealerFavorite.length) {
        return null;
    }

    return (
        <>
            <Section title={t("warnings.favorites_changed")} subtitle={t("warnings.favorites_changed_subtitle")} icon="update" />

            {!changedEventFavorite.length ? null : (
                <Label mt={5}>
                    <Label variant="bold">{tMenu("events")}: </Label>
                    {changedEventFavorite.map((event) => event.Title).join(", ")}
                </Label>
            )}
            {!changedDealerFavorite.length ? null : (
                <Label mt={5}>
                    <Label variant="bold">{tMenu("dealers")}: </Label>
                    {changedDealerFavorite.map((dealer) => dealer.FullName).join(", ")}
                </Label>
            )}
        </>
    );
};
