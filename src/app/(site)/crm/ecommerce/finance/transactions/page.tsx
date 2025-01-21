// src/app/crm/ecommerce/finance/transactions/page.tsx
import { Metadata } from "next"
import { TransactionsContent } from "@/components/crm/finance/transactions"

export const metadata: Metadata = {
    title: "HR Staff - TrackMaster CRM",
    description: "Manage your Staff",
}

export default function TransactionsPage() {
    return (
        <div className="px-3">
            <TransactionsContent />
        </div>
    )
}