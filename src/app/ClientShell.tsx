'use client';

import OnboardingGate from '@/components/onboarding/OnboardingGate';
import BottomNav from '@/components/navigation/BottomNav';
import ChatOverlay from '@/components/chat/ChatOverlay';
import AddSheet from '@/components/add/AddSheet';

/**
 * Client-side shell that wraps app content with onboarding gate and client-only components.
 */
export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingGate>
      <div className="mx-auto max-w-md min-h-screen">
        {children}
      </div>
      <BottomNav />
      <ChatOverlay />
      <AddSheet />
    </OnboardingGate>
  );
}
