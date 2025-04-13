import { LinkFragment, MapEntryRecord, RecordId } from '@/context/data/types.api'
import { MapDetails } from '@/context/data/types.details'

export const getValidLinksByTarget = (maps: readonly MapDetails[], target?: RecordId): { map: MapDetails; entry: MapEntryRecord; link: LinkFragment }[] => {
  if (!maps?.length) return []
  if (!target) return []

  const results = []
  for (const map of maps) {
    for (const entry of map.Entries) {
      for (const link of entry.Links) {
        if (target === link.Target) {
          results.push({ map, entry, link })
        }
      }
    }
  }
  return results
}
