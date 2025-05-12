// src/app/crm/platform/sync-history/page.tsx
import { Metadata } from "next"
import { Suspense } from "react"
import SyncHistoryContent from "@/components/crm/sync-history/sync-history-content"

export const metadata: Metadata = {
  title: "Sync History - TrackMaster CRM",
  description: "View and manage system synchronization history and statistics",
}

export default function SyncHistoryPage() {
  return (
    <div className="px-3">
      <Suspense fallback={<SyncHistoryLoading />}>
        <SyncHistoryContent />
      </Suspense>
    </div>
  )
}

// Loading component to show while the page is loading
function SyncHistoryLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
    </div>
  )
}