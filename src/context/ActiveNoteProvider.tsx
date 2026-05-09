import { useState, useMemo } from 'react'
import type { ReactNode } from "react"
import { ActiveNodeContext } from './ActiveNodeContext'

export const ActiveNodeProvider = ({ children }: { children: ReactNode }) => {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)

  const value = useMemo(
    () => ({ activeNodeId, setActiveNodeId }),
    [activeNodeId]
  )

  return (
    <ActiveNodeContext.Provider value={value}>
      {children}
    </ActiveNodeContext.Provider>
  )
}
