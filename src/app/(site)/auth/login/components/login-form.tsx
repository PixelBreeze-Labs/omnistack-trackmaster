// app/(auth)/login/page.tsx
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
    const router = useRouter()
    const [error, setError] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const result = await signIn("credentials", {
                email: e.currentTarget.email.value,
                password: e.currentTarget.password.value,
                redirect: false,
            })

            if (result?.error) {
                setError("Invalid credentials")
                return
            }

            if (result?.ok) {
                // Get user data after successful login
                const userResponse = await fetch('/api/auth/session')
                const sessionData = await userResponse.json()
                
                const user = sessionData.user
                const userRole = user?.role
                const clientType = user?.clientType
                
                // Redirect based on user role and client type
                if (userRole === "ADMIN") {
                    
                    if (clientType) {
                        const unifiedClientType = 'platform' // Adjust as needed
                        
                        if (clientType === 'SAAS') {
                            router.push(`/crm/${unifiedClientType.toLowerCase()}/staffluent-dashboard`)
                        } else if (clientType === 'BOOKING') {
                            router.push(`/crm/${unifiedClientType.toLowerCase()}/booking-dashboard`)
                        } else if (clientType === 'VENUEBOOST') {
                            router.push(`/crm/${unifiedClientType.toLowerCase()}/venueboost-dashboard`)
                        } else if (clientType === 'PIXELBREEZE') {
                            router.push(`/crm/${unifiedClientType.toLowerCase()}/pixelbreeze-dashboard`)
                        } else {
                            router.push(`/crm/${unifiedClientType.toLowerCase()}/dashboard`)
                        }
                    } else {
                        // Default fallback
                        router.push("/crm/platform/dashboard")
                    }
                } 
                
                router.refresh()
            }
        } catch (error) {
            setError("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4">
            <Card className="w-full max-w-[400px]">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="email@company.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}