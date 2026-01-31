'use client';

import { useState } from 'react';
import { purgeLocalItems } from '@/db/migrations/purgeLocalItems';

export default function PurgeLocalPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    entriesDeleted: number;
    catalogDeleted: number;
    tasteSeedsDeleted: number;
    legacyFilmsDeleted: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurge = async () => {
    if (!confirm('Are you sure you want to purge all local items? This cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const purgeResult = await purgeLocalItems();
      setResult(purgeResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Purge Local Items</h1>
      <p className="mb-6 text-gray-600">
        This will delete all manually-added "local" items from the new data model.
        <br />
        Definition: Entry.id contains ":local-" OR CatalogItem.sourceId startsWith("local-")
      </p>

      <button
        onClick={handlePurge}
        disabled={loading}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Purging...' : 'Purge Local Items'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <h2 className="font-bold mb-2">Purge Complete</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Entries deleted: {result.entriesDeleted}</li>
            <li>Catalog items deleted: {result.catalogDeleted}</li>
            <li>Taste seeds deleted: {result.tasteSeedsDeleted}</li>
            <li>Legacy films deleted: {result.legacyFilmsDeleted}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
