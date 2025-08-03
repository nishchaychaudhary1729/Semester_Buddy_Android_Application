'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
interface ContentCounts {
  notes: number
  lectures: number
  notebooks: number
  assignments: number
}

interface ContentContextType {
  counts: ContentCounts
  updateCount: (type: keyof ContentCounts, count: number) => void
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<ContentCounts>({
    notes: 0,
    lectures: 0,
    notebooks: 0,
    assignments: 0
  })

  const updateCount = useCallback((type: keyof ContentCounts, count: number) => {
    setCounts(prev => ({
      ...prev,
      [type]: count
    }))
  }, [])

  return (
    <ContentContext.Provider value={{ counts, updateCount }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}