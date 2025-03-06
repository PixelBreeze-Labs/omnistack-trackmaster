// src/app/crm/platform/loyalty/benefits/page.tsx
import { Metadata } from "next"
import { BenefitsContent } from "@/components/crm/loyalty/benefits"
import { LoyaltyNav } from "@/components/crm/loyalty/LoyaltyNav"

export const metadata: Metadata = {
    title: "Member Benefits - TrackMaster CRM",
    description: "Manage loyalty program benefits and tier privileges"
}

export default function BenefitsPage() {
    return (
        <div className="px-3">
             <LoyaltyNav/>
            <BenefitsContent />
        </div>
    )
}