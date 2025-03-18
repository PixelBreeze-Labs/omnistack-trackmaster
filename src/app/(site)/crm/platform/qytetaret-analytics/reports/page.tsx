// app/crm/platform/qytetaret-analytics/reports/page.tsx
import { Metadata } from "next";
import ReportAnalyticsContent from "@/components/crm/analytics/QytetaretReportAnalyticsContent";

export const metadata: Metadata = {
  title: "Report Analytics | Platform CRM",
  description: "Detailed analytics and insights for community reports",
};

export default function AnalyticsPage() {
  return (
    <div className="px-3">
      <ReportAnalyticsContent />
    </div>
  );
}