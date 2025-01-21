// src/app/crm/ecommerce/orders/omnichannel/page.tsx
import { Metadata } from "next"
import { OmnichannelOrders } from "@/components/crm/orders/omnichannel-orders"

export const metadata: Metadata = {
    title: "Omnichannel Orders - TrackMaster CRM",
    description: "Comprehensive view of orders across all sales channels",
}

export default function OmnichannelOrdersPage() {
    return (
        <div className="px-3">
            <OmnichannelOrders />
        </div>
    )
}