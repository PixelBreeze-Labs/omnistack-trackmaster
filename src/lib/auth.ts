// lib/auth.ts
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  
  if (!session?.user?.id) {
    return null
  }

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
  })

  return user
}