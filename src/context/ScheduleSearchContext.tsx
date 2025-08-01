import { createContext, useContext } from 'react'

// Create search context for schedule
export const ScheduleSearchContext = createContext<{
  query: string
  setQuery: (query: string) => void
}>({
  query: '',
  setQuery: () => {},
})

export const useScheduleSearch = () => {
  const context = useContext(ScheduleSearchContext)
  if (!context) {
    throw new Error('useScheduleSearch must be used within a ScheduleSearchContext.Provider')
  }
  return context
}
