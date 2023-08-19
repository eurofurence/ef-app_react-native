import moment, { MomentInput } from "moment";

import { eventDaysSelectors, eventRoomsSelectors, eventTracksSelectors, imagesSelectors } from "./eurofurence.selectors";
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
    EventRoomRecord,
    EventTrackDetails,
    EventTrackRecord,
    ImageDetails,
    ImageRecord,
    KnowledgeEntryDetails,
    KnowledgeEntryRecord,
    KnowledgeGroupDetails,
    KnowledgeGroupRecord,
    MapDetails,
    MapEntryDetails,
    MapEntryRecord,
    MapRecord,
} from "./eurofurence.types";
import { RootState } from "./index";
import { IconNames } from "../components/Atoms/Icon";
import { apiBase } from "../configuration";

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

const internalAttendanceDays = (state: RootState, dealer: DealerRecord) => {
    const days = eventDaysSelectors.selectAll(state);
    const result: EventDayDetails[] = [];
    for (const day of days) {
        // Sun:0, Mon:1 , Tue:2, Wed:3, Thu:4, Fri:5, Sat:6.
        if (dealer.AttendsOnThursday && day && moment(day.Date).day() === 1) result.push(day);
        if (dealer.AttendsOnFriday && day && moment(day.Date).day() === 2) result.push(day);
        if (dealer.AttendsOnSaturday && day && moment(day.Date).day() === 3) result.push(day);
    }
    return result;
};

export const applyAnnouncementDetails = (state: RootState, source: AnnouncementRecord): AnnouncementDetails => source;

export const applyEventDetails = (state: RootState, source: EventRecord): EventDetails => ({
    ...source,
    PartOfDay: internalCategorizeTime(source.StartDateTimeUtc),
    Poster: !source.PosterImageId ? undefined : imagesSelectors.selectById(state, source.PosterImageId),
    Banner: !source.BannerImageId ? undefined : imagesSelectors.selectById(state, source.BannerImageId),
    Badges: internalTagsToBadges(source.Tags),
    Glyph: internalTagsToIcon(source.Tags),
    SuperSponsorOnly: internalSuperSponsorOnly(source.Tags),
    SponsorOnly: internalSponsorOnly(source.Tags),
    MaskRequired: internalMaskRequired(source.Tags),
    ConferenceRoom: !source.ConferenceRoomId ? undefined : eventRoomsSelectors.selectById(state, source.ConferenceRoomId),
    ConferenceDay: !source.ConferenceDayId ? undefined : eventDaysSelectors.selectById(state, source.ConferenceDayId),
    ConferenceTrack: !source.ConferenceTrackId ? undefined : eventTracksSelectors.selectById(state, source.ConferenceTrackId),
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

export const applyDealerDetails = (state: RootState, source: DealerRecord): DealerDetails => ({
    ...source,
    AttendanceDayNames: internalAttendanceDayNames(source),
    AttendanceDays: internalAttendanceDays(state, source),
    Artist: !source.ArtistImageId ? undefined : imagesSelectors.selectById(state, source.ArtistImageId),
    ArtistThumbnail: !source.ArtistThumbnailImageId ? undefined : imagesSelectors.selectById(state, source.ArtistThumbnailImageId),
    ArtPreview: !source.ArtPreviewImageId ? undefined : imagesSelectors.selectById(state, source.ArtPreviewImageId),
    FullName: source.DisplayName || source.AttendeeNickname,
    ShortDescriptionTable: internalDealerParseTable(source),
    ShortDescriptionContent: internalDealerParseDescriptionContent(source),
});

export const applyEventDayDetails = (state: RootState, source: EventDayRecord): EventDayDetails => source;

export const applyEventTrackDetails = (state: RootState, source: EventTrackRecord): EventTrackDetails => source;

export const applyEventRoomDetails = (state: RootState, source: EventRoomRecord): EventRoomDetails => source;

export const applyMapDetails = (state: RootState, source: MapRecord): MapDetails => ({
    ...source,
    Image: imagesSelectors.selectById(state, source.ImageId),
    Entries: source.Entries.map((entry) => applyMapEntryDetails(state, entry)),
});

export const applyMapEntryDetails = (state: RootState, source: MapEntryRecord): MapEntryDetails => source;

export const applyKnowledgeGroupDetails = (state: RootState, source: KnowledgeGroupRecord): KnowledgeGroupDetails => source;

export const applyKnowledgeEntryDetails = (state: RootState, source: KnowledgeEntryRecord): KnowledgeEntryDetails => source;

export const applyImageDetails = (state: RootState, source: ImageRecord): ImageDetails => ({
    ...source,
    FullUrl: internalCreateImageUrl(source),
});
