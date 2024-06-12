import Fuse from "fuse.js";
import { TFunction } from "i18next";
import { chain, orderBy } from "lodash";
import { Moment } from "moment";
import moment from "moment/moment";
import { useMemo } from "react";

import { dealerInstanceForAny } from "../../components/dealers/DealerCard";
import { dealerSectionForTitle } from "../../components/dealers/DealerSection";
import { useAppSelector } from "../../store";
import { selectDealerCategoryMapper } from "../../store/eurofurence.selectors";
import { DealerDetails } from "../../store/eurofurence.types";

/**
 * Properties to use in search.
 */
export const dealerSearchProperties: Fuse.FuseOptionKey<DealerDetails>[] = [
    {
        name: "FullName",
        weight: 2,
    },
    {
        name: "Categories",
        weight: 1,
    },
    {
        name: "ShortDescription",
        weight: 1,
    },
    {
        name: "AboutTheArtistText",
        weight: 1,
    },
    {
        name: "AboutTheArtText",
        weight: 1,
    },
];

/**
 * Search options.
 */
export const dealerSearchOptions: Fuse.IFuseOptions<DealerDetails> = {
    shouldSort: true,
    threshold: 0.3,
};

/**
 * Returns a list of dealer instances or section headers according to conversion rules.
 * @param t The translation function.
 * @param now The current moment.
 * @param results Results for search if given.
 * @param all General results.
 */
export const useDealerGroups = (t: TFunction, now: Moment, results: DealerDetails[] | null, all: DealerDetails[]) => {
    const categoryOf = useAppSelector(selectDealerCategoryMapper);
    return useMemo(() => {
        const day1 = moment().day(1).format("dddd");
        const day2 = moment().day(2).format("dddd");
        const day3 = moment().day(3).format("dddd");

        // Sort only if not on search results, where score is included in sort.
        return chain(results ?? all)
            .thru((current) => (results === null ? orderBy(current, "FullName") : current))
            .groupBy((dealer) => categoryOf(dealer))
            .entries()
            .flatMap(([category, dealers]) =>
                results === null
                    ? [
                          // Header
                          dealerSectionForTitle(category),
                          // Dealer instances.
                          ...dealers.map((details) => dealerInstanceForAny(details, now, day1, day2, day3)),
                      ]
                    : dealers.map((details) => dealerInstanceForAny(details, now, day1, day2, day3)),
            )
            .value();
    }, [t, now, results, all]);
};
