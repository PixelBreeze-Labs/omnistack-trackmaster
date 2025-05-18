import { Metadata } from "next"
import { Suspense } from "react"
import IntelligenceHubContent from "@/components/crm/intelligence-hub/intelligence-hub-content"

export const metadata: Metadata = {
  title: "Intelligence Hub - TrackMaster CRM",
  description: "Monitor and manage AI models, insights, and predictions for your construction projects",
}

export default function IntelligenceHubPage() {
  return (
    <div className="px-3">
      <Suspense fallback={<IntelligenceHubLoading />}>
        <IntelligenceHubContent />
      </Suspense>
    </div>
  )
}

// Loading component to show while the page is loading
function IntelligenceHubLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
    </div>
  )
}