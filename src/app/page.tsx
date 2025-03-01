import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  // Get the current user with client info
  const user = await getCurrentUser();

  if (user) {
    // Check user role and client type
    const userRole = user.role;
    const clientType = user?.clientType;

    if (userRole === "ADMIN") {
                    
      if (clientType) {
          const unifiedClientType = 'platform' // Adjust as needed
          
          if (clientType === 'SAAS') {
            redirect(`/crm/${unifiedClientType.toLowerCase()}/staffluent-dashboard`);
          } else {
            redirect("/crm/platform/dashboard");
          }
      } else {
          // Default fallback
          redirect("/crm/platform/dashboard");
      }
  } else {
    redirect("/auth/login");
  }
  } else {
    redirect("/auth/login");
  }

  // If no user or redirection, render login page
  return null;
}