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
    // Handle different client types
    switch(clientType) {
      case 'SAAS':
        return redirect("/crm/platform/staffluent-dashboard");
      case 'BOOKING':
        return redirect("/crm/platform/booking-dashboard");
      case 'VENUEBOOST':
          return redirect("/crm/platform/venueboost-dashboard");
      case 'QYTETARET':
          return redirect("/crm/platform/qytetaret-dashboard");
      case 'STUDIO':
          return redirect("/crm/platform/studio-dashboard");
      case 'PIXELBREEZE':
          return redirect("/crm/platform/pixelbreeze-dashboard");
      default:
        return redirect("/crm/platform/dashboard");
    }
  } 
  // Non-admin users go to login
  else {
    return redirect("/auth/login");
  }
}