// app/crm/platform/staff/admin/page.tsx
import { Metadata } from "next";
import StaffAdminUsersContent from "@/components/crm/staff/staff-admin-users-content";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Staff Admin Users | Admin Dashboard",
  description: "Manage staff admin users registered and their administered businesses",
};

export default function StaffAdminUsersPage() {
  return (
     <Suspense fallback={<StaffAdminUsersLoading />}>
        <StaffAdminUsersContent />
      </Suspense>
  );
}

// Loading component to show while the page is loading
function StaffAdminUsersLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
    </div>
  );
}