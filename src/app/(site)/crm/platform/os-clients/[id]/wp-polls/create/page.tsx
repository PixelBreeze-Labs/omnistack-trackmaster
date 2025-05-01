// app/crm/platform/os-clients/[clientId]/wp-polls/create/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import CreatePollForm from "@/components/crm/wp-polls/CreatePollForm";

interface CreatePollPageProps {
  params: {
    clientId: string;
  };
}

export default function PollCreatePage({ params }: CreatePollPageProps) {
  const { clientId } = params;

  return (
    <div className="container mx-auto py-6">
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

