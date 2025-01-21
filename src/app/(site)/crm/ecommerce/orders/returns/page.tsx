// src/app/crm/ecommerce/orders/returns/page.tsx
import { Metadata } from "next"
import { ReturnsAndRefunds } from "@/components/crm/orders/returns-refunds"

export const metadata: Metadata = {
    title: "Returns & Refunds - TrackMaster CRM",
    description: "Process and manage your returns and refunds",
}

export default function ReturnsAndRefundsPage() {
    return (
        <div className="px-3">
            <ReturnsAndRefunds />
        </div>
    )
}