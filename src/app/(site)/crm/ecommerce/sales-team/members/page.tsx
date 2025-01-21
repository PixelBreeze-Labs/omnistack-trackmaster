// src/app/crm/[type]/sales-team/members/page.tsx
import { Metadata } from "next"
import { SalesTeam } from "@/components/crm/sales-team/members"

export const metadata: Metadata = {
    title: "Sales Team - TrackMaster CRM",
    description: "Manage and monitor your sales team performance",
}

export default function SalesTeamMembersPage() {
    return (
        <div className="px-3">
            <SalesTeam />
        </div>
    )
}