// app/crm/platform/report-tags/page.tsx
import { Metadata } from "next";
import AllReportTags from "@/components/crm/report-tags/AllReportTags";

export const metadata: Metadata = {
  title: "Report Tags | Qytetarët CRM",
  description: "Manage tags for categorizing and organizing reports",
};

export default function ReportTagsPage() {
  return (
   
    <div className="px-3">
        <AllReportTags />
      </div>
   
  );
}