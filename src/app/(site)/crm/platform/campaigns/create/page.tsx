// src/app/crm/platform/campaigns/create/page.tsx
import { Metadata } from "next";
import { CampaignCreate } from "@/components/crm/campaign-create";

export const metadata: Metadata = {
    title: "Create Campaign - CRM",
    description: "Build and launch a new campaign",
};

export default function CampaignCreatePage() {
    return (
        <div className="px-5">
            <CampaignCreate />
        </div>
    );
}
