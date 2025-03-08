// src/app/crm/platform/guests/page.tsx
import { Metadata } from "next"
import { GuestInsights } from "@/components/crm/guests/guest-insights"

export const metadata: Metadata = {
    title: "Guests Insights - TrackMaster CRM",
    description: "Manage and view all your guests insights",
}

export default function GuestInsightsPage() {
    return (
        <div className="px-3">
            <GuestInsights />
        </div>
    )
}