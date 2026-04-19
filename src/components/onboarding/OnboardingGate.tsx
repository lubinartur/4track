'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/store/onboardingStore';

const ONBOARDING_PREFIX = '/onboarding';

function isProtectedPath(pathname: string): boolean {
  if (pathname === '/') return true;
  if (pathname.startsWith('/discover')) return true;
  if (pathname.startsWith('/library')) return true;
  if (pathname.startsWith('/item/')) return true;
  return false;
}

export default function OnboardingGate() {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const hasCompleted = useOnboardingStore((s) => s.hasCompletedOnboarding);

  useEffect(() => {
    if (!pathname) return;

    // If completed, keep users out of onboarding routes.
    if (hasCompleted && pathname.startsWith(ONBOARDING_PREFIX)) {
      router.replace('/discover');
      return;
    }

    // If not completed, gate main app entry points.
    if (!hasCompleted && isProtectedPath(pathname) && !pathname.startsWith(ONBOARDING_PREFIX)) {
      router.replace('/onboarding');
    }
  }, [hasCompleted, pathname, router]);

  return null;
}

