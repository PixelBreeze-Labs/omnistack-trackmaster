import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  try {
    // Get the current user with client info
    const user = await getCurrentUser();

    // If no user, redirect to login
    if (!user) {
      return redirect("/auth/login");
    }

    const userRole = user.role;
    const clientType = user?.clientType || "";

    // Admin user handling
    if (userRole === "ADMIN") {
      // For SAAS client type, go to staffluent dashboard
      if (clientType === 'SAAS') {
        return redirect("/crm/platform/staffluent-dashboard");
      } 
      // For all other client types, go to regular dashboard
      else {
        return redirect("/crm/platform/dashboard");
      }
    } 
    // Non-admin users go to login
    else {
      return redirect("/auth/login");
    }
  } catch (error) {
    console.error("Error in home page redirection:", error);
    return redirect("/auth/login");
  }

  // This line will never be reached due to redirects,
  // but it's needed to satisfy TypeScript/React requirements
  return null;
}