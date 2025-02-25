// src/app/crm/platform/businesss/page.tsx
import { Metadata } from "next"
import BusinessesContent from "@/components/crm/business/business-content"

export const metadata: Metadata = {
    title: "Businesses - TrackMaster CRM",
    description: "Manage your businesses",
}

export default function BusinessesPage() {
    return (
        <div className="px-3">
            <BusinessesContent />
        </div>
    )
}