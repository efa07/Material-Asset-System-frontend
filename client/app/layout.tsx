"use client"
import React from 'react'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import keycloak from '@/lib/keycloak';
import { logoutAndClear } from '@/lib/keycloak';
import { useAuthStore } from '@/store/auth.store';
import { jwtDecode } from 'jwt-decode';
import { useAppStore } from '@/store/useAppStore';
import { getRoleDashboardPath } from '@/lib/navigation';
import type { UserRole } from '@/types';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

 const metadata: Metadata = {
  title: 'INSA Asset Management System',
  description: 'Enterprise Material & Asset Management System for government security organization',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const setAuth = useAuthStore((state) => state.setAuth);
  const loginApp = useAppStore((state) => state.login);
  const router = useRouter();

  // Map Keycloak role strings (e.g. ADMIN) to app UserRole (e.g. 'admin')
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

  useEffect(() => {
    let refreshInterval: number | undefined;

    keycloak
      .init({
        onLoad: 'login-required',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        if (!authenticated || !keycloak.token) return;

        const decoded: any = jwtDecode(keycloak.token);

        const rawRoles: string[] = decoded.realm_access?.roles || [];
        const mappedRoles = rawRoles.map((r) => mapKeycloakRoleToUserRole(r)).filter(Boolean) as string[];

        // Persist token and raw roles in the auth store
        setAuth(keycloak.token, rawRoles, decoded.preferred_username);

        // Construct a minimal app User object and store it in the app store
        const primaryRole = mappedRoles[0] as UserRole | undefined;
        if (primaryRole) {
          loginApp({
            id: decoded.sub || decoded.sid || decoded.user_id || 'unknown',
            email: decoded.email || '',
            name: decoded.preferred_username || decoded.name || decoded.email || 'User',
            role: primaryRole,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          });

          // Redirect to role-specific dashboard
          const dashboard = getRoleDashboardPath(primaryRole);
          router.push(dashboard);
        }

        // Schedule token refresh every 60s. If token is close to expiry (<30s), updateToken will attempt refresh.
        refreshInterval = window.setInterval(async () => {
          try {
            const refreshed = await keycloak.updateToken(30);
            if (refreshed && keycloak.token) {
              const decodedRef: any = jwtDecode(keycloak.token);
              setAuth(keycloak.token, decodedRef.realm_access?.roles || [], decodedRef.preferred_username);
            }
          } catch (err) {
            console.warn('Failed to refresh Keycloak token, logging out', err);
            // clear client state and redirect to login
            await logoutAndClear();
          }
        }, 60_000) as unknown as number;
      });

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, []);
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
