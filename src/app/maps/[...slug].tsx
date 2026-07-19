import { eq, useLiveQuery } from '@tanstack/react-db'
import { useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { Header } from '@/components/generic/containers/Header'
import { MapContent } from '@/components/maps/MapContent'
import { mapsFullCollection } from '@/data/collections/content/MapsFull'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'

export default function MapItem() {
  const { t } = useTranslation('Maps')
  const params = useLocalSearchParams<{ slug: string[] }>()

  // Extract parameters from the slug array
  const mapId = params.slug?.[0]
  const entryId = params.slug?.[1]
  const linkId = params.slug?.[2]
  const backgroundStyle = useThemeBackground('background')

  const { data: mapCache } = useLiveQuery(
    {
      id: 'maps-item',
      query: (q) =>
        q
          .from({ map: mapsFullCollection })
          .where(({ map }) => eq(map.Id, mapId))
          .findOne(),
    },
    [mapId]
  )

  // Resolve entry if requested
  const entry = useMemo(() => {
    if (!mapCache) return
    if (!entryId) return
    return mapCache.Entries?.find((item) => item.Id === entryId)
  }, [mapCache, entryId])

  // Resolve link if requested
  const link = useMemo(() => {
    if (!entry) return
    if (typeof linkId !== 'string') return
    const linkIndex = parseInt(linkId, 10)
    if (Number.isNaN(linkIndex)) return
    return entry.Links[linkIndex]
  }, [entry, linkId])

  // Compute title
  const titleText = useMemo(() => {
    if (mapCache?.Description) {
      if (link?.Name) return `${mapCache.Description}: ${link.Name}`
      else return mapCache.Description
    } else {
      return 'Viewing map'
    }
  }, [mapCache, link])

  return (
    <View
      style={[StyleSheet.absoluteFill, backgroundStyle]}
      accessibilityLabel={t('accessibility.map_page')}
      accessibilityHint={t('accessibility.map_page_hint')}
    >
      <Header>{titleText}</Header>
      {!mapCache?.Image || (entryId && !entry) || (linkId && !link) ? null : (
        <MapContent map={mapCache} entry={entry} link={link} />
      )}
    </View>
  )
}
