"use client"

import { useState } from "react"
import Sidebar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import { usePathname } from "next/navigation"
import getSidebarDataForType from "@/utils/getSidebarDataForType"
import { useSession } from "next-auth/react"


const CRMPlatformLayout = ({ children }: { children: React.ReactNode }) => {
  const [openSidebar, setOpenSidebar] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  
  const getClientTypeFromPath = () => {
    // For booking dashboard path, ensure we set client type as BOOKING
    if (pathname.includes('/booking-dashboard') || 
        pathname.includes('/bookings') || 
        pathname.includes('/rental-units') || 
        pathname.includes('/guests')) {
      return 'BOOKING'
    }
    
    // For SAAS path detection
    if (pathname.includes('/staffluent-dashboard')) {
      return 'SAAS'
    }

    // For VenueBoost path detection
    if (pathname.includes('/venueboost-dashboard')) {
      return 'VENUEBOOST'
    }

    // For PIXELBREEZE path detection
    if (pathname.includes('/pixelbreeze-dashboard')) {
      return 'PIXELBREEZE'
    }
    
    const pathParts = pathname.split('/')
    const clientTypeIndex = pathParts.indexOf('crm') + 1
    return pathParts[clientTypeIndex]
  }

  // First try to get client type from session, then from path
  const clientType = session?.user?.clientType || getClientTypeFromPath()

  const sidebarData = getSidebarDataForType(clientType)

  // Determine sidebar props based on client type
  let sidebarProps = {}
  
  if (clientType === 'SAAS') {
    sidebarProps = {
      mainMenu: sidebarData.mainMenu,
      business: sidebarData.business,
      products: sidebarData.products,
      users: sidebarData.users,
      support: sidebarData.support,
      finance: sidebarData.finance,
      settings: sidebarData.settings
    }
  } else if (clientType === 'BOOKING') {
    sidebarProps = {
      mainMenu: sidebarData.mainMenu,
      sales: sidebarData.sales,
      crm: sidebarData.crm,
      marketing: sidebarData.marketing, 
      loyalty: sidebarData.loyalty, 
      communication: sidebarData.communication,
      finance: sidebarData.finance,
      hr: sidebarData.hr
    }
  } else {
    // Default ecommerce props
    sidebarProps = {
      mainMenu: sidebarData.mainMenu,
      sales: sidebarData.sales,
      crm: sidebarData.crm,
      marketing: sidebarData.marketing, 
      loyalty: sidebarData.loyalty, 
      communication: sidebarData.communication,
      finance: sidebarData.finance,
      hr: sidebarData.hr
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transition-transform duration-300 ease-in-out dark:bg-gray-800 lg:static lg:translate-x-0 ${
          openSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar {...sidebarProps} />
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <Header openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
        <div className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6 dark:bg-gray-900">
          {children}
        </div>
      </main>

      {/* Overlay */}
      {openSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setOpenSidebar(false)}
        ></div>
      )}
    </div>
  )
}

export default CRMPlatformLayout