// src/app/crm/platform/os-clients/page.tsx
import { Metadata } from "next"
import { ClientsContent } from "@/components/crm/clients-management/clients-content"

export const metadata: Metadata = {
    title: "Clients - Studio CRM",
    description: "Manage client organizations and their applications.",
}

export default function ClientsPage() {
    return (
        <div className="px-3">
            <ClientsContent />
        </div>
    )
}