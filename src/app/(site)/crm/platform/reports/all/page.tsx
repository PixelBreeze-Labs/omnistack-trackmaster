// app/crm/platform/reports/all/page.tsx
import { Metadata } from "next";
import AdminReportsList from "@/components/crm/reports/AdminReportsList";

export const metadata: Metadata = {
  title: "All Reports | Qytetarët CRM",
  description: "Manage reports submitted through your platform",
};

export default function AllReportsPage() {
  return (
    <div className="px-3">
      <AdminReportsList />
    </div>
  );
}