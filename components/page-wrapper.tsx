'use client'

import Navigation from "@/components/navigation"
import { ReactNode } from "react"

interface PageWrapperProps {
  children: ReactNode
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <>
      <Navigation />
      <div id="main-content">
        {children}
      </div>
    </>
  )
}