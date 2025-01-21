// src/app/crm/ecommerce/analytics/page.tsx
import { Metadata } from "next"
import { AnalyticsContent } from "@/components/crm/analytics/analytics-content"

export const metadata: Metadata = {
    title: "Analytics - TrackMaster CRM",
    description: "In-depth analytics and insights for your e-commerce business.",
}

export default function AnalyticsPage() {
    return (
        <div className="px-3">
            <AnalyticsContent />
        </div>
    )
}