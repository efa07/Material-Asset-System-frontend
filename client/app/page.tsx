'use client';

import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login');
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Redirecting...</span>
    </div>
  );
}
