import type {EfEntity} from "./EfEntity.ts";
import type {DateTimeString} from "./Primitives.ts";
import type {EfId} from "./EfId.ts";

export type EfArtistsAlley = EfEntity & {
    CreatedDateTimeUtc: DateTimeString
    DisplayName: string
    WebsiteUrl: string
    ShortDescription: string
    TelegramHandle: string
    Location: string
    ImageId: EfId
}
