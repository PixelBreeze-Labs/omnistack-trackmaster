// src/app/crm/platform/studio-dashboard/page.tsx
import { Metadata } from "next"
import { StudioDashboardContent } from "@/components/crm/studio-dashboard/studio-dashboard-content"

export const metadata: Metadata = {
    title: "Dashboard - Studio CRM",
    description: "Studio platform dashboard for managing clients, applications, and deployments.",
}

export default function StudioDashboardPage() {
    return (
        <div className="px-3">
            <StudioDashboardContent />
        </div>
    )
}