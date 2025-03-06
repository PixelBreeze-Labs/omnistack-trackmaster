// src/app/crm/platform/booking-dashboard/page.tsx
import { Metadata } from "next"
import { BookingDashboardContent } from "@/components/crm/booking-dashboard/booking-dashboard-content"

export const metadata: Metadata = {
    title: "Dashboard - Metrosuites CRM",
    description: "Booking platform dashboard for managing properties, reservations, and guests.",
}

export default function BookingDashboardPage() {
    return (
        <div className="px-3">
            <BookingDashboardContent />
        </div>
    )
}