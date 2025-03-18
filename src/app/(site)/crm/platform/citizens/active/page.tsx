// app/crm/platform/citizens/active/page.tsx
import { Metadata } from "next";
import ActiveReporters from "@/components/crm/citizens/ActiveReporters";

export const metadata: Metadata = {
  title: "Active Reporters | Qytetarët CRM",
  description: "View citizens who have submitted multiple reports",
};

export default function ActiveReportersPage()