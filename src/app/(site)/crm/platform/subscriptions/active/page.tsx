import { Metadata } from "next";
import SubscriptionsContent from "@/components/crm/subscription/subscriptions-content";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Active Subscriptions - TrackMaster CRM",
  description: "Manage your active subscriptions",
};

export default function ActiveSubscriptionsPage() {
  return (
    <div className="px-3">
      <Suspense fallback={<SubscriptionsLoading />}>
        <SubscriptionsContent status="active" />
      </Suspense>
    </div>
  );
}

// Loading component to show while the page is loading
function SubscriptionsLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
    </div>
  );
}