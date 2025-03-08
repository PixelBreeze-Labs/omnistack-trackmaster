// src/app/crm/platform/hr/staff/[id]/page.tsx
import { Metadata } from "next";
import StaffDetailsContent from "@/components/crm/hr/staff-details";

export const metadata: Metadata = {
  title: "Staff Details - TrackMaster CRM",
  description: "View and manage staff details",
};

export default function StaffDetailsPage() {
  return (
    <div className="px-3">
      <StaffDetailsContent />
    </div>
  );
}