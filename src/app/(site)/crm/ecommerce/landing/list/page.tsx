import { Metadata } from "next";
import { LandingList } from "@/components/crm/landing-list";

export const metadata: Metadata = {
    title: "Landing Page - CRM",
    description: "View all users registered through the landing page",
};

export default function LandingListPage() {
    return (
        <div className="px-5">
            <LandingList />
        </div>
    );
}
