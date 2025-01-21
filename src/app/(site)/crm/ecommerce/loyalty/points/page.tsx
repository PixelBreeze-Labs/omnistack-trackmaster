// src/app/crm/ecommerce/loyalty/points/page.tsx
import { Metadata } from "next"
import { PointsRewardsContent } from "@/components/crm/loyalty/points"

export const metadata: Metadata = {
    title: "Points & Rewards - TrackMaster CRM",
    description: "Manage loyalty points and member rewards system"
}

export default function PointsRewardsPage() {
    return (
        <div className="px-3">
            <PointsRewardsContent />
        </div>
    )
}