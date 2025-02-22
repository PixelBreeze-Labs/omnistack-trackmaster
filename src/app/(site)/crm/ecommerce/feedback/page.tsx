// src/app/crm/platform/feedback/page.tsx
import { Metadata } from "next"
import { CustomerFeedback } from "@/components/crm/customer-feedback"

export const metadata: Metadata = {
    title: "Customer Feedback - TrackMaster CRM",
    description: "Monitor and manage customer feedback and ratings",
}

export default function CustomerFeedbackPage() {
    return (
        <div className="px-5">
            <CustomerFeedback />
        </div>
    )
}