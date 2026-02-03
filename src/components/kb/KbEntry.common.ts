import { router } from 'expo-router'
import { useCallback } from 'react'

import type { KnowledgeEntryDetails } from '@/context/data/types.details'

/**
 * Uses default handlers for KB card interaction, i.e., opening the KB card.
 */
export function useKbEntryCardInteractions() {
  const onPress = useCallback((entry: KnowledgeEntryDetails) => {
    router.navigate({
      pathname: '/knowledge/[id]',
      params: { id: entry.Id },
    })
  }, [])

  return {
    onPress,
  }
}
