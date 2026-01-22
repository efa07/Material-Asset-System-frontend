'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      // Let the AuthSync component handle the redirection based on roles
      // Or simply redirect to home which will then redirect to dashboard
      // router.replace('/'); 
      return; 
    }

    if (status === 'unauthenticated') {
        signIn('keycloak').catch((err) => console.error('NextAuth login failed', err));
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
        <h2 className="text-lg font-semibold">Redirecting to Login...</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          If you are not redirected automatically,{' '}
          <button onClick={() => signIn('keycloak')} className="underline text-primary">
            click here
          </button>
          .
        </p>
      </div>
    </div>
  );
}
