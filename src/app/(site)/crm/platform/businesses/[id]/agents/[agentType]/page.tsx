// src/app/crm/platform/businesses/[id]/agents/[agentType]/page.tsx
import { Metadata } from "next"
import AgentConfigurationContent from "@/components/crm/business/agent-configuration-content"
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Agent Configuration - Staffluent Admin",
    description: "Configure an intelligent agent for a business",
}

export default function AgentConfigurationPage({ params }: { params: { id: string, agentType: string } }) {
    return (
        <div className="px-3">
            <Suspense fallback={<AgentConfigurationLoading />}>
                <AgentConfigurationContent 
                  businessId={params.id} 
                  agentType={params.agentType} 
                />
            </Suspense>
        </div>
    );
}

// Loading component to show while the page is loading
function AgentConfigurationLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
        </div>
    );
}