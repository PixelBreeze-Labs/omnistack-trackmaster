"use client";

import { useParams, useRouter } from "next/navigation";
import PollEditForm from "@/components/crm/wp-forms/PollEditForm";

export default function PollEditPage() {
  const params = useParams();
  const clientId = params.id as string;
  const pollId = params.pollId as string;
  
  return (
    <div className="flex-1 space-y-4 px-3">
      <PollEditForm clientId={clientId} pollId={pollId} />
    </div>
  );
}