import { flatMap, maxBy, uniq } from "lodash";
import { parseISO, isAfter } from "date-fns";

import { DealerDetails } from "../types";
import { useDataCache } from "@/context/DataCacheProvider";

export const useDealersData = () => {
    const { getAllCacheSync } = useDataCache();
    return getAllCacheSync<DealerDetails[]>("dealers") || [];
};

export const selectDealersInRegular = () => {
    const dealers = useDealersData();
    return dealers.filter((it) => !it.data[0].IsAfterDark);
};

export const selectDealersInAd = () => {
    const dealers = useDealersData();
    return dealers.filter((it) => it.data[0].IsAfterDark);
};

export const selectFavoriteDealers = () => {
    const dealers = useDealersData();
    return dealers.filter((dealer) => dealer.data[0].Favorite);
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
            if (item.data[0].Categories)
                for (let j = 0; j < item.data[0].Categories.length; j++) {
                    if (item.data[0].Categories[j] === category) {
                        n++;
                        break;
                    }
                }
        }
        return Math.log(dealers.length / (n + 1)) + 1;
    }

    const allCategories = uniq(flatMap(dealers, (dealer) => dealer.data[0].Categories ?? []));
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
        if (dealer.data[0].Categories) {
            for (const category of dealer.data[0].Categories) {
                if (!result.includes(category)) result.push(category);
            }
        }
    }
    return result;
};

export const selectUpdatedFavoriteDealers = () => {
    const dealers = useDealersData();
    const { getCacheSync } = useDataCache();
    const lastViewTimesUtc = getCacheSync<Record<string, string>>("auxiliary", "lastViewTimesUtc")?.data || {};

    return dealers.filter(
        (dealer) =>
            lastViewTimesUtc && dealer.data[0].Id in lastViewTimesUtc && isAfter(parseISO(dealer.data[0].LastChangeDateTimeUtc), parseISO(lastViewTimesUtc[dealer.data[0].Id])),
    );
};
