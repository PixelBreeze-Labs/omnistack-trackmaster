import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  // Get the current user with client info
  const user = await getCurrentUser();

  if (user) {
    // Check user role and client type
    const userRole = user.role;
    const clientType = user.client?.type;

    // Replicate middleware logic for redirection
    if (userRole === "ADMIN") {
      redirect("/crm/ecommerce/dashboard");
    } else if (clientType) {
      redirect(`/crm/${clientType.toLowerCase()}/dashboard`);
    }
  }

  // If no user or redirection, render login page
  return null;
}