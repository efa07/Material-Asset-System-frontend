'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import keycloak from '@/lib/keycloak';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if ((keycloak as any).authenticated) {
      router.replace('/');
      return;
    }

    // Trigger Keycloak login UI (redirect)
    keycloak.login().catch((err) => console.error('Keycloak login failed', err));
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
        <h2 className="text-lg font-semibold">Redirecting to Keycloak...</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          If you are not redirected automatically,{' '}
          <button onClick={() => keycloak.login()} className="underline text-primary">
            click here
          </button>
          .
        </p>
      </div>
    </div>
  );
}
