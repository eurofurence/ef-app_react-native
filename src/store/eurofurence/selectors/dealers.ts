import { createSelector } from "@reduxjs/toolkit";
import { flatMap, maxBy, uniq } from "lodash";
import moment from "moment/moment";

import { dealersSelectors } from "./records";
import { DealerDetails } from "../types";

export const selectDealersInRegular = createSelector([dealersSelectors.selectAll], (dealers) => dealers.filter((it) => !it.IsAfterDark));
export const selectDealersInAd = createSelector([dealersSelectors.selectAll], (dealers) => dealers.filter((it) => it.IsAfterDark));
export const selectFavoriteDealers = createSelector([dealersSelectors.selectAll], (dealers) => dealers.filter((dealer) => dealer.Favorite));

/**
 * TF-IDF category mapper. Returns the category for a dealer that is the most "unique" for them among all other dealers.
 */
export const selectDealerCategoryMapper = createSelector([dealersSelectors.selectAll], (dealers) => {
    function tf(category: string, categories: string[]) {
        let n = 0;
        for (const item of categories) if (item === category) n++;

        return n / (categories.length + 1);
    }

    function idf(category: string) {
        let n = 0;
        for (const item of dealers) {
            if (item.Categories)
                for (let j = 0; j < item.Categories.length; j++) {
                    if (item.Categories[j] === category) {
                        n++;
                        break;
                    }
                }
        }
        return Math.log(dealers.length / (n + 1)) + 1;
    }

    const allCategories = uniq(flatMap(dealers, (dealer) => dealer.Categories ?? []));
    const allIdf = Object.fromEntries(allCategories.map((category) => [category, idf(category)]));

    return (dealer: DealerDetails) => {
        const categories = dealer.Categories;
        return categories ? maxBy(categories, (category) => tf(category, categories) * allIdf[category]!) : null;
    };
});

export const selectDealerCategories = createSelector([dealersSelectors.selectAll], (dealers) => {
    const result: string[] = [];
    for (const dealer of dealers) {
        if (dealer.Categories) {
            for (const category of dealer.Categories) {
                if (!result.includes(category)) result.push(category);
            }
        }
    }
    return result;
});

export const selectUpdatedFavoriteDealers = createSelector([selectFavoriteDealers, (state) => state.auxiliary.lastViewTimes], (favorites, lastViewTimes) =>
    // Is favorite and has ever been viewed and the update is after when it was viewed.
    favorites.filter((dealer) => dealer.Id in lastViewTimes && moment(dealer.LastChangeDateTimeUtc).isAfter(lastViewTimes[dealer.Id])),
);
