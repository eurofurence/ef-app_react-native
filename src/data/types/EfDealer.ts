import type {EfEntity} from "./EfEntity.ts";
import type {EfLink} from "./EfLink.ts";
import type {EfId} from "./EfId.ts";

export type EfDealer = EfEntity & {
    DisplayName: string
    Merchandise: string
    ShortDescription: string
    AboutTheArtistText: string
    AboutTheArtText: string
    Links: EfLink[]
    TwitterHandle: string
    TelegramHandle: string
    DiscordHandle: string
    MastodonHandle: string
    BlueskyHandle: string
    AttendsOnThursday: boolean
    AttendsOnFriday: boolean
    AttendsOnSaturday: boolean
    ArtPreviewCaption: string
    ArtistThumbnailImageId: EfId
    ArtistImageId: EfId
    ArtPreviewImageId: EfId
    IsAfterDark: boolean
    Categories: string[]
    Keywords?: { [category: string]: string[] }
    MapLink: string
    DisplayNameOrAttendeeNickname: string
}