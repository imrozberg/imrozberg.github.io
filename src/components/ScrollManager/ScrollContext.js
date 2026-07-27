import { createContext, useContext } from 'react'

export const ScrollContext = createContext(null)

export function useScrollContext() {
  const ctx = useContext(ScrollContext)
  if (!ctx) {
    throw new Error('useScrollContext must be used within <ScrollManager>')
  }
  return ctx
}
