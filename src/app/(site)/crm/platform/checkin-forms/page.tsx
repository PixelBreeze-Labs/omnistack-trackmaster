// app/crm/platform/checkin-forms/page.tsx
import { Metadata } from "next"
import { AllCheckinForms } from "@/components/crm/customers/checkin-forms"

export const metadata: Metadata = {
    title: "Check-in Forms - TrackMaster CRM",
    description: "Manage your guest check-in forms",
}

export default function CheckinFormsPage() {
    return (
        <div className="px-3">
            <AllCheckinForms />
        </div>
    )
}