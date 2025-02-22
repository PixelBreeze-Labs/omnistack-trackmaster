// src/app/(site)/crm/platform/paid-campaigns/page.tsx
import { Metadata } from "next"
import PaidCampaignsComponent from "@/components/crm/paid-campaigns/paid-campaigns-content"

export const metadata: Metadata = {
    title: "Paid Campaigns - TrackMaster CRM",
    description: "Manage your paid campaigns",
}

export default function PaidCampaignsPage() {
    return (
        <div className="px-3">
            <PaidCampaignsComponent />
        </div>
    )
}