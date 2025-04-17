"use client";

import { useParams } from "next/navigation";
import ReportsListContent from "@/components/crm/wp-reports/ReportsListContent";

export default function WPReportsListPage() {
  const params = useParams();
  const clientId = params.id as string;
  console.log('clientId', clientId);
  return (
    <div className="flex-1 space-y-4 px-3">
      <ReportsListContent clientId={clientId} />
    </div>
  );
}