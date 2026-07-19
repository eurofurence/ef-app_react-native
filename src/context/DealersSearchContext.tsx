import { createContext, useContext } from 'react'
import type { EfId } from '@/data/types/EfId'

// Create search context for dealers
export const DealersSearchContext = createContext<{
  query: string
  setQuery: (query: string) => void
  results: EfId[] | null
}>({
  query: '',
  setQuery: () => {},
  results: null,
})

export const useDealersSearch = () => {
  const context = useContext(DealersSearchContext)
  if (!context) {
    throw new Error(
      'useDealersSearch must be used within a DealersSearchContext.Provider'
    )
  }
  return context
}
