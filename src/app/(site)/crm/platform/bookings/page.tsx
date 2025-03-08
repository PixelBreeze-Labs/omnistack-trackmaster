import { Metadata } from "next"
import { BookingsContent } from "@/components/crm/bookings/BookingsContent"

export const metadata: Metadata = {
  title: "Bookings - Metrosuites",
  description: "Manage reservations for all your properties",
}

export default function BookingsPage() {
  return (
    <div className="px-3">
      <BookingsContent />
    </div>
  )
}