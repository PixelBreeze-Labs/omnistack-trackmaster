// app/crm/platform/staff/admin/page.tsx
import { Metadata } from "next";
import StaffAdminUsersContent from "@/components/crm/staff/staff-admin-users-content";

export const metadata: Metadata = {
  title: "Staff Admin Users | Admin Dashboard",
  description: "Manage staff admin users registered and their administered businesses",
};

export default function StaffAdminUsersPage() {
  return <StaffAdminUsersContent />;
}