import { Metadata } from "next"
import { Suspense } from "react"
import CoreEngineContent from "@/components/crm/core-engine/core-engine-content"

export const metadata: Metadata = {
  title: "Core Engine - TrackMaster CRM",
  description: "Manage and monitor core ML models, data processing, and machine learning operations",
}

export default function CoreEnginePage() {
  return (
    <div className="px-3">
      <Suspense fallback={<CoreEngineLoading />}>
        <CoreEngineContent />
      </Suspense>
    </div>
  )
}

// Loading component to show while the page is loading
function CoreEngineLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
    </div>
  )
}