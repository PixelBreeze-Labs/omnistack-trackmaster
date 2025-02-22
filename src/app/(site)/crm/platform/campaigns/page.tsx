// src/app/crm/platform/campaigns/page.tsx
import { Metadata } from "next";
import { CampaignsList } from "@/components/crm/campaigns-list";

export const metadata: Metadata = {
    title: "Campaigns List - CRM",
    description: "View and manage all campaigns",
};

export default function CampaignsListPage() {
    return (
        <div className="px-5">
            <CampaignsList />
        </div>
    );
}
