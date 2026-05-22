import type {EfEntity} from "./EfEntity.ts";

export type EfRoom = EfEntity & {
    Name: string
    MapLink: string
    IsInternal: boolean
}