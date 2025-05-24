import { Metadata } from "next"
import { Suspense } from "react"
import AIAgentsContent from "@/components/crm/ai-agents-content"

export const metadata: Metadata = {
  title: "AI Agents - TrackMaster CRM",
  description: "Deploy, manage, and monitor AI agents for automated tasks and intelligent workflows",
}

export default function AgentsPage() {
  return (
    <div className="px-3">
      <Suspense fallback={<AgentsLoading />}>
        <AIAgentsContent />
      </Suspense>
    </div>
  )
}

// Loading component to show while the page is loading
function AgentsLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
    </div>
  )
}