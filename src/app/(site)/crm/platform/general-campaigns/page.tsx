import { Metadata } from "next"
import { CampaignsContent } from "@/components/crm/general-campaigns/CampaignsContent"

export const metadata: Metadata = {
  title: "Campaigns - Metrosuites",
  description: "Manage marketing campaigns for email and SMS outreach",
}

export default function GeneralCampaignsPage() {
  return (
    <div className="px-3">
      <CampaignsContent />
    </div>
  )
}