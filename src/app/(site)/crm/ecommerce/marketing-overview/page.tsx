// src/app/crm/ecommerce/marketing-overview/page.tsx
import { Metadata } from "next"
import { MarketingContent } from "@/components/crm/marketing/marketing-content"

export const metadata: Metadata = {
    title: "Marketing Overview - TrackMaster CRM",
    description: "Monitor and manage your marketing campaigns and promotions.",
}

export default function MarketingPage() {
    return (
        <div className="px-3">
            <MarketingContent />
        </div>
    )
}