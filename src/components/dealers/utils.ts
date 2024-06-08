import moment from "moment/moment";

import { DealerDetails } from "../../store/eurofurence.types";

/**
 * True if for the given moment the dealer is attending.
 * @param dealer The dealer to check.
 * @param now The moment instance.
 */
export const isPresent = (dealer: DealerDetails, now: moment.Moment) => {
    return Boolean(dealer.AttendanceDays.find((day) => now.isSame(day.Date, "day")));
};

/**
 * Concatenates the days that the dealers is attending. Note that the data model
 * does not align with the actual days.
 *
 * @param dealer The dealer to create the string for.
 * @param day1 The day to use for "Thursday".
 * @param day2 The day to use for "Friday".
 * @param day3 The day to use for "Saturday".
 */
export const joinOffDays = (dealer: DealerDetails, day1: string, day2: string, day3: string) => {
    return [!dealer.AttendsOnThursday && day1, !dealer.AttendsOnFriday && day2, !dealer.AttendsOnSaturday && day3].filter(Boolean).join(", ");
};
