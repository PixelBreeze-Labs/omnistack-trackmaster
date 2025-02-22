// src/app/crm/platform/hr/staff/page.tsx
import { Metadata } from "next"
import { StaffContent } from "@/components/crm/hr/staff"

export const metadata: Metadata = {
    title: "HR Staff - TrackMaster CRM",
    description: "Manage your Staff",
}

export default function StaffPage() {
    return (
        <div className="px-3">
            <StaffContent />
        </div>
    )
}