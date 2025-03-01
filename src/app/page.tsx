import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Get session directly in this component - bypassing getCurrentUser()
  const session = await getServerSession(authOptions);
  
  // If no session at all, go to login
  if (!session?.user?.id) {
    return redirect("/auth/login");
  }
  
  // Get user data directly 
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id
    },
    include: {
      client: {
        select: {
          name: true,
          type: true,
          status: true
        }
      }
    }
  });
  
  // If user not found in database, go to login
  if (!user) {
    return redirect("/auth/login");
  }
  
  // Check role and client type - get client type from client object
  const userRole = user.role;
  const clientType = user.client?.type || "";
  
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
}