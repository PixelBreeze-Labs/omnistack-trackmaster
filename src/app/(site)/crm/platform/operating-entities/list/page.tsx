// src/app/crm/platform/operating-entities/list/page.tsx
import { Metadata } from "next"
import { AllOperatingEntities } from "@/components/crm/social/operating-entities"

export const metadata: Metadata = {
    title: "Operating Entities - Social Media CRM",
    description: "Manage your operating entities for social media profiles",
}

export default function OperatingEntitiesListPage() {
    return (
        <div className="px-3">
            <AllOperatingEntities />
        </div>
    )
}