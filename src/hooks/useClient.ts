// hooks/useClient.ts
import { useSession } from 'next-auth/react';

interface User {
 clientId: string; 
 name: string;
 role: string;
}

export const useClient = () => {
 const { data: session } = useSession();
 const user = session?.user as User;
 
 return {
   clientId: user?.clientId || '',
   name: user?.name,
   role: user?.role,
 };
};