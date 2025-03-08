// app/crm/platform/pixelbreeze-dashboard/page.tsx
import { Metadata } from "next";
import PixelBreeezeDashboardContent from "@/components/crm/pixelbreeze-dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard | Admin Platform",
  description: "Overview of your business and platform metrics",
};

export default function PixelBreeezeDashboardPage() {
  return <PixelBreeezeDashboardContent />;
}