import { Metadata } from "next";
import ReportDetails from "@/components/crm/reports/ReportDetails";

export const metadata: Metadata = {
  title: "Report Details | Qytetarët CRM",
  description: "View and manage details of a community report",
};

interface ReportDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ReportDetailsPage({ params }: ReportDetailsPageProps) {
  return (
    <div className="px-3">
      <ReportDetails reportId={params.id} />
    </div>
  );
}