import { TFunction } from "i18next";
import { chain, orderBy } from "lodash";
import { Moment } from "moment";
import moment from "moment/moment";
import { useMemo } from "react";

import { dealerInstanceForAny } from "../../components/dealers/DealerCard";
import { dealerSectionForCategory, dealerSectionForLetter } from "../../components/dealers/DealerSection";
import { useAppSelector } from "../../store";
import { selectDealerCategoryMapper } from "../../store/eurofurence/selectors/dealers";
import { DealerDetails } from "../../store/eurofurence/types";

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
                          dealerSectionForCategory(category),
                          // Dealer instances.
                          ...dealers.map((details) => dealerInstanceForAny(details, now, day1, day2, day3)),
                      ]
                    : dealers.map((details) => dealerInstanceForAny(details, now, day1, day2, day3)),
            )
            .value();
    }, [t, now, results, all, categoryOf]);
};

/**
 * Returns a list of dealer instances or section headers according to conversion rules.
 * @param t The translation function.
 * @param now The current moment.
 * @param results Results for search if given.
 * @param all General results.
 */
export const useDealerAlphabeticalGroups = (t: TFunction, now: Moment, results: DealerDetails[] | null, all: DealerDetails[]) => {
    return useMemo(() => {
        const day1 = moment().day(1).format("dddd");
        const day2 = moment().day(2).format("dddd");
        const day3 = moment().day(3).format("dddd");

        // Sort only if not on search results, where score is included in sort.
        return chain(results ?? all)
            .thru((current) => (results === null ? orderBy(current, "FullName") : current))
            .groupBy((dealer) => dealer.FullName[0])
            .entries()
            .flatMap(([firstLetter, dealers]) =>
                results === null
                    ? [
                          // Header
                          dealerSectionForLetter(firstLetter),
                          // Dealer instances.
                          ...dealers.map((details) => dealerInstanceForAny(details, now, day1, day2, day3)),
                      ]
                    : dealers.map((details) => dealerInstanceForAny(details, now, day1, day2, day3)),
            )
            .value();
    }, [t, now, results, all]);
};
