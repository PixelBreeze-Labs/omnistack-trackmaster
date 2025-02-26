// src/app/(site)/crm/platform/businesses/new/page.tsx
import { Metadata } from "next";
import RegisterBusinessContent from "@/components/crm/business/RegisterBusinessContent";

export const metadata: Metadata = {
  title: "Register Business - Staffluent CRM",
  description: "Register a new business and set up their subscription",
};

export default function RegisterBusinessPage() {
  return <RegisterBusinessContent />;
}