"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

const MenuItem = ({ item, pathname, openMenus, toggleMenu }: any) => {
  const isActive = pathname === item.path || pathname.startsWith(item.path + "/")
  
  return (
    <div key={item.id}>
      <Link
        href={item.children ? "#" : item.path}
        onClick={
          item.children
            ? (e) => {
                e.preventDefault()
                toggleMenu(item.id)
              }
            : undefined
        }
        className={`group flex w-full items-center rounded-lg p-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-[#2A8E9E]/10 text-[#2A8E9E] dark:bg-[#2A8E9E]/20 dark:text-white"
            : "text-gray-600 hover:bg-[#2A8E9E]/5 hover:text-[#2A8E9E] dark:text-gray-300 dark:hover:bg-[#2A8E9E]/10 dark:hover:text-white"
        }`}
      >
        <span className={`mr-3 ${isActive ? "text-[#2A8E9E]" : ""}`}>{item.icon}</span>
        <span className="flex-1">{item.title}</span>
        {item.children && (
          <span className="ml-auto">
            {openMenus[item.id] ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
      </Link>

      {item.children && openMenus[item.id] && (
        <div className="mt-1 space-y-1 pl-6">
          {item.children.map((child: any) => (
            <Link
              key={child.id}
              href={child.path}
              className={`group flex items-center rounded-lg p-2 text-sm font-medium transition-colors ${
                pathname === child.path
                  ? "bg-[#2A8E9E]/10 text-[#2A8E9E] dark:bg-[#2A8E9E]/20 dark:text-white"
                  : "text-gray-600 hover:bg-[#2A8E9E]/5 hover:text-[#2A8E9E] dark:text-gray-300 dark:hover:bg-[#2A8E9E]/10 dark:hover:text-white"
              }`}
            >
              <span className={`mr-3 ${pathname === child.path ? "text-[#2A8E9E]" : ""}`}>
                {child.icon}
              </span>
              <span className="flex-1">{child.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

interface SidebarProps {
  mainMenu: any[];
  sales?: any[];
  crm?: any[];
  marketing?: any[];
  loyalty?: any[];
  communication?: any[];
  finance?: any[];
  hr?: any[];
  // SAAS props
  business?: any[];
  ai?: any[];
  products?: any[];
  users?: any[];
  support?: any[];
  settings?: any[];
  // VenueBoost props
  venues?: any[];
  ticketing?: any[];
  performers?: any[];
  guests?: any[];
  // PixelBreeze props
  content?: any[];
  media?: any[];
  // generate?: any[];
  profiles?: any[];
  // QYTETARET props
  reports?: any[];
  citizens?: any[];
  authorities?: any[];
  analytics?: any[];
  // STUDIO props
  clients?: any[];
}

export default function Sidebar({
  mainMenu,
  sales = [],
  crm = [],
  marketing = [],
  loyalty = [],
  communication = [],
  finance = [],
  hr = [],
  // SAAS props
  business = [],
  ai = [],
  products = [],
  users = [],
  support = [],
  settings = [],
  // VenueBoost props
  venues = [],
  ticketing = [],
  performers = [],
  guests = [],
  // PixelBreeze props
  content = [],
  media = [],
  // generate = [],
  profiles = [],
  // QYTETARET props
  reports = [],
  citizens = [],
  authorities = [],
  analytics = [],
  // STUDIO props
  clients = []
}: SidebarProps) {
  const pathname = usePathname()
  
  // Determine client type based on pathname
  const isSaas = pathname.includes('/staffluent') 
    || pathname.includes('/businesses')
    || pathname.includes('/businesses')
    || pathname.includes('/stripe-products')
    || pathname.includes('/subscriptions')
    || pathname.includes('/features')
    || pathname.includes('/billing')
    || pathname.includes('/support')
    || pathname.includes('/settings')
    || pathname.includes('/users')
    || pathname.includes('/sync-history')
    || pathname.includes('/chatbot')
    || pathname.includes('/knowledge')
    || pathname.includes('/weather-monitoring')
    || pathname.includes('/intelligence-hub')
    || pathname.includes('/core-engine')
    || pathname.includes('/agents')
  const isBooking = pathname.includes('/booking') || pathname.includes('/guests')
  const isVenueBoost = pathname.includes('/venueboost') || pathname.includes('/venues')
  const isPixelBreeze = 
    pathname.includes('/pixelbreeze')
    || pathname.includes('/social-profiles')
    || pathname.includes('/operating-entities')
    || pathname.includes('/templates')
    || pathname.includes('/template-form')
    || pathname.includes('/template-dashboard')
    || pathname.includes('/generated-images')
    || pathname.includes('/logs')

  const isQytetaret = pathname.includes('/qytetaret') || pathname.includes('/reports') || pathname.includes('/citizens') 
    || pathname.includes('/authorities')
    || pathname.includes('/report-tags')
    || pathname.includes('/contacts')
  const isStudio = pathname.includes('/studio') || 
    pathname.includes('/os-clients') || 
    pathname.includes('/os-client-apps')

  // Combine all menus for finding current open menu
  let allMenuItems = []

  if (isSaas) {
    allMenuItems = [
      ...mainMenu,
      ...business,
      ...ai,
      ...products,
      ...users,
      ...support,
      ...finance,
      ...settings
    ]
  } else if (isVenueBoost) {
    allMenuItems = [
      ...mainMenu,
      ...business,
      ...products,
      ...venues,
      ...ticketing,
      ...performers,
      ...guests,
      ...marketing,
      ...finance,
      ...settings,
      ...hr,
      ...communication
    ]
  } else if (isPixelBreeze) {
    allMenuItems = [
      ...mainMenu,
      ...content,
      ...media,
      // ...generate,
      ...profiles,
      ...users,
      ...finance,
      ...settings
    ]
  } else if (isBooking) {
    allMenuItems = [
      ...mainMenu, 
      ...sales, 
      ...crm, 
      ...marketing, 
      ...loyalty, 
      ...communication,
      ...finance,
      ...hr
    ]
  } else if (isQytetaret) {
    allMenuItems = [
      ...mainMenu,
      ...reports,
      ...citizens,
      ...authorities,
      ...analytics,
      ...communication,
      ...settings
    ]
  } else if (isStudio) {
    allMenuItems = [
      ...mainMenu,
      ...clients,
      ...settings
    ]
  } else {
    allMenuItems = [
      ...mainMenu, 
      ...sales, 
      ...crm, 
      ...marketing, 
      ...loyalty, 
      ...communication,
      ...finance,
      ...hr
    ]
  }
  
  // Find the current open menu
  const currentOpenMenu = allMenuItems.find(
    (i: any) => pathname === i.path || pathname.startsWith(i.path + "/")
  )
  
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({
    [currentOpenMenu?.id ?? 0]: true,
  })

  const toggleMenu = (id: number) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }))
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800">
        <div className="flex justify-center items-center h-[72px] px-6 border-b border-stroke dark:border-stroke-dark">
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/images/logo/logo.svg"
              alt="Logo"
              width={160}
              height={36}
              className="dark:hidden"
              priority
            />
            <Image
              src="/images/logo/logo-light.svg"
              alt="Logo"
              width={160}
              height={36}
              className="hidden dark:block"
              priority
            />
          </Link>
        </div>
      </div>

      {/* Scrollable Menu Section */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-4 py-8 space-y-8">
          {/* Main Menu */}
          <div>
            <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Main Menu
            </h3>
            <nav className="space-y-1">
              {mainMenu.map((item) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  pathname={pathname}
                  openMenus={openMenus}
                  toggleMenu={toggleMenu}
                />
              ))}
            </nav>
          </div>

          {/* SAAS sidebar sections */}
          {isSaas && (
            <>
              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Business
                </h3>
                <nav className="space-y-1">
                  {business.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Staffluent AI Engine
                </h3>
                <nav className="space-y-1">
                  {ai.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Products
                </h3>
                <nav className="space-y-1">
                  {products.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Users
                </h3>
                <nav className="space-y-1">
                  {users.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Support
                </h3>
                <nav className="space-y-1">
                  {support.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>
            </>
          )}

          {/* VenueBoost sidebar sections */}
          {isVenueBoost && (
            <>
              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Business
                </h3>
                <nav className="space-y-1">
                  {business.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Products
                </h3>
                <nav className="space-y-1">
                  {products.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Venues
                </h3>
                <nav className="space-y-1">
                  {venues.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Whitelabel
                </h3>
                <nav className="space-y-1">
                  {communication.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  HR
                </h3>
                <nav className="space-y-1">
                  {hr.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>
            </>
          )}

          {/* PixelBreeze sidebar sections */}
          {isPixelBreeze && (
            <>
              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Templates
                </h3>
                <nav className="space-y-1">
                  {content.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Media
                </h3>
                <nav className="space-y-1">
                  {media.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              {/* <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Generate
                </h3>
                <nav className="space-y-1">
                  {generate.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div> */}

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Social Profiles
                </h3>
                <nav className="space-y-1">
                  {profiles.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>
            </>
          )}

          {/* QYTETARET sidebar sections */}
          {isQytetaret && (
            <>
              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Reports Management
                </h3>
                <nav className="space-y-1">
                  {reports.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Citizens Management
                </h3>
                <nav className="space-y-1">
                  {citizens.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Authorities
                </h3>
                <nav className="space-y-1">
                  {authorities.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Analytics
                </h3>
                <nav className="space-y-1">
                  {analytics.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Communication
                </h3>
                <nav className="space-y-1">
                  {communication.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>
            </>
          )}

          {/* STUDIO sidebar sections */}
          {isStudio && (
            <div>
              <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Clients
              </h3>
              <nav className="space-y-1">
                {clients.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    pathname={pathname}
                    openMenus={openMenus}
                    toggleMenu={toggleMenu}
                  />
                ))}
              </nav>
            </div>
          )}

          {/* Booking client type specific sections */}
          {isBooking && (
            <>
              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Rental
                </h3>
                <nav className="space-y-1">
                  {sales.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Guests
                </h3>
                <nav className="space-y-1">
                  {crm.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Marketing
                </h3>
                <nav className="space-y-1">
                  {marketing.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Loyalty Program
                </h3>
                <nav className="space-y-1">
                  {loyalty.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Communication
                </h3>
                <nav className="space-y-1">
                  {communication.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>
            </>
          )}

          {/* Default ecommerce sections (when no special client type is detected) */}
          {!isSaas && !isBooking && !isVenueBoost && !isPixelBreeze && !isQytetaret && !isStudio && (
            <>
              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Sales
                </h3>
                <nav className="space-y-1">
                  {sales.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  CRM
                </h3>
                <nav className="space-y-1">
                  {crm.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Marketing
                </h3>
                <nav className="space-y-1">
                  {marketing.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Loyalty Program
                </h3>
                <nav className="space-y-1">
                  {loyalty.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>

              <div>
                <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Communication
                </h3>
                <nav className="space-y-1">
                  {communication.map((item) => (
                    <MenuItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      openMenus={openMenus}
                      toggleMenu={toggleMenu}
                    />
                  ))}
                </nav>
              </div>
            </>
          )}

          {/* Finance Section - Common to most modes except Studio */}
          {(!isQytetaret && !isStudio || finance.length > 0) && (
            <div>
              <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Finance
              </h3>
              <nav className="space-y-1">
                {finance.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    pathname={pathname}
                    openMenus={openMenus}
                    toggleMenu={toggleMenu}
                  />
                ))}
              </nav>
            </div>
          )}

          {/* Settings/HR Section based on mode */}
          {isSaas || isVenueBoost || isPixelBreeze || isQytetaret || isStudio ? (
            <div className="mb-8">
              <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Settings
              </h3>
              <nav className="space-y-1">
                {settings.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    pathname={pathname}
                    openMenus={openMenus}
                    toggleMenu={toggleMenu}
                  />
                ))}
              </nav>
            </div>
          ) : (
            <div className="mb-8">
              <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Settings
              </h3>
              <nav className="space-y-1">
                {hr.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    pathname={pathname}
                    openMenus={openMenus}
                    toggleMenu={toggleMenu}
                  />
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}