import type {DateTimeString} from "./Primitives.ts";
import type {EfId} from "./EfId.ts";

export type EfEntity = {
    Id: EfId
    LastChangeDateTimeUtc: DateTimeString
}