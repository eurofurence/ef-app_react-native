import { useLocalSearchParams } from 'expo-router'
import * as React from 'react'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Header } from '@/components/generic/containers/Header'
import { MapContent, MapContentProps } from '@/components/maps/MapContent'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useCache } from '@/context/data/Cache'

export default function MapItem() {
    const params = useLocalSearchParams<{ slug: string[] }>()

    // Extract parameters from the slug array
    const mapId = params.slug?.[0]
    const entryId = params.slug?.[1]
    const linkId = params.slug?.[2]
    const backgroundStyle = useThemeBackground('background')

    const { maps } = useCache()

    // Resolve map
    const mapCache = maps.dict[mapId]

    // Resolve entry if requested
    const entry = useMemo(() => {
        if (!mapCache) return
        if (!entryId) return
        return mapCache.Entries.find((item) => item.Id === entryId)
    }, [mapCache, entryId])

    // Resolve link if requested
    const link = useMemo(() => {
        if (!entry) return
        if (typeof linkId !== 'string') return
        const linkIndex = parseInt(linkId, 10)
        if (isNaN(linkIndex)) return
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
        <View style={[StyleSheet.absoluteFill, backgroundStyle]}>
            <Header>{titleText}</Header>
            {!mapCache?.Image || (entryId && !entry) || (linkId && !link) ? null : (
                <MapContent map={mapCache as MapContentProps['map']} entry={entry} link={link} />
            )}
        </View>
    )
}
