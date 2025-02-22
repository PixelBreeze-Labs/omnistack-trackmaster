// src/app/crm/platform/family-accounts/page.tsx
import { Metadata } from "next"
import { FamilyAccounts } from "@/components/crm/family-accounts"

export const metadata: Metadata = {
    title: "Family Accounts - TrackMaster CRM",
    description: "Manage linked accounts and family relationships",
}

export default function FamilyAccountsPage() {
    return (
        <div className="px-5">
            <FamilyAccounts />
        </div>
    )
}