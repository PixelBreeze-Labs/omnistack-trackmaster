import { Metadata } from "next";

import PollsListContent from "@/components/crm/wp-polls/PollsListContent";

export const generateMetadata = ({ params }: { params: { id: string } }): Metadata => {
  return {
    title: `Polls - Studio CRM`,
    description: `View and manage polls for client organization.`,
  };
};

export default function PollsListPage({ params }: { params: { id: string } }) {
  const clientId = params.id;
  
  return (
    <div className="flex-1 space-y-4 px-3">
      <PollsListContent clientId={clientId} />
    </div>
  );
}
