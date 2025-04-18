// types/next-auth.d.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface User {
        id: string;
        role: "ADMIN" | "SALES" | "MARKETING";
        clientId?: string;
        clientType?: "ECOMMERCE" | "SAAS" | "FOOD_DELIVERY" | "RETAIL" | "SERVICES" | "OTHER" | "BOOKING" | "PIXELBREEZE" | "VENUEBOOST" | "QYTETARET" | "STUDIO";
        supabaseId: string;
    }

    interface Session {
        user: {
            id: string;
            role: "ADMIN" | "SALES" | "MARKETING";
            clientId?: string;
            clientType?: "ECOMMERCE" | "SAAS" | "FOOD_DELIVERY" | "RETAIL" | "SERVICES" | "OTHER" | "BOOKING" | "PIXELBREEZE" | "VENUEBOOST" | "QYTETARET" | "STUDIO";
            supabaseId: string;
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: "ADMIN" | "SALES" | "MARKETING";
        clientId?: string;
        clientType?: "ECOMMERCE" | "SAAS" | "FOOD_DELIVERY" | "RETAIL" | "SERVICES" | "OTHER" | "BOOKING" | "PIXELBREEZE" | "VENUEBOOST" | "QYTETARET" | "STUDIO";
        supabaseId: string;
    }
}