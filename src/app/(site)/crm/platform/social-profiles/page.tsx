// src/app/crm/platform/social-profiles/page.tsx
import { Metadata } from "next"
import { AllSocialProfiles } from "@/components/crm/social/social-profiles"

export const metadata: Metadata = {
    title: "Social Profiles - PixelBreeze CRM",
    description: "Manage your social media profiles",
}

export default function SocialProfilesPage() {
    return (
        <div className="px-3">
            <AllSocialProfiles />
        </div>
    )
}