// src/app/crm/platform/businesses/[id]/edit/page.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import BusinessEditForm from "@/components/crm/business/business-edit-form";

export const metadata: Metadata = {
  title: "Edit Business - Staffluent Admin",
  description: "Update business details and settings",
};

export default function BusinessEditPage({ params }: { params: { id: string } }) {
  return (
    <div className="px-3">
      <Suspense fallback={<BusinessEditLoading />}>
        <BusinessEditForm businessId={params.id} />
      </Suspense>
    </div>
  );
}

// Loading component to show while the page is loading
function BusinessEditLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
    </div>
  );
}