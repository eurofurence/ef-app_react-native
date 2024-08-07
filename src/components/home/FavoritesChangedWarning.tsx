import React from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "../../store";
import { selectUpdatedFavoriteDealers } from "../../store/eurofurence/selectors/dealers";
import { selectUpdatedFavoriteEvents } from "../../store/eurofurence/selectors/events";
import { Label } from "../generic/atoms/Label";
import { Section } from "../generic/atoms/Section";

export const FavoritesChangedWarning = ({ parentPad = 0 }) => {
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
                <Label type="strong">
                    Events: <Label type="regular">{changedEventFavorite.map((event) => event.Title).join(", ")}</Label>
                </Label>
            )}
            {!changedDealerFavorite.length ? null : (
                <Label type="strong">
                    Dealers: <Label type="regular">{changedDealerFavorite.map((dealer) => dealer.FullName).join(", ")}</Label>
                </Label>
            )}
        </>
    );
};
