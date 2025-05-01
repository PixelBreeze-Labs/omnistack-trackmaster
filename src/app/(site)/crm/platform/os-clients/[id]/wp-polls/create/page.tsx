// app/crm/platform/os-clients/[id]/wp-polls/create/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import CreatePollForm from "@/components/crm/wp-polls/CreatePollForm";

export const generateMetadata = ({ params }: { params: { id: string } }): Metadata => {
  return {
    title: `Create Multi-Client Poll - Studio CRM`,
    description: `Create a new multi-client poll for sharing across organizations.`,
  };
};

interface CreatePollPageProps {
  params: {
    id: string;  // Using "id" to match your route pattern
  };
}

export default function PollCreatePage({ params }: CreatePollPageProps) {
  const clientId = params.id;  // Extract clientId from "id" parameter

  if (!clientId) {
    console.error("Client ID is undefined");
    return notFound();
  }

  return (
    <div className="flex-1 space-y-4 px-3">
      <Suspense fallback={<PollFormSkeleton />}>
        <CreatePollForm clientId={clientId} />
      </Suspense>
    </div>
  );
}

// Loading skeleton
function PollFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-10 w-48 ml-auto" />
        </div>
        <Skeleton className="h-[500px] w-full" />
      </div>
    </div>
  );
}