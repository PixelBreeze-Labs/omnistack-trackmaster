// src/app/crm/platform/stripe-products/page.tsx
import { Metadata } from "next"
import { StripeConfig } from "@/components/crm/stripe/config"

export const metadata: Metadata = {
    title: "Stripe Configuration - TrackMaster CRM",
    description: "Manage your stripe configuration settings",
}

export default function StripeConfigPage() {
    return (
        <div className="px-3">
            <StripeConfig />
        </div>
    )
}