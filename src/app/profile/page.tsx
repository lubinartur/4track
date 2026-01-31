'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { purgeLocalItems } from '@/db/migrations/purgeLocalItems';

export default function ProfilePage() {
  const router = useRouter();
  const [purging, setPurging] = useState(false);
  const [purgeResult, setPurgeResult] = useState<{
    entriesDeleted: number;
    catalogDeleted: number;
    tasteSeedsDeleted: number;
    legacyFilmsDeleted: number;
  } | null>(null);

  const isDev = process.env.NODE_ENV !== 'production';

  const handlePurgeLocalItems = async () => {
    if (!confirm('Are you sure you want to purge all local items? This cannot be undone.')) {
      return;
    }

    setPurging(true);
    setPurgeResult(null);

    try {
      const result = await purgeLocalItems();
      setPurgeResult(result);
      // Refresh after a short delay to show results
      setTimeout(() => {
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error('Error purging local items:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="px-6 pt-safe-area-inset-top pb-6">
      <div className="mb-8 pt-8">
        <h1 className="mb-2 text-3xl font-semibold text-primary">Profile</h1>
        <p className="text-secondary">Your profile settings</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#141420] p-4">
        <div className="text-secondary text-sm">Profile content placeholder</div>
      </div>

      {isDev && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#141420] p-4">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-[0.08em] text-primary">
            Dev Tools
          </h2>
          <button
            onClick={handlePurgeLocalItems}
            disabled={purging}
            className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2 text-[14px] font-medium text-secondary transition-colors hover:bg-white/[0.08] hover:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {purging ? 'Purging...' : 'Purge local items'}
          </button>
          {purgeResult && (
            <div className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <pre className="text-[11px] text-tertiary font-mono whitespace-pre-wrap">
                {JSON.stringify(purgeResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
