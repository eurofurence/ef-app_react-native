import { flatMap, maxBy, uniq } from "lodash";
import { parseISO, isAfter } from "date-fns";

import { DealerDetails } from "../types";
import { useDataCache } from "@/context/DataCacheProvider";

export const useDealersData = () => {
    const { getAllCacheSync } = useDataCache();
    return getAllCacheSync("dealers") || [];
};

export const selectDealersInRegular = () => {
    const dealers = useDealersData();
    return dealers.filter((it) => !it.data.IsAfterDark);
};

export const selectDealersInAd = () => {
    const dealers = useDealersData();
    return dealers.filter((it) => it.data.IsAfterDark);
};

export const selectFavoriteDealers = () => {
    const dealers = useDealersData();
    return dealers.filter((dealer) => dealer.data.Favorite);
};

/**
 * TF-IDF category mapper. Returns the category for a dealer that is the most "unique" for them among all other dealers.
 */
export const selectDealerCategoryMapper = () => {
    const dealers = useDealersData();

    function tf(category: string, categories: string[]) {
        let n = 0;
        for (const item of categories) if (item === category) n++;

        return n / (categories.length + 1);
    }

    function idf(category: string) {
        let n = 0;
        for (const item of dealers) {
            if (item.data.Categories)
                for (let j = 0; j < item.data.Categories.length; j++) {
                    if (item.data.Categories[j] === category) {
                        n++;
                        break;
                    }
                }
        }
        return Math.log(dealers.length / (n + 1)) + 1;
    }

    const allCategories = uniq(flatMap(dealers, (dealer) => dealer.data.Categories ?? []));
    const allIdf = Object.fromEntries(allCategories.map((category) => [category, idf(category)]));

    return (dealer: DealerDetails) => {
        const categories = dealer.Categories;
        return categories ? maxBy(categories, (category) => tf(category, categories) * allIdf[category]!) : null;
    };
};

export const selectDealerCategories = () => {
    const dealers = useDealersData();
    const result: string[] = [];
    for (const dealer of dealers) {
        if (dealer.data.Categories) {
            for (const category of dealer.data.Categories) {
                if (!result.includes(category)) result.push(category);
            }
        }
    }
    return result;
};

export const selectUpdatedFavoriteDealers = () => {
    const dealers = useDealersData();
    const { getCacheSync } = useDataCache();
    const lastViewTimes = (getCacheSync("settings", "lastViewTimes")?.data || {}) as Record<string, string>;
    
    return dealers.filter(
        (dealer) =>
            lastViewTimes && dealer.data.Id in lastViewTimes && isAfter(parseISO(dealer.data.LastChangeDateTimeUtc), parseISO(lastViewTimes[dealer.data.Id])),
    );
};
