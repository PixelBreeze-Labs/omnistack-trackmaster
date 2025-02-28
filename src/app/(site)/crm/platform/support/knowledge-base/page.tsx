import { Metadata } from "next";
import EmptyPageContent from "@/components/crm/empty/empty-content";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Empty - TrackMaster CRM",
  description: "Empty Contnt",
};

export default function KnowledgeBasePage() {
  return (
    <div className="px-3">
      <Suspense fallback={<KnowledegeBaseLoading />}>
        <EmptyPageContent />
      </Suspense>
    </div>
  );
}

// Loading component to show while the page is loading
function KnowledegeBaseLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
    </div>
  );
}