// src/middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isCRMRoute = req.nextUrl.pathname.startsWith('/crm')
    
    if (isCRMRoute) {
      // Get the client type from the URL
      const pathParts = req.nextUrl.pathname.split('/')
      const clientTypeIndex = pathParts.indexOf('crm') + 1
      const requestedClientType = pathParts[clientTypeIndex]

      // Check if user has access to the requested client type
      if (!["ADMIN", "SALES", "MARKETING"].includes(token?.role as string)) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
      }

      // For non-admin users, verify they can access the requested client type
      if (token?.role !== "ADMIN" && token?.clientType && token.clientType.toLowerCase() !== requestedClientType) {
        // Redirect to their assigned client type
        return NextResponse.redirect(
          new URL(`/crm/${token.clientType.toLowerCase()}/dashboard`, req.url)
        )
      }

      // If no client type in URL, redirect based on role/client type
      if (!requestedClientType) {
        if (token?.role === "ADMIN") {
          return NextResponse.redirect(new URL("/crm/ecommerce/dashboard", req.url))
        } else if (token?.clientType) {
          return NextResponse.redirect(
            new URL(`/crm/${token.clientType.toLowerCase()}/dashboard`, req.url)
          )
        }
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ["/crm/:path*"]
}