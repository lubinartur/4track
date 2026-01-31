'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTasteSeedCount } from '@/db/hooksEntries';

/**
 * Client component that gates the app until taste onboarding is completed.
 * Redirects to /onboarding/taste if taste seed count < 5.
 */
export default function OnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const tasteSeedCount = useTasteSeedCount();
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // If loading (count is undefined), wait
    if (tasteSeedCount === undefined || tasteSeedCount === null) {
      return;
    }

    // If count < 5 and not on onboarding page -> redirect to onboarding
    if (tasteSeedCount < 5) {
      if (pathname !== '/onboarding/taste') {
        router.replace('/onboarding/taste');
      }
      return;
    }

    // If count >= 5 and on onboarding page -> redirect to films
    if (tasteSeedCount >= 5 && pathname?.startsWith('/onboarding')) {
      router.replace('/films');
      return;
    }
  }, [tasteSeedCount, pathname, router, isClient]);

  // Show minimal splash while loading or if onboarding not completed
  if (!isClient || tasteSeedCount === undefined || tasteSeedCount === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-tertiary text-sm">Loading...</div>
      </div>
    );
  }

  // Don't render children if onboarding not completed (prevents flash)
  if (tasteSeedCount < 5 && pathname !== '/onboarding/taste') {
    return null;
  }

  return <>{children}</>;
}
