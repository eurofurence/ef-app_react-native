import { captureException } from "@sentry/react-native";
import { TFunction } from "i18next";
import { useMemo } from "react";
import { Share } from "react-native";
import { format, setDay } from "date-fns";

import { DealerDetailsInstance, dealerInstanceForAny } from "@/components/dealers/DealerCard";
import { dealerSectionForCategory, dealerSectionForLetter, dealerSectionForLocation, DealerSectionProps } from "@/components/dealers/DealerSection";
import { appBase, conAbbr } from "@/configuration";
// Removed Redux hooks; now we use a default category mapper
// import { useAppSelector } from "../../store";
// import { selectDealerCategoryMapper } from "../../store/eurofurence/selectors/dealers";
import { DealerDetails } from "@/store/eurofurence/types";
import { selectDealerCategoryMapper, useDealersData } from "@/store/eurofurence/selectors/dealers";

/**
 * Compares category, checks if the categories are adult labeled.
 * @param left Left category.
 * @param right Right category.
 */
const compareCategory = (left: string, right: string) => {
    const leftAdult = left.toLowerCase().includes("adult");
    const rightAdult = right.toLowerCase().includes("adult");
    if (!leftAdult) {
        if (!rightAdult) return left < right ? -1 : left > right ? 1 : 0;
        else return -1;
    } else {
        if (!rightAdult) return 1;
        else return left < right ? -1 : left > right ? 1 : 0;
    }
};

/**
 * Returns a list of dealer instances according to conversion rules.
 * @param t The translation function.
 * @param now The current date.
 * @param items The items to transform.
 */
export const useDealerInstances = (t: TFunction, now: Date, items: DealerDetails[]) => {
    return useMemo(() => {
        // Using date-fns to compute day names for Monday, Tuesday, and Wednesday.
        const day1 = format(setDay(new Date(), 1, { weekStartsOn: 0 }), "EEEE");
        const day2 = format(setDay(new Date(), 2, { weekStartsOn: 0 }), "EEEE");
        const day3 = format(setDay(new Date(), 3, { weekStartsOn: 0 }), "EEEE");
        return items.map((item) => dealerInstanceForAny(item, now, day1, day2, day3));
    }, [t, now, items]);
};

/**
 * Returns a list of dealer instances or section headers according to conversion rules.
 * @param t The translation function.
 * @param now The current date.
 * @param results Results for search if given.
 * @param all General results.
 */
export const useDealerGroups = (t: TFunction, now: Date, results: DealerDetails[] | null, all: DealerDetails[]) => {
    // Instead of using a Redux selector for category mapping, we use a default function.
    // TODO: See type of selectDealerCategoryMapper
    const dealers = useDealersData();

    const categoryOf = useMemo(() => selectDealerCategoryMapper(dealers), [dealers]);
    return useMemo(() => {
        const source = results ?? all;
        const day1 = format(setDay(new Date(), 1, { weekStartsOn: 0 }), "EEEE");
        const day2 = format(setDay(new Date(), 2, { weekStartsOn: 0 }), "EEEE");
        const day3 = format(setDay(new Date(), 3, { weekStartsOn: 0 }), "EEEE");

        // Build a map of categories.
        const categoryMap: Record<string, DealerDetailsInstance[]> = {};
        const result: (DealerSectionProps | DealerDetailsInstance)[] = [];

        // If results are provided (search mode), simply map items.
        for (const item of source) {
            if (results) {
                result.push(dealerInstanceForAny(item, now, day1, day2, day3));
            } else {
                const category = categoryOf(item) || "No category";
                (categoryMap[category] ??= []).push(dealerInstanceForAny(item, now, day1, day2, day3));
            }
        }

        // Create sections for each category in sorted order.
        for (const category of Object.keys(categoryMap).sort(compareCategory)) {
            result.push(dealerSectionForCategory(category));
            result.push(...categoryMap[category]);
        }

        return result;
    }, [t, now, results, all]);
};

/**
 * Returns a list of dealer instances or section headers according to location.
 * @param t The translation function.
 * @param now The current date.
 * @param results Results for search if given.
 * @param all General results.
 */
export const useDealerLocationGroups = (t: TFunction, now: Date, results: DealerDetails[] | null, all: DealerDetails[]) => {
    return useMemo(() => {
        const source = results ?? all;
        const day1 = format(setDay(new Date(), 1, { weekStartsOn: 0 }), "EEEE");
        const day2 = format(setDay(new Date(), 2, { weekStartsOn: 0 }), "EEEE");
        const day3 = format(setDay(new Date(), 3, { weekStartsOn: 0 }), "EEEE");

        let sectionedRegular = false;
        let sectionedAd = false;

        const result: (DealerSectionProps | DealerDetailsInstance)[] = [];
        for (const item of source) {
            if (results) {
                result.push(dealerInstanceForAny(item, now, day1, day2, day3));
            } else if (item.IsAfterDark === false) {
                if (!sectionedRegular) {
                    result.push(dealerSectionForLocation(t, false));
                    sectionedRegular = true;
                }
                result.push(dealerInstanceForAny(item, now, day1, day2, day3));
            }
        }
        for (const item of source) {
            if (results) {
                result.push(dealerInstanceForAny(item, now, day1, day2, day3));
            } else if (item.IsAfterDark === true) {
                if (!sectionedAd) {
                    result.push(dealerSectionForLocation(t, true));
                    sectionedAd = true;
                }
                result.push(dealerInstanceForAny(item, now, day1, day2, day3));
            }
        }

        return result;
    }, [t, now, results, all]);
};

/**
 * Returns a list of dealer instances or section headers sorted alphabetically.
 * @param t The translation function.
 * @param now The current date.
 * @param results Results for search if given.
 * @param all General results.
 */
export const useDealerAlphabeticalGroups = (t: TFunction, now: Date, results: DealerDetails[] | null, all: DealerDetails[]) => {
    return useMemo(() => {
        const source = results ?? all;
        const day1 = format(setDay(new Date(), 1, { weekStartsOn: 0 }), "EEEE");
        const day2 = format(setDay(new Date(), 2, { weekStartsOn: 0 }), "EEEE");
        const day3 = format(setDay(new Date(), 3, { weekStartsOn: 0 }), "EEEE");

        const sectionedLetters: Record<string, boolean> = {};
        const result: (DealerSectionProps | DealerDetailsInstance)[] = [];
        for (const item of source) {
            if (results) {
                result.push(dealerInstanceForAny(item, now, day1, day2, day3));
            } else {
                const firstLetter = item.DisplayNameOrAttendeeNickname[0].toUpperCase();
                if (!(firstLetter in sectionedLetters)) {
                    result.push(dealerSectionForLetter(firstLetter));
                    sectionedLetters[firstLetter] = true;
                }
                result.push(dealerInstanceForAny(item, now, day1, day2, day3));
            }
        }
        return result;
    }, [t, now, results, all]);
};

export const shareDealer = (dealer: DealerDetails) =>
    Share.share(
        {
            title: dealer.DisplayNameOrAttendeeNickname,
            url: `${appBase}/Web/Dealers/${dealer.Id}`,
            message: `Check out ${dealer.DisplayNameOrAttendeeNickname} on ${conAbbr}!\n${appBase}/Web/Dealers/${dealer.Id}`
        },
        {}
    ).catch(captureException);
