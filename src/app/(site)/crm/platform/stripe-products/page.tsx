// src/app/crm/platform/stripe-products/page.tsx
import { Metadata } from "next"
import { StripeProducts } from "@/components/crm/stripe/products"

export const metadata: Metadata = {
    title: "Stripe Products & Prices - TrackMaster CRM",
    description: "Manage your stripe products and prices",
}

export default function StripeProductsPage() {
    return (
        <div className="px-3">
            <StripeProducts />
        </div>
    )
}