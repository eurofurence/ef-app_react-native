import type {EfEntity} from "@/data/types/EfEntity";

export type EfLink = EfEntity & {
  Id: string
  FragmentType:
    | 'WebExternal'
    | 'MapExternal'
    | 'MapEntry'
    | 'DealerDetail'
    | 'EventConferenceRoom'
  Name: string
  Target: string
}
