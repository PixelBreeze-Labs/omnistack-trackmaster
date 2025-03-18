// app/crm/platform/reports/all/page.tsx
import { Metadata } from "next";
import AllReports from "@/components/crm/reports/AllReports";

export const metadata: Metadata = {
  title: "All Reports | Qytetarët CRM",
  description: "Manage reports submitted through your platform",
};

export default function AllReportsPage() {
  return (
    <div className="px-3">
      <AllReports />
    </div>
  );
}