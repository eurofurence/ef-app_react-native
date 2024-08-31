import FontAwesomeIcon from "@expo/vector-icons/FontAwesome5";
import { Dictionary } from "@reduxjs/toolkit";
import { parseInt } from "lodash";
import moment, { MomentInput } from "moment";

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
    ImageRecord,
    KnowledgeGroupDetails,
    KnowledgeGroupRecord,
    MapDetails,
    MapEntryDetails,
    MapRecord,
    RecordId,
} from "./types";
import { IconNames } from "../../components/generic/atoms/Icon";
import { apiBase } from "../../configuration";
import { Notification } from "../background/slice";

const base64encode = (input: string) => {
    const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    const output = [];
    let chr1 = NaN;
    let chr2 = NaN;
    let chr3 = NaN;
    let enc1 = NaN;
    let enc2 = NaN;
    let enc3 = NaN;
    let enc4 = NaN;
    let i = 0;

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = 64;
            enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output.push(keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4));
        chr1 = NaN;
        chr2 = NaN;
        chr3 = NaN;
        enc1 = NaN;
        enc2 = NaN;
        enc3 = NaN;
        enc4 = NaN;
    } while (i < input.length);

    return output.join("");
};

/**
 * Do not use directly.
 * @param source
 */
const internalCreateImageUrl = (source: ImageRecord): string => `${apiBase}/Images/${source.Id}/Content/with-hash:${base64encode(source.ContentHashSha1)}`;

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
        if (dealer.AttendsOnThursday && day.dayOfWeek === 1) result.push(day);
        if (dealer.AttendsOnFriday && day.dayOfWeek === 2) result.push(day);
        if (dealer.AttendsOnSaturday && day.dayOfWeek === 3) result.push(day);
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

const faGlyphToName = Object.fromEntries(Object.entries(FontAwesomeIcon.getRawGlyphMap()).map(([key, value]) => [value, key]));

export const applyKnowledgeGroupDetails = (source: KnowledgeGroupRecord): KnowledgeGroupDetails => ({
    ...source,
    FaIconName: source.FontAwesomeIconCharacterUnicodeAddress ? faGlyphToName[parseInt(source.FontAwesomeIconCharacterUnicodeAddress, 16)] : undefined,
});
