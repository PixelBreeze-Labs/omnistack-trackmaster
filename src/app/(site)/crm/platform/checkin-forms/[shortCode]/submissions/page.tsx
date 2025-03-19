// app/crm/platform/checkin-forms/[shortCode]/submissions/page.tsx
import { Metadata } from "next"
import { FormSubmissions } from "@/components/crm/customers/checkin-forms/submissions"

export const metadata: Metadata = {
    title: "Form Submissions - TrackMaster CRM",
    description: "View submissions for this check-in form",
}

export default function FormSubmissionsPage({ params }: { params: { shortCode: string } }) {
    return (
        <div className="px-3">
            <FormSubmissions shortCode={params.shortCode} />
        </div>
    )
}