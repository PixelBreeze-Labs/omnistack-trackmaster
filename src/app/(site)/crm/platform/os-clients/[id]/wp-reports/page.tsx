import { Metadata } from "next";
import ReportsListContent from "@/components/crm/wp-reports/ReportsListContent";

export const generateMetadata = ({ params }: { params: { id: string } }): Metadata => {
  return {
    title: `Reports - Studio CRM`,
    description: `View and manage reports for client organization.`,
  };
};

export default function WPReportsListPage({ params }: { params: { id: string } }) {
  const clientId = params.id;
  
  return (
    <div className="flex-1 space-y-4 px-3">
      <ReportsListContent clientId={clientId} />
    </div>
  );
}

