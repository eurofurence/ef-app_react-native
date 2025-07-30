import { createContext, useContext } from 'react'

// Create search context for dealers
export const DealersSearchContext = createContext<{
  query: string
  setQuery: (query: string) => void
}>({
  query: '',
  setQuery: () => {},
})

export const useDealersSearch = () => {
  const context = useContext(DealersSearchContext)
  if (!context) {
    throw new Error('useDealersSearch must be used within a DealersSearchContext.Provider')
  }
  return context
}
