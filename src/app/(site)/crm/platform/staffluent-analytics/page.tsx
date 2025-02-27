// app/crm/platform/staffluent-analytics/page.tsx
import { Metadata } from "next";
import StaffluentAnalyticsContent from "@/components/crm/staffluent-analytics/analytics-content";

export const metadata: Metadata = {
  title: "Analytics | Admin Platform",
  description: "Detailed analytics and insights for your platform",
};

export default function AnalyticsPage() {
  return <StaffluentAnalyticsContent />;
}