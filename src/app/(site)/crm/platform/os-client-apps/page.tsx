// src/app/crm/platform/os-client-apps/page.tsx
import { Metadata } from "next"
import { ClientAppsContent } from "@/components/crm/clients-management/client-apps-content"

export const metadata: Metadata = {
    title: "Client Applications - Studio CRM",
    description: "Manage client applications and their configurations.",
}

export default function ClientAppsPage() {
    return (
        <div className="px-3">
            <ClientAppsContent />
        </div>
    )
}