import { CacheItem, LinkFragment, MapDetails, MapEntryRecord, RecordId } from "../types";

export const filterBrowsableMaps = <T extends Pick<MapDetails, "IsBrowseable">>(maps: T[]) => maps.filter((it) => it.IsBrowseable);
export const getBrowsableMaps = (maps: MapDetails[]): MapDetails[] => filterBrowsableMaps(maps);
export const getValidLinksByTarget = (maps: CacheItem<MapDetails[]>, target: RecordId): { map: MapDetails; entry: MapEntryRecord; link: LinkFragment }[] => {
    if (!maps?.data) return [];
    
    const results = [];
    for (const map of maps.data) {
        for (const entry of map.Entries) {
            for (const link of entry.Links) {
                if (target === link.Target) {
                    results.push({ map, entry, link });
                }
            }
        }
    }
    return results;
};
