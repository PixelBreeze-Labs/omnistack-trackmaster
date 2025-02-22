// src/app/crm/platform/hr/staff/page.tsx
import { Metadata } from "next"
import { DepartmentsContent } from "@/components/crm/department/department-content"

export const metadata: Metadata = {
    title: "HR Departments - TrackMaster CRM",
    description: "Manage your HR Departments",
}

export default function DepartmentPage() {
    return (
        <div className="px-3">
            <DepartmentsContent />
        </div>
    )
}