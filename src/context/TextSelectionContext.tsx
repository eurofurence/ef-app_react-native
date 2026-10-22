import { createContext, useContext } from 'react'

/**
 * Whether labels in this subtree are selectable unless they state otherwise.
 */
export const TextSelectionContext = createContext(true)
TextSelectionContext.displayName = 'TextSelectionContext'

/**
 * Uses the selectability that applies to the current subtree.
 */
export const useTextSelectable = () => useContext(TextSelectionContext)
