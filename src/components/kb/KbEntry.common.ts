import { KnowledgeEntryDetails } from '@/context/data/types.details'
import { useCallback } from 'react'
import { router } from 'expo-router'

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
