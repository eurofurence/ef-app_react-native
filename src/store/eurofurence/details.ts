import { Dictionary } from "@reduxjs/toolkit";

import moment, { MomentInput } from "moment";

import { IconNames } from "../../components/generic/atoms/Icon";
import { Notification } from "../background/slice";
import {
    AnnouncementDetails,
    AnnouncementRecord,
    AttendanceDay,
    DealerDetails,
    DealerRecord,
    EventDayDetails,
    EventDayRecord,
    EventDetails,
    EventRecord,
    EventRoomDetails,
    EventTrackDetails,
    ImageDetails,
    MapDetails,
    MapEntryDetails,
    MapRecord,
    RecordId,
} from "./types";

const internalCategorizeTime = (input: MomentInput) => {
    const hours = moment(input).hours();
    if (6 <= hours && hours < 13) return "morning";
    if (13 <= hours && hours < 17) return "afternoon";
    if (17 <= hours && hours < 21) return "evening";
    return "night";
};

const internalTagsToIcon = (tags?: string[]): IconNames | undefined => {
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

const internalTagsToBadges = (tags?: string[]): IconNames[] | undefined => {
    if (!tags) return [];

    const badges: IconNames[] = [];
    if (tags.includes("mask_required")) badges.push("face-mask");
    return badges;
};

const internalSuperSponsorOnly = (tags?: string[]) => Boolean(tags?.includes("supersponsors_only"));

const internalSponsorOnly = (tags?: string[]) => Boolean(tags?.includes("sponsors_only"));

const internalMaskRequired = (tags?: string[]) => Boolean(tags?.includes("mask_required"));

const internalAttendanceDayNames = (dealer: DealerRecord) => {
    const result: AttendanceDay[] = [];
    if (dealer.AttendsOnThursday) result.push("mon");
    if (dealer.AttendsOnFriday) result.push("tue");
    if (dealer.AttendsOnSaturday) result.push("wed");
    return result;
};

const internalAttendanceDays = (days: EventDayDetails[], dealer: DealerRecord) => {
    const result: EventDayDetails[] = [];
    for (const day of days) {
        // Sun:0, Mon:1 , Tue:2, Wed:3, Thu:4, Fri:5, Sat:6.
        if (dealer.AttendsOnThursday && day.dayOfWeek === 4) result.push(day);
        if (dealer.AttendsOnFriday && day.dayOfWeek === 5) result.push(day);
        if (dealer.AttendsOnSaturday && day.dayOfWeek === 6) result.push(day);
    }
    return result;
};

export const applyEventDetails = (
    source: EventRecord,
    images: Dictionary<ImageDetails>,
    rooms: Dictionary<EventRoomDetails>,
    days: Dictionary<EventDayDetails>,
    tracks: Dictionary<EventTrackDetails>,
    favorite: Dictionary<Notification>,
    hiddenIds: string[],
): EventDetails => ({
    ...source,
    PartOfDay: internalCategorizeTime(source.StartDateTimeUtc),
    Poster: !source.PosterImageId ? undefined : images[source.PosterImageId],
    Banner: !source.BannerImageId ? undefined : images[source.BannerImageId],
    Badges: internalTagsToBadges(source.Tags),
    Glyph: internalTagsToIcon(source.Tags),
    SuperSponsorOnly: internalSuperSponsorOnly(source.Tags),
    SponsorOnly: internalSponsorOnly(source.Tags),
    MaskRequired: internalMaskRequired(source.Tags),
    ConferenceRoom: !source.ConferenceRoomId ? undefined : rooms[source.ConferenceRoomId],
    ConferenceDay: !source.ConferenceDayId ? undefined : days[source.ConferenceDayId],
    ConferenceTrack: !source.ConferenceTrackId ? undefined : tracks[source.ConferenceTrackId],
    Favorite: source.Id in favorite,
    Hidden: hiddenIds.includes(source.Id),
});

const internalDealerParseTable = (dealer: DealerRecord) => {
    if (!dealer.ShortDescription) return undefined;
    if (!dealer.ShortDescription?.startsWith("Table")) return undefined;

    return dealer.ShortDescription.split(/\r?\n/, 1)[0].substring("Table".length).trim();
};
const internalDealerParseDescriptionContent = (dealer: DealerRecord) => {
    if (!dealer.ShortDescription) return dealer.ShortDescription;
    if (!dealer.ShortDescription?.startsWith("Table")) return dealer.ShortDescription;

    return dealer.ShortDescription.split(/\r?\n/).slice(1).join("\n").trimStart();
};

const internalFixedTitle = (title: string, content: string) => {
    // Not ellipsized, skip.
    if (!title.endsWith("[...]")) return title;

    // Get init of title without hard ellipses. If that's not the start of the
    // content, something else happened, skip.
    const init = title.substring(0, title.length - 5);
    if (!content.startsWith(init)) return title;

    // Check the longest full sentence to be extracted. Use if present.
    const index = Math.max(init.indexOf("."), init.indexOf("!"), init.indexOf("?"));
    if (index < 0) return title;
    return init.substring(0, index + 1);
};

const internalMastodonHandleToProfileUrl = (handle: string) => {
    // Remove the leading '@' and split the handle into username and instance
    const parts = handle.replace(/^@/, "").split("@");

    if (parts.length !== 2) {
        return undefined;
    }

    const [username, instance] = parts;

    // Construct the URL
    const profileUrl = `https://${instance}/@${username}`;

    return profileUrl;
};

export const applyDealerDetails = (source: DealerRecord, images: Dictionary<ImageDetails>, days: EventDayDetails[], favorites: RecordId[]): DealerDetails => ({
    ...source,
    AttendanceDayNames: internalAttendanceDayNames(source),
    AttendanceDays: internalAttendanceDays(days, source),
    Artist: !source.ArtistImageId ? undefined : images[source.ArtistImageId],
    ArtistThumbnail: !source.ArtistThumbnailImageId ? undefined : images[source.ArtistThumbnailImageId],
    ArtPreview: !source.ArtPreviewImageId ? undefined : images[source.ArtPreviewImageId],
    FullName: source.DisplayNameOrAttendeeNickname,
    ShortDescriptionTable: internalDealerParseTable(source),
    ShortDescriptionContent: internalDealerParseDescriptionContent(source),
    Favorite: favorites.includes(source.Id),
    MastodonUrl: !source.MastodonHandle ? undefined : internalMastodonHandleToProfileUrl(source.MastodonHandle),
});

export const applyEventDayDetails = (source: EventDayRecord): EventDayDetails => ({
    ...source,
    dayOfWeek: moment(source.Date).day(),
});
export const applyAnnouncementDetails = (source: AnnouncementRecord, images: Dictionary<ImageDetails>): AnnouncementDetails => ({
    ...source,
    NormalizedTitle: internalFixedTitle(source.Title, source.Content),
    Image: !source.ImageId ? undefined : images[source.ImageId],
});

export const applyMapDetails = (source: MapRecord, images: Dictionary<ImageDetails>): MapDetails => ({
    ...source,
    Image: images[source.ImageId],
    Entries: source.Entries as MapEntryDetails[],
});
