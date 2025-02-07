// src/app/admin/settings/page.tsx
import { Metadata } from "next";
import { SettingsContent } from "@/components/crm/settings/settings-content";

export const metadata: Metadata = {
    title: "Settings - TrackMaster",
    description: "Configure system settings and integrations"
};

export default function SettingsPage() {
    return (
        <div className="px-3">
            <SettingsContent />
        </div>
    )
}