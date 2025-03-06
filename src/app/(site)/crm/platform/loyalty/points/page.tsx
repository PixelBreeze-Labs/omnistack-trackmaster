// src/app/crm/platform/loyalty/points/page.tsx
import { Metadata } from "next"
import { PointsRewardsContent } from "@/components/crm/loyalty/points"
import { LoyaltyNav } from "@/components/crm/loyalty/LoyaltyNav"

export const metadata: Metadata = {
    title: "Points & Rewards - TrackMaster CRM",
    description: "Manage loyalty points and member rewards system"
}

export default function PointsRewardsPage() {
    return (
        <div className="px-3">
             <LoyaltyNav />
            <PointsRewardsContent />
        </div>
    )
}