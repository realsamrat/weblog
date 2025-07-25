'use client'

import Navigation from "@/components/navigation"
import { ReactNode } from "react"

interface PageWrapperProps {
  children: ReactNode
  noPadding?: boolean
}

export default function PageWrapper({ children, noPadding = false }: PageWrapperProps) {
  return (
    <>
      <Navigation />
      <div id="main-content" className={noPadding ? "" : "pt-[60px]"}>
        {children}
      </div>
    </>
  )
}