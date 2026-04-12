import { Suspense } from 'react';
import DiscoverSearchPage from '@/components/discover/DiscoverSearchPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto min-h-screen max-w-[390px] bg-[#161620]" aria-hidden />}>
      <DiscoverSearchPage />
    </Suspense>
  );
}
