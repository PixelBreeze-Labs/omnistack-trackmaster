// src/app/crm/ecommerce/resources/page.tsx
import { Metadata } from "next"
import { Resources } from "@/components/crm/communication/resources"

export const metadata: Metadata = {
    title: "Resources Center - TrackMaster CRM",
    description: "Everything you need to manage your online store and customers effectively",
}

export default function ResourcesPage() {
    return (
        <div className="px-3">
            <Resources />
        </div>
    )
}