// src/app/(site)/crm/layout.tsx
"use client"

import { useState } from "react"
import Sidebar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import { usePathname } from "next/navigation"
import getSidebarDataForType from "@/utils/getSidebarDataForType"

const CRMLayout = ({ children }: { children: React.ReactNode }) => {
  const [openSidebar, setOpenSidebar] = useState(false)
  const pathname = usePathname()
  
  // Get client type from pathname
  const getClientTypeFromPath = () => {
    const pathParts = pathname.split('/')
    const clientTypeIndex = pathParts.indexOf('crm') + 1
    return pathParts[clientTypeIndex]
  }

  const clientType = getClientTypeFromPath()
  const sidebarData = getSidebarDataForType(clientType)

  return (
    <>
      <main className="min-h-screen bg-gray-2 dark:bg-[#151F34]">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-[999] h-screen w-[290px] overflow-y-auto bg-white duration-300 dark:bg-gray-dark ${
            openSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <Sidebar 
            sidebarData={sidebarData}
          />
        </aside>

        {/* Overlay */}
        <div
          onClick={() => setOpenSidebar(false)}
          className={`fixed inset-0 z-[99] h-screen w-full bg-dark/80 lg:hidden ${
            openSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        ></div>

        {/* Main Content */}
        <section className="lg:ml-[290px]">
          <Header openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
          <div className="p-5 pt-12 md:p-10">{children}</div>
        </section>
      </main>
    </>
  )
}

export default CRMLayout