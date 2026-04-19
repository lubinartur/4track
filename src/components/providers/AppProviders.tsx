'use client';

import { RatingSheetProvider } from '@/components/rating/RatingSheetProvider';
import OnboardingGate from '@/components/onboarding/OnboardingGate';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <RatingSheetProvider>
      <OnboardingGate />
      {children}
    </RatingSheetProvider>
  );
}
