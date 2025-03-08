// app/crm/platform/venueboost-dashboard/page.tsx
import { Metadata } from "next";
import VenueBoostDashboardContent from "@/components/crm/venueboost-dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard | Admin Platform",
  description: "Overview of your business and platform metrics",
};

export default function VenueBoostDashboardPage() {
  return <VenueBoostDashboardContent />;
}