// src/app/crm/platform/guests/page.tsx
import { Metadata } from "next"
import { GuestPreferences } from "@/components/crm/guests/guest-preferences"

export const metadata: Metadata = {
    title: "Guests Preferences - TrackMaster CRM",
    description: "Manage and view all your guests preferences",
}

export default function GuestPreferencesPage() {
    return (
        <div className="px-3">
            <GuestPreferences />
        </div>
    )
}