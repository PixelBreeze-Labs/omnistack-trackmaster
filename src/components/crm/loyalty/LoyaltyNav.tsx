// components/loyalty/LoyaltyNav.tsx
"use client"

import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Gift,
  Award,
  Settings,
  Bed
} from "lucide-react"

export function LoyaltyNav() {
  const { data: session } = useSession()
  const clientType = session?.user?.clientType
  const pathname = usePathname()
  const router = useRouter()

  const clientTypePath = pathname.split('/')[2] // Extract clientType from path

  const navigation = [
    {
      name: 'Program',
      href: `/crm/${clientTypePath}/loyalty/programs`,
      icon: Settings,
      current: pathname.endsWith('programs') || pathname.endsWith('loyalty')
    },
    {
      name: 'Points & Rewards',
      href: `/crm/${clientTypePath}/loyalty/points`,
      icon: Award,
      current: pathname.endsWith('points')
    },
    {
      name: 'Benefits',
      href: `/crm/${clientTypePath}/loyalty/benefits`,
      icon: Gift,
      current: pathname.endsWith('benefits')
    }
  ]

  // Add Stay Tracking for BOOKING clients
  if (clientType === 'BOOKING') {
    navigation.push({
      name: 'Stay Tracking',
      href: `/crm/${clientTypePath}/loyalty/stay-tracking`,
      icon: Bed,
      current: pathname.endsWith('stay-tracking')
    })
  }

  return (
    <div className="flex space-x-2 py-4 pl-4 bg-white border-b mb-6">
      {navigation.map((item) => (
        <Button
          key={item.name}
          variant={item.current ? "default" : "outline"}
          onClick={() => router.push(item.href)}
          style={item.current ? { backgroundColor: "#5FC4D0" } : {}}
        >
          <item.icon className="h-4 w-4 mr-2" />
          {item.name}
        </Button>
      ))}
    </div>
  )
}