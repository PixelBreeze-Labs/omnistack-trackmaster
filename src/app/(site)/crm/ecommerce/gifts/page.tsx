// src/app/crm/ecommerce/gifts/page.tsx
import { Metadata } from "next"
import { GiftsAdvisory } from "@/components/crm/gifts-advisory"

export const metadata: Metadata = {
    title: "Gifts Advisory - TrackMaster CRM",
    description: "Personalized gift recommendations for your customers",
}

export default function GiftsAdvisoryPage() {
    return (
        <div className="px-5">
            <GiftsAdvisory />
        </div>
    )
}