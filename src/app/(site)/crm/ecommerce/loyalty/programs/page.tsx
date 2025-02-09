// src/app/crm/ecommerce/loyalty/programs/page.tsx
import { Metadata } from "next"
import { ProgramContent } from "@/components/crm/loyalty/programs"

export const metadata: Metadata = {
    title: "Loyalty Programs - TrackMaster CRM",
    description: "Manage your loyalty program tiers and settings"
}

export default function LoyaltyProgramsPage() {
    return (
        <div className="px-3">
            <ProgramContent />
        </div>
    )
}