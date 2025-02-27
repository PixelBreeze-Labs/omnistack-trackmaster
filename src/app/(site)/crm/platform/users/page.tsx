// app/crm/platform/staff/page.tsx
import { Metadata } from "next";
import StaffUsersContent from "@/components/crm/staff/staff-users-content";

export const metadata: Metadata = {
  title: "Staff Users | Admin Dashboard",
  description: "Manage staff users registered and their businesses",
};

export default function StaffUsersPage() {
  return <StaffUsersContent />;
}