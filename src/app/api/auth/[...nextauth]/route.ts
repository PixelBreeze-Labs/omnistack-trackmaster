// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { authPrisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

interface ExtendedUser extends User {
    role?: string;
    clientId?: string;
    clientType?: string;
    supabaseId: string;
}

export const authOptions: NextAuthOptions = {
    // Use the auth-specific Prisma client with primary read preference
    adapter: PrismaAdapter(authPrisma),
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "hello@example.com"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize(credentials): Promise<ExtendedUser | null> {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Missing credentials')
                }

                // Always read from primary for authentication
                const user = await authPrisma.user.findUnique({
                    where: {
                        email: credentials.email
                    },
                    include: {
                        client: {
                            select: {
                                type: true
                            }
                        }
                    }
                })

                if (!user || !user.password) {
                    throw new Error('User not found')
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password, 
                    user.password
                )

                if (!isPasswordValid) {
                    throw new Error('Invalid password')
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    clientId: user.clientId || undefined,
                    clientType: user.client?.type,
                    supabaseId: user.supabaseId,
                    image: null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger }: { token: JWT, user?: ExtendedUser, trigger?: string }): Promise<JWT> {
            if (user) {
                token.role = user.role as "ADMIN" | "SALES" | "MARKETING"
                token.id = user.id
                token.clientId = user.clientId
                token.clientType = user.clientType as "ECOMMERCE" | "SAAS" | "FOOD_DELIVERY" | "RETAIL" | "SERVICES" | "OTHER" | "BOOKING" | "PIXELBREEZE" | "VENUEBOOST" | "QYTETARET" | "STUDIO"
                token.supabaseId = user.supabaseId
            }
            
            // Force token refresh on session update
            if (trigger === 'update' && token.id) {
                // Read from primary for fresh user data
                const freshUser = await authPrisma.user.findUnique({
                    where: { id: token.id },
                    include: {
                        client: {
                            select: {
                                type: true
                            }
                        }
                    }
                });
                
                if (freshUser) {
                    token.clientId = freshUser.clientId || undefined;
                    token.clientType = freshUser.client?.type;
                    token.role = freshUser.role as "ADMIN" | "SALES" | "MARKETING";
                }
            }
            
            return token
        },
        async session({ session, token }: { session: Session, token: JWT }): Promise<Session> {
            if (token && session.user) {
                session.user.role = token.role
                session.user.id = token.id
                session.user.clientId = token.clientId
                session.user.clientType = token.clientType
                session.user.supabaseId = token.supabaseId
            }
            return session
        }
    },
    events: {
        async signIn({ user }) {
            await authPrisma.activity.create({
                data: {
                    type: 'CUSTOMER_PURCHASE',
                    description: `User ${user.email} signed in`,
                    userId: user.id,
                }
            })
        },
        async signOut({ token }) {
            // Optional cleanup operations on signout
            console.log(`User ${token?.id} signed out`);
        }
    },
    debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }