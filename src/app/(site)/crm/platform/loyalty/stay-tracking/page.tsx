import { Metadata } from "next"
import StayTrackingContent from "@/components/crm/loyalty/StayTrackingContent"
import { LoyaltyNav } from "@/components/crm/loyalty/LoyaltyNav"

export const metadata: Metadata = {
    title: "Stay Tracking - TrackMaster CRM",
    description: "Manage Stay Tracking and member rewards system"
}

export default function StayTrackingPage() {
    return (
        <div className="px-3">
             <LoyaltyNav />
            <StayTrackingContent />
        </div>
    )
}