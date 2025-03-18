// app/crm/platform/citizens/all/page.tsx
import { Metadata } from "next";
import AllCitizens from "@/components/crm/citizens/AllCitizens";

export const metadata: Metadata = {
  title: "All Citizens | Qytetarët CRM",
  description: "Manage citizens registered through your platform",
};

export default function AllCitizensPage() {
  return (
    <div className="px-3">
      <AllCitizens />
    </div>
  );
}