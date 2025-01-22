import { Metadata } from "next";
import { MyClubList } from "@/components/crm/myclub-list";

export const metadata: Metadata = {
    title: "My Club - CRM",
    description: "View all users registered through the My Club landing page",
};

export default function MyClubListPage() {
    return (
        <div className="px-5">
            <MyClubList />
        </div>
    );
}
