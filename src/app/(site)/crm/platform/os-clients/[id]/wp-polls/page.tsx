"use client";

import { useParams } from "next/navigation";
import PollsListContent from "@/components/crm/wp-polls/PollsListContent";

export default function PollsListPage() {
  const params = useParams();
  const clientId = params.id as string;
  
  return (
    <div className="flex-1 space-y-4 px-3">
      <PollsListContent clientId={clientId} />
    </div>
  );
}