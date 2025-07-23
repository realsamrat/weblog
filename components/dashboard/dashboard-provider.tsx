"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface DashboardContextType {
  setPageTitle: (title: string) => void
  setHeaderActions: (actions: React.ReactNode) => void
  pageTitle: string
  headerActions: React.ReactNode
  isReady: boolean
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider')
  }
  return context
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [pageTitle, setPageTitle] = useState("Dashboard")
  const [headerActions, setHeaderActions] = useState<React.ReactNode>(null)
  const [isReady, setIsReady] = useState(false)

  // Ensure provider is ready after hydration
  useEffect(() => {
    setIsReady(true)
  }, [])

  return (
    <DashboardContext.Provider value={{ 
      setPageTitle, 
      setHeaderActions, 
      pageTitle, 
      headerActions,
      isReady 
    }}>
      {children}
    </DashboardContext.Provider>
  )
} 