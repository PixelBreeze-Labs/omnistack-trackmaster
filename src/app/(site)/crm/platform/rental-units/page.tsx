// src/app/crm/platform/rental-units/page.tsx
import { Metadata } from "next"
import { RentalUnitsContent } from "@/components/crm/rental-units/RentalUnitsContent"

export const metadata: Metadata = {
  title: "Rental Units - Metrosuites",
  description: "Manage all your rental properties in one place",
}

export default function RentalUnitsPage() {
  return (
    <div className="px-3">
      <RentalUnitsContent />
    </div>
  )
}