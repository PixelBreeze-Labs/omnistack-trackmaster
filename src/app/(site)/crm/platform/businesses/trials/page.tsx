// src/app/crm/platform/businesss/trials/page.tsx
import { Metadata } from "next"
import BusinessesTrialsContent from "@/components/crm/business/business-trials-content"

export const metadata: Metadata = {
    title: "Businesses - TrackMaster CRM",
    description: "Manage your businesses",
}

export default function BusinessesTrialsPage() {
    return (
        <div className="px-3">
            <BusinessesTrialsContent />
        </div>
    )
}