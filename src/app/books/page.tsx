'use client';

import BooksHeader from '@/components/books/BooksHeader';
import CurrentlyReadingCard from '@/components/books/CurrentlyReadingCard';
import MetricCard from '@/components/shared/MetricCard';
import RecentBookItem from '@/components/books/RecentBookItem';
import { useBookStats, useReadingBook, useRecentRead } from '@/db/hooks';

export default function BooksPage() {
  const { stats, loading: statsLoading } = useBookStats();
  const { book: readingBook, loading: readingLoading } = useReadingBook();
  const { books: recentBooks, loading: recentLoading } = useRecentRead();
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Cinematic vignette background */}
      <div className="fixed inset-0 bg-[#0b0b0f]">
        {/* Radial vignette - edges darker */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(11, 11, 15, 0) 0%, rgba(11, 11, 15, 0.3) 40%, rgba(5, 5, 8, 0.8) 100%)'
          }}
        />
        {/* Subtle top glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a20]/20 via-transparent to-transparent" />
        {/* Optional noise-like effect */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            backgroundSize: '100% 4px'
          }}
        />
      </div>

      {/* Content container with device stage feeling */}
      <div className="relative mx-auto max-w-md min-h-screen px-4 pt-safe-area-inset-top pb-32">
        <div className="relative rounded-[36px] bg-[#0b0b0f]/30 p-6 pt-8 shadow-[inset_0_0_80px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-[0.5px]">
          <BooksHeader />

          {/* Metrics */}
          <div className="mb-6 px-8">
            <div className="grid grid-cols-2 gap-6 items-stretch w-full max-w-[860px] mx-auto">
              {/* Custom MetricCard for "BOOKS THIS YEAR" with reduced tracking to prevent truncation */}
              <div className="relative h-[96px] rounded-[28px] border border-white/5 bg-[#141420]/60 px-5 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08),inset_0_-1px_0_0_rgba(0,0,0,0.2)] backdrop-blur-xl">
                <div className="absolute top-[14px] left-5 right-5 whitespace-nowrap overflow-hidden text-ellipsis text-[11px] font-medium uppercase tracking-[0.18em] text-white/45">
                  BOOKS THIS YEAR
                </div>
                <div className="absolute left-5 right-5 top-[44px] text-center text-[36px] leading-none font-light tracking-tight text-[#ff3d00]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                  {statsLoading ? '...' : stats.booksThisYear.toString()}
                </div>
              </div>
              <MetricCard label="PACE" value={statsLoading ? '...' : stats.pace.toUpperCase()} />
            </div>
          </div>

          {/* Currently Reading */}
          <div className="mb-6">
            {readingLoading ? (
              <div className="rounded-[28px] border border-white/5 bg-[#141420]/50 p-6 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
                <div className="text-tertiary text-sm">Loading...</div>
              </div>
            ) : readingBook ? (
              <CurrentlyReadingCard
                title={readingBook.title}
                author={readingBook.author}
              />
            ) : (
              <div className="rounded-[28px] border border-white/5 bg-[#141420]/50 p-6 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
                <div className="text-tertiary text-sm">No book currently being read</div>
              </div>
            )}
          </div>

          {/* Recently Read */}
          <div>
            <h2 className="mb-4 text-[14px] font-medium uppercase tracking-[0.08em] text-primary">
              Recently read
            </h2>
            {recentLoading ? (
              <div className="text-tertiary text-sm">Loading...</div>
            ) : recentBooks.length > 0 ? (
              <div className="space-y-3">
                {recentBooks.map((book) => (
                  <RecentBookItem
                    key={book.id}
                    title={book.title}
                    status={book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                    date={book.dateStr}
                  />
                ))}
              </div>
            ) : (
              <div className="text-tertiary text-sm">No recent books</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
