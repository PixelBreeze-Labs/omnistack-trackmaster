// src/app/crm/ecommerce/finance/transactions/page.tsx
import { Metadata } from "next"
import { TransactionsContent } from "@/components/crm/finance/transactions"

export const metadata: Metadata = {
    title: "Finance Transactions - TrackMaster CRM",
    description: "Manage your Finance Transactions",
}

export default function TransactionsPage() {
    return (
        <div className="px-3">
            <TransactionsContent />
        </div>
    )
}