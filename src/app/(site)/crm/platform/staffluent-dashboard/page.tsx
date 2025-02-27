// app/crm/platform/staffluent-dashboard/page.tsx
import { Metadata } from "next";
import StaffluentDashboardContent from "@/components/crm/staffluent-dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard | Admin Platform",
  description: "Overview of your business and platform metrics",
};

export default function StaffluentDashboardPage() {
  return <StaffluentDashboardContent />;
}