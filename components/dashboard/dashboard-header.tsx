"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useDashboard } from "./dashboard-provider"

export function DashboardHeader() {
  const { pageTitle, headerActions, isReady } = useDashboard()
  const pathname = usePathname()
  const router = useRouter()
  
  // Show back button when not on main dashboard page
  const showBackButton = pathname !== "/dashboard"
  
  const handleBack = () => {
    router.back()
  }

  // Don't render until context is ready to prevent hydration issues
  if (!isReady) {
    return (
      <div className="fixed top-0 right-0 left-0 md:left-[var(--sidebar-width,12rem)] z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-all duration-200 ease-in-out">
        <div className="p-4">
          <div className="max-w-7xl mx-auto px-2">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold font-serif text-gray-700">Dashboard</h1>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-0 right-0 left-0 md:left-[var(--sidebar-width,12rem)] z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm transition-all duration-200 ease-in-out">
      {/* Mobile header with sidebar trigger */}
      <div className="md:hidden p-4 flex items-center justify-between w-full">
        <div className="flex items-center">
          <SidebarTrigger className="mr-4" />
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="mr-2 p-1 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-xl font-semibold font-serif text-gray-700">{pageTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          {headerActions}
        </div>
      </div>
      
      {/* Desktop header constrained to form width */}
      <div className="hidden md:block p-4">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {showBackButton && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack}
                  className="mr-3 p-1 h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h1 className="text-xl font-semibold font-serif text-gray-700">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 