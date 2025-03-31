import { getHours, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { AttendanceDay, DealerRecord, EventDayDetails } from "./types";
import { IconNames } from "@/components/generic/atoms/Icon";
import { conTimeZone } from "@/configuration";

export const internalCategorizeTime = (dateStr: string) => {
    const date = toZonedTime(parseISO(dateStr), conTimeZone);
    const hours = getHours(date);
    if (6 <= hours && hours < 13) return "morning";
    if (13 <= hours && hours < 17) return "afternoon";
    if (17 <= hours && hours < 21) return "evening";
    return "night";
};

export const internalTagsToIcon = (tags?: string[]): IconNames | undefined => {
    if (!tags) return;
    if (tags.includes("supersponsors_only")) return "star-circle";
    if (tags.includes("sponsors_only")) return "star";
    if (tags.includes("ticketed")) return "ticket";
    if (tags.includes("kage")) return "bug";
    if (tags.includes("art_show")) return "image-frame";
    if (tags.includes("dealers_den")) return "shopping";
    if (tags.includes("main_stage")) return "bank";
    if (tags.includes("photoshoot")) return "camera";
};

export const internalTagsToBadges = (tags?: string[]): IconNames[] | undefined => {
    if (!tags) return [];

    const badges: IconNames[] = [];
    if (tags.includes("mask_required")) badges.push("face-mask");
    return badges;
};

export const internalSuperSponsorOnly = (tags?: string[]) => Boolean(tags?.includes("supersponsors_only"));

export const internalSponsorOnly = (tags?: string[]) => Boolean(tags?.includes("sponsors_only"));

export const internalMaskRequired = (tags?: string[]) => Boolean(tags?.includes("mask_required"));

export const internalAttendanceDayNames = (dealer: DealerRecord) => {
    const result: AttendanceDay[] = [];
    if (dealer.AttendsOnThursday) result.push("mon");
    if (dealer.AttendsOnFriday) result.push("tue");
    if (dealer.AttendsOnSaturday) result.push("wed");
    return result;
};

export const internalAttendanceDays = (days: EventDayDetails[], dealer: DealerRecord) => {
    const result: EventDayDetails[] = [];
    for (const day of days) {
        // Sun:0, Mon:1 , Tue:2, Wed:3, Thu:4, Fri:5, Sat:6.
        if (dealer.AttendsOnThursday && day.DayOfWeek === 4) result.push(day);
        if (dealer.AttendsOnFriday && day.DayOfWeek === 5) result.push(day);
        if (dealer.AttendsOnSaturday && day.DayOfWeek === 6) result.push(day);
    }
    return result;
};

export const internalDealerParseTable = (dealer: DealerRecord) => {
    if (!dealer.ShortDescription) return undefined;
    if (!dealer.ShortDescription?.startsWith("Table")) return undefined;

    return dealer.ShortDescription.split(/\r?\n/, 1)[0].substring("Table".length).trim();
};

export const internalDealerParseDescriptionContent = (dealer: DealerRecord) => {
    if (!dealer.ShortDescription) return dealer.ShortDescription;
    if (!dealer.ShortDescription?.startsWith("Table")) return dealer.ShortDescription;

    return dealer.ShortDescription.split(/\r?\n/).slice(1).join("\n").trimStart();
};

export const internalFixedTitle = (title: string, content: string) => {
    // Not ellipsized, skip.
    if (!title.endsWith("[...]")) return title;

    // Get init of title without hard ellipses. If that's not the start of the
    // content, something else happened, skip.
    const init = title.substring(0, title.length - 5);
    if (!content.startsWith(init)) return title;

    // Check the longest full sentence to be extracted. Use if present.
    const index = Math.max(init.indexOf("."), init.indexOf("!"), init.indexOf("?"), init.indexOf("\n"));
    if (index < 0) return init;
    return init.substring(0, index + 1);
};

export const internalMastodonHandleToProfileUrl = (handle: string) => {
    // Remove the leading '@' and split the handle into username and instance
    const parts = handle.replace(/^@/, "").split("@");

    if (parts.length !== 2) {
        return undefined;
    }

    const [username, instance] = parts;

    // Construct the URL
    return `https://${instance}/@${username}`;
};
