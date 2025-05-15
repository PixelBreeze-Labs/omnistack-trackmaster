// src/app/crm/platform/knowledge/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import KnowledgeBaseContent from "@/components/crm/knowledge/KnowledgeBaseContent";

export const metadata: Metadata = {
  title: "Knowledge Base Management",
  description: "Manage knowledge base documents and query responses",
};

export default function KnowledgeBasePage() {
  return (
    <div className="container mx-auto px-3">
      <Suspense fallback={<KnowledgeBaseLoading />}>
        <KnowledgeBaseContent />
      </Suspense>
    </div>
  );
}

function KnowledgeBaseLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
}