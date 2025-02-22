// src/app/crm/[type]/sales-team/assignments/page.tsx
import { Metadata } from "next"
import { CustomerAssignments } from "@/components/crm/sales-team/assignments"

export const metadata: Metadata = {
    title: "Customer Assignments - TrackMaster CRM",
    description: "Manage customer assignments to sales associates",
}

export default function CustomerAssignmentsPage() {
    return (
        <div className="px-5">
            <CustomerAssignments />
        </div>
    )
}