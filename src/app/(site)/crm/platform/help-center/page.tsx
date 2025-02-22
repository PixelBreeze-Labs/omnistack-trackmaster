// src/app/crm/platform/onebox/page.tsx
import { Metadata } from "next"
import { HelpCenter } from "@/components/crm/communication/help-center"

export const metadata: Metadata = {
    title: "Help Center - TrackMaster CRM",
    description: "Unified HelpCenter for your ecommerce",
}

export default function HelpCenterPage() {
    return (
        <div className="px-3">
            <HelpCenter />
        </div>
    )
}