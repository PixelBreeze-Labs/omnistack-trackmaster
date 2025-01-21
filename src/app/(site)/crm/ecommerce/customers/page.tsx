// src/app/crm/ecommerce/customers/page.tsx
import { Metadata } from "next"
import { AllCustomers } from "@/components/crm/customers/all-customers"

export const metadata: Metadata = {
    title: "All Customers - TrackMaster CRM",
    description: "Manage and view all your customers",
}

export default function CustomersPage() {
    return (
        <div className="px-5">
            <AllCustomers />
        </div>
    )
}