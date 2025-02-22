// src/app/crm/platform/orders/page.tsx
import { Metadata } from "next"
import { AllOrders } from "@/components/crm/orders/all-orders"

export const metadata: Metadata = {
    title: "All Orders - TrackMaster CRM",
    description: "Manage and track all your orders",
}

export default function OrdersPage() {
    return (
        <div className="px-3">
            <AllOrders />
        </div>
    )
}