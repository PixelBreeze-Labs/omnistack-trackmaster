// app/crm/platform/report-tags/page.tsx
import { Metadata } from "next";
import AllReportTags from "@/components/report-tags/AllReportTags";
import { DashboardShell } from "@/components/shell";
import { DashboardHeader } from "@/components/header";

export const metadata: Metadata = {
  title: "Report Tags | Qytetarët CRM",
  description: "Manage tags for categorizing and organizing reports",
};

export default function ReportTagsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Report Tags"
        text="Create and manage tags for your reports."
      />
      <div className="grid gap-8">
        <AllReportTags />
      </div>
    </DashboardShell>
  );
}