// src/app/crm/ecommerce/dashboard/page.tsx
import { Metadata } from "next"
import { DashboardContent } from "@/components/crm/dashboard/dashboard-content"

export const metadata: Metadata = {
    title: "Dashboard - TrackMaster CRM",
    description: "E-commerce dashboard for managing sales, customers, and analytics.",
}

export default function DashboardPage() {
    return (
        <div className="px-3">
            <DashboardContent />
        </div>
    )
}