import { Metadata } from "next";

import ClientDetailsContent from "@/components/crm/clients-management/ClientDetailsContent";

export const generateMetadata = ({ params }: { params: { id: string } }): Metadata => {
  return {
    title: `Client Details - Studio CRM`,
    description: `Manage details for client organization.`,
  };
};

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
  const clientId = params.id;

  return (
    <div className="flex-1 space-y-4 px-3">
      <ClientDetailsContent clientId={clientId} />
    </div>
  );
}