'use client';

import { JSX, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HomePage(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard immediately
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="text-white mt-4">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}