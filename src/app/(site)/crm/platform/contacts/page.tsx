import { Metadata } from "next";
import AllContacts from "@/components/crm/contacts/AllContacts";

export const metadata: Metadata = {
  title: "Contacts | Qytetarët CRM",
  description: "Manage and review contact form submissions",
};

export default function ContactsPage() {
  return (
    <div className="px-3">
      <AllContacts />
    </div>
  );
}