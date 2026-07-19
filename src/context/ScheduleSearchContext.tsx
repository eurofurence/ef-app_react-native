import { createContext, useContext } from 'react'
import type { EfId } from '@/data/types/EfId'

// Create search context for schedule
export const ScheduleSearchContext = createContext<{
  query: string
  setQuery: (query: string) => void
  results: EfId[] | null
}>({
  query: '',
  setQuery: () => {},
  results: null
})

export const useScheduleSearch = () => {
  const context = useContext(ScheduleSearchContext)
  if (!context) {
    throw new Error(
      'useScheduleSearch must be used within a ScheduleSearchContext.Provider'
    )
  }
  return context
}
