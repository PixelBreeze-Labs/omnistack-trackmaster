// src/app/crm/platform/guests/page.tsx
import { Metadata } from "next"
import { AllGuests } from "@/components/crm/guests/all-guests"

export const metadata: Metadata = {
    title: "All Guests - TrackMaster CRM",
    description: "Manage and view all your guests",
}

export default function GuestsPage() {
    return (
        <div className="px-3">
            <AllGuests />
        </div>
    )
}