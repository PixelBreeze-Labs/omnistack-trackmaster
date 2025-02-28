import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  // Get the current user with client info
  const user = await getCurrentUser();

  if (user) {
    // Check user role and client type
    const userRole = user.role;
    const clientType = user?.clientType;

    // Replicate middleware logic for redirection
    if (userRole === "ADMIN") {
      redirect("/crm/platform/dashboard");
    } else if (clientType) {
      const unifiedClientType = clientType ? 'platform' : 'platform'
      if (clientType === 'SAAS') {
        redirect(`/crm/${unifiedClientType.toLowerCase()}/staffluent-dashboard`);
      } else {
        redirect(`/crm/${unifiedClientType.toLowerCase()}/dashboard`);
      }
    }
  } else {
    redirect("/auth/login");
  }

  // If no user or redirection, render login page
  return null;
}