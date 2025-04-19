import { Metadata } from "next";
import PollEditForm from "@/components/crm/wp-polls/PollEditForm";

export const generateMetadata = ({ params }: { params: { id: string, pollId: string } }): Metadata => {
  return {
    title: `Edit Poll - Studio CRM`,
    description: `Edit poll details for client organization.`,
  };
};

export default function PollEditPage({ params }: { params: { id: string, pollId: string } }) {
  const clientId = params.id;
  const pollId = params.pollId;
  
  return (
    <div className="flex-1 space-y-4 px-3">
      <PollEditForm clientId={clientId} pollId={pollId} />
    </div>
  );
}
