// app/crm/platform/qytetaret-dashboard/page.tsx
import { Metadata } from "next";
import QytetaretDashboardContent from "@/components/crm/qytetaret-dashboard/dashboard-content";

export const metadata: Metadata = {
  title: "Dashboard | Qytetaret Admin Platform",
  description: "Overview of community reports and platform metrics",
};

export default function QytetaretDashboardPage() {
  return <QytetaretDashboardContent />;
}