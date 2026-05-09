import { createContext, useContext } from 'react'

export interface ActiveNodeContextValue {
  activeNodeId: string | null
  setActiveNodeId: (id: string | null) => void
}

export const ActiveNodeContext = createContext<ActiveNodeContextValue | null>(null)

export const useActiveNode = () => {
  const ctx = useContext(ActiveNodeContext)
  if (!ctx) throw new Error('useActiveNode must be inside ActiveNodeProvider')
  return ctx
}
