'use client';

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useAppStore } from "@/store/useAppStore";
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation";
import { getRoleDashboardPath } from "@/lib/navigation";
import type { UserRole, User } from "@/types";
import { useUser } from "@/hooks/useQueries";

export function AuthSync() {
  const { data: session, status } = useSession();
  const setAuth = useAuthStore((state) => state.setAuth);
  const loginApp = useAppStore((state) => state.login);
  const router = useRouter();
  const pathname = usePathname();

  const userEmail = session?.user?.email || (session?.accessToken ? (jwtDecode(session.accessToken) as any).email : undefined);
  const { data: dbUser } = useUser(userEmail);

  useEffect(() => {
    const isPublicRoute = pathname === '/login';

    if (status === 'unauthenticated' && !isPublicRoute) {
       signIn("keycloak");
       return;
    }

    if (status === 'authenticated' && session?.accessToken) {
        try {
            const decoded: any = jwtDecode(session.accessToken);
            
            const mapKeycloakRoleToUserRole = (r: string): UserRole | null => {
                const map: Record<string, UserRole> = {
                ADMIN: 'admin',
                STORE_MANAGER: 'store-manager',
                ASSET_MANAGER: 'asset-manager',
                TECHNICIAN: 'technician',
                EMPLOYEE: 'employee',
                AUDITOR: 'auditor',
                };
                return map[r] ?? null;
            };

            const rawRoles: string[] = decoded.realm_access?.roles || [];
            const mappedRoles = rawRoles.map((r) => mapKeycloakRoleToUserRole(r)).filter(Boolean) as string[];

            // Sync to Zustand
            setAuth(session.accessToken, rawRoles, decoded.preferred_username || 'User');

            const primaryRole = mappedRoles[0] as UserRole | undefined;
            if (primaryRole) {
                // If we have the DB user, prefer it (has correct database ID). 
                // Otherwise fallback to token data (ID is Keycloak ID).
                const userToSync: User = dbUser ? {
                    ...dbUser,
                    role: primaryRole, // Maintain role from token as authority
                } : {
                    id: decoded.sub || 'unknown',
                    email: decoded.email || '',
                    name: decoded.preferred_username || decoded.name || 'User',
                    role: primaryRole,
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString(),
                };

                loginApp(userToSync);

                // Redirect only if we are on the root page or login page
                // And prevent loop by checking if we are already on a dashboard
                if ((pathname === '/' || pathname === '/login') && !pathname.startsWith('/dashboard')) {
                    const dashboard = getRoleDashboardPath(primaryRole);
                    router.replace(dashboard);
                }
            }
        } catch (error) {
            console.error("Error syncing auth state", error);
        }
    }
  }, [session, status, setAuth, loginApp, router, pathname, dbUser]);

  return null;
}
