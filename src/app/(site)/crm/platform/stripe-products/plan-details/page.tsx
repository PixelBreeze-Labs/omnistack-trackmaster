// src/app/crm/platform/stripe-products/plan-details/page.tsx
import { Metadata } from "next"
import PlanDetailsContent from "@/components/crm/stripe/plan-details-content"

export const metadata: Metadata = {
    title: "Subscription Plan Details - TrackMaster CRM",
    description: "View features and limits for each subscription tier",
}

export default function StripeProductPlanDetailsPage() {
    return (
        <div className="px-3">
            <PlanDetailsContent />
        </div>
    )
}