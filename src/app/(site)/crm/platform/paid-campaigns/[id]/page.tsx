import { Metadata } from "next";
import PaidCampaignDetailsComponent from "@/components/crm/paid-campaigns/paid-campaign-details-content";

export const metadata: Metadata = {
    title: "Paid Campaign Details - TrackMaster CRM",
    description: "View detailed paid campaign performance metrics"
};

export default function PaidCampaignDetailsPage() {
    return (
        <div className="px-3">
            <PaidCampaignDetailsComponent />
        </div>
    );
}