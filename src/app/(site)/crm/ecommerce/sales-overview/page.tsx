// src/app/crm/platform/sales-overview/page.tsx
import { Metadata } from "next"
import { SalesContent } from "@/components/crm/sales/sales-content"

export const metadata: Metadata = {
    title: "Sales Overview - TrackMaster CRM",
    description: "Comprehensive overview of your sales performance and metrics.",
}

export default function SalesPage() {
    return (
        <div className="px-3">
            <SalesContent />
        </div>
    )
}