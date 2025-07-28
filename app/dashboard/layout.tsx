import type React from "react"
import Link from "next/link"
import { HomeIcon, FileTextIcon, PlusCircleIcon, FolderIcon } from "lucide-react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar" // Assuming shadcn/ui sidebar components are here
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DashboardProvider } from "@/components/dashboard/dashboard-provider"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

// Define proper metadata for the dashboard
export const metadata = {
  title: 'Dashboard - Weblog',
  description: 'Manage your blog posts and content'
}

// Memoized dashboard layout component
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Default open state can be read from cookies if persistence is set up
  // For now, let's default to true (expanded)
  const defaultOpen = true

  return (
    <DashboardProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex min-h-screen w-full bg-gray-50">
          <DashboardSidebar />
          <main className="flex-1 flex flex-col w-full overflow-x-hidden h-screen">
            <DashboardHeader />
            <div className="px-8 pt-[5.5rem] pb-8 flex-1 w-full max-w-full overflow-y-auto">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </DashboardProvider>
  )
}

// Optimized sidebar component
function DashboardSidebar() {
  return (
    <Sidebar collapsible="icon" className="!bg-gray-900 border-r-gray-700 [&_[data-sidebar=sidebar]]:!bg-gray-900">
      <SidebarHeader className="p-4 border-b border-gray-700 !bg-gray-900">
        <Link href="/" className="flex items-center text-white" prefetch={false}>
          <span className="font-serif text-xl font-bold group-data-[state=collapsed]:hidden">
            Weblog<span className="text-orange-500">.</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-4 text-gray-300 !bg-gray-900">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-gray-300 hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white data-[active=true]:bg-gray-700 data-[active=true]:text-white"
              tooltip={{ children: "All Posts", side: "right", className: "bg-gray-700 text-white border-gray-600" }}
            >
              <Link href="/dashboard" className="flex items-center" prefetch={true}>
                <FileTextIcon className="w-5 h-5 shrink-0" />
                <span className="ml-3 text-xs group-data-[state=collapsed]:hidden">All Posts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-gray-300 hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white data-[active=true]:bg-gray-700 data-[active=true]:text-white"
              tooltip={{ children: "Add New Post", side: "right", className: "bg-gray-700 text-white border-gray-600" }}
            >
              <Link href="/dashboard/new" className="flex items-center" prefetch={true}>
                <PlusCircleIcon className="w-5 h-5 shrink-0" />
                <span className="ml-3 text-xs group-data-[state=collapsed]:hidden">Add New Post</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-gray-300 hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white data-[active=true]:bg-gray-700 data-[active=true]:text-white"
              tooltip={{ children: "Categories", side: "right", className: "bg-gray-700 text-white border-gray-600" }}
            >
              <Link href="/dashboard/categories" className="flex items-center" prefetch={true}>
                <FolderIcon className="w-5 h-5 shrink-0" />
                <span className="ml-3 text-xs group-data-[state=collapsed]:hidden">Categories</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t border-gray-700 !bg-gray-900">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-gray-300 hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white data-[active=true]:bg-gray-700 data-[active=true]:text-white"
              tooltip={{ children: "Back to Site", side: "right", className: "bg-gray-700 text-white border-gray-600" }}
            >
              <Link href="/" className="flex items-center" prefetch={false}>
                <HomeIcon className="w-5 h-5 shrink-0" />
                <span className="ml-3 text-xs group-data-[state=collapsed]:hidden">Back to Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Desktop Toggle Trigger - visible only when sidebar is collapsed */}
          <SidebarMenuItem className="group-data-[state=expanded]:hidden hidden md:block mt-1">
            {" "}
            {/* Controls visibility */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger className="w-full h-auto p-2.5 flex items-center justify-center text-gray-300 hover:bg-gray-700 hover:text-white rounded-md focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800" />
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-700 text-white border-gray-600">
                  Expand Sidebar
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
