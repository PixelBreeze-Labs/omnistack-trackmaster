// src/app/crm/ecommerce/members/page.tsx
import { Metadata } from "next"
import { Members } from "@/components/crm/customers/members"

export const metadata: Metadata = {
    title: "Members - TrackMaster CRM",
    description: "Manage your loyalty program members",
}

export default function MembersPage() {
    return (
        <div className="px-3">
            <Members />
        </div>
    )
}