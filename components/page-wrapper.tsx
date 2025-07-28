'use client'

import Navigation from "@/components/navigation"
import { ReactNode } from "react"

interface PageWrapperProps {
  children: ReactNode
  noPadding?: boolean
}

export default function PageWrapper({ children, noPadding = false }: PageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div id="main-content" className={`flex-grow flex flex-col ${noPadding ? "" : "pt-[60px]"}`}>
        {children}
      </div>
      <footer className="mt-10 border-t border-gray-200 dark:border-gray-800 py-4 blur-element">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Weblog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}