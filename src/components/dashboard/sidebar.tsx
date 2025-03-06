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
            ? "bg-[#5d23b8]/10 text-[#5d23b8] dark:bg-[#5d23b8]/20 dark:text-white"
            : "text-gray-600 hover:bg-[#5d23b8]/5 hover:text-[#5d23b8] dark:text-gray-300 dark:hover:bg-[#5d23b8]/10 dark:hover:text-white"
        }`}
      >
        <span className={`mr-3 ${isActive ? "text-[#5d23b8]" : ""}`}>{item.icon}</span>
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
                  ? "bg-[#5d23b8]/10 text-[#5d23b8] dark:bg-[#5d23b8]/20 dark:text-white"
                  : "text-gray-600 hover:bg-[#5d23b8]/5 hover:text-[#5d23b8] dark:text-gray-300 dark:hover:bg-[#5d23b8]/10 dark:hover:text-white"
              }`}
            >
              <span className={`mr-3 ${pathname === child.path ? "text-[#5d23b8]" : ""}`}>
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
  finance: any[];
  hr?: any[];
  // SAAS props
  business?: any[];
  products?: any[];
  users?: any[];
  support?: any[];
  settings?: any[];
  // Additional properties
  properties?: any[];
  bookings?: any[];
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
  products = [],
  users = [],
  support = [],
  settings = [],
  // Additional properties
  properties = [],
  bookings = []
}: SidebarProps) {
  const pathname = usePathname()
  
  // Determine if we're in SAAS mode
  const isSaas = business.length > 0
  
  // Determine if we're in booking mode
  const isBooking = pathname.includes('/booking-dashboard') || 
                   pathname.includes('/bookings') || 
                   pathname.includes('/rental-units') || 
                   pathname.includes('/guests')

  // Combine all menus for finding current open menu
  const allMenuItems = isSaas 
    ? [
        ...mainMenu,
        ...business,
        ...products,
        ...users,
        ...support,
        ...finance,
        ...settings
      ]
    : [
        ...mainMenu, 
        ...sales, 
        ...crm, 
        ...marketing, 
        ...loyalty, 
        ...communication,
        ...finance,
        ...hr,
        ...properties,
        ...bookings
      ]
  
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

          {/* Conditional Sections Based on Mode */}
          {isSaas ? (
            <>
              {/* Business Section */}
              {business.length > 0 && (
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
              )}

              {/* Products Section */}
              {products.length > 0 && (
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
              )}

              {/* Users Section */}
              {users.length > 0 && (
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
              )}

              {/* Support Section */}
              {support.length > 0 && (
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
              )}
            </>
          ) : isBooking ? (
            // Booking client type specific sections
            <>
              {/* Properties Section for Booking */}
              {properties.length > 0 && (
                <div>
                  <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Properties
                  </h3>
                  <nav className="space-y-1">
                    {properties.map((item) => (
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
              
              {/* Bookings Section */}
              {bookings.length > 0 && (
                <div>
                  <h3 className="px-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Bookings
                  </h3>
                  <nav className="space-y-1">
                    {bookings.map((item) => (
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
              
              {/* Sales Section */}
              {sales.length > 0 && (
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
              )}

              {/* CRM Section */}
              {crm.length > 0 && (
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
              )}

              {/* Marketing Section */}
              {marketing.length > 0 && (
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
              )}

              {/* Loyalty Program Section */}
              {loyalty.length > 0 && (
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
              )}

              {/* Communication Section */}
              {communication.length > 0 && (
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
              )}
            </>
          ) : (
            // Default ecommerce sections
            <>
              {/* Sales Section */}
              {sales.length > 0 && (
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
              )}

              {/* CRM Section */}
              {crm.length > 0 && (
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
              )}

              {/* Marketing Section */}
              {marketing.length > 0 && (
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
              )}

              {/* Loyalty Program Section */}
              {loyalty.length > 0 && (
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
              )}

              {/* Communication Section */}
              {communication.length > 0 && (
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
              )}
            </>
          )}

          {/* Finance Section - Common to all modes */}
          {finance.length > 0 && (
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
          {isSaas ? (
            settings.length > 0 && (
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
            )
          ) : (
            hr.length > 0 && (
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
            )
          )}
        </div>
      </div>
    </div>
  )
}