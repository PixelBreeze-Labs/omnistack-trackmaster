// app/crm/platform/users/page.tsx
import { Metadata } from "next";
import StaffUsersContent from "@/components/crm/staff/staff-users-content";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Staff Users | Admin Dashboard",
  description: "Manage staff users registered and their businesses",
};

export default function StaffUsersPage() {
    return (
       <Suspense fallback={<StaffUsersLoading />}>
          <StaffUsersContent />
        </Suspense>
    );
  }

// Loading component to show while the page is loading
function StaffUsersLoading() {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A0A0A]"></div>
      </div>
    );
  }