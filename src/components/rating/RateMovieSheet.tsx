'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import ItemMetaRow from '@/components/item/ItemMetaRow';
import type { LibraryMovieInput } from '@/lib/libraryMovieInput';
import { TASTE_TAG_OPTIONS } from '@/lib/tasteTagOptions';
import { useLibraryStore } from '@/store/libraryStore';
import StarRatingSelector from './StarRatingSelector';
import TagSelector from './TagSelector';

type RateMovieSheetProps = {
  open: boolean;
  target: LibraryMovieInput | null;
  onClose: () => void;
};

export default function RateMovieSheet({ open, target, onClose }: RateMovieSheetProps) {
  const titleId = useId();
  const saveRatedWatched = useLibraryStore((s) => s.saveRatedWatched);

  const [entered, setEntered] = useState(false);
  const [stars, setStars] = useState(0);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (!open || !target) {
      setEntered(false);
      return;
    }
    const entry = useLibraryStore.getState().entriesByKey[target.key];
    const r = entry?.userRating;
    setStars(typeof r === 'number' && r >= 1 && r <= 5 ? r : 0);
    const allowed = new Set<string>([...TASTE_TAG_OPTIONS]);
    setTags((entry?.tasteTags ?? []).filter((t) => allowed.has(t)));
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    return () => cancelAnimationFrame(id);
  }, [open, target]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const toggleTag = useCallback((tag: string) => {
    setTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= 3) return prev;
      return [...prev, tag];
    });
  }, []);

  const handleSave = useCallback(() => {
    if (!target || stars < 1 || stars > 5) return;
    saveRatedWatched(target, { userRating: stars, tasteTags: tags });
    onClose();
  }, [target, stars, tags, saveRatedWatched, onClose]);

  if (typeof document === 'undefined' || !open || !target) return null;

  const canSave = stars >= 1 && stars <= 5;

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-[100] flex items-end justify-center"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close"
        className={[
          'pointer-events-auto absolute inset-0 z-0 bg-[rgba(22,22,32,0.4)] backdrop-blur-[2px] transition-opacity duration-300 ease-out',
          entered ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[
          'pointer-events-auto relative z-[1] flex max-h-[90vh] w-full max-w-[390px] flex-col rounded-t-[28px] bg-[#101018] shadow-[0px_-20px_60px_0px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out',
          entered ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
      >
        <div className="flex max-h-[90vh] flex-col overflow-y-auto overscroll-contain px-4 pb-10 pt-3">
          <div className="mx-auto mb-4 h-1 w-[70px] shrink-0 rounded-[40px] bg-[rgba(255,255,255,0.1)]" aria-hidden />

          <div className="flex flex-col items-center">
            <div
              className={[
                'relative h-[120px] w-20 overflow-hidden rounded-[20px]',
                'shadow-[0px_8px_20px_0px_rgba(0,0,0,0.35)]',
              ].join(' ')}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={target.posterUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <h2
              id={titleId}
              className="mt-4 text-center text-[32px] font-bold leading-none tracking-normal text-white"
            >
              {target.title}
            </h2>

            <div className="mt-2">
              <ItemMetaRow
                rating={target.rating}
                year={target.year}
                genresLabel={target.genresLabel}
                className="justify-center"
              />
            </div>

            <div className="mt-6 w-full">
              <StarRatingSelector value={stars} onChange={setStars} />
            </div>

            <p className="mt-6 text-center text-[16px] font-medium leading-normal text-white">
              Why did it fit your taste?
            </p>
            <p className="mt-1 text-center text-[14px] leading-[20px] text-[rgba(255,255,255,0.6)]">
              <span>Select </span>
              <span className="text-[#ff5b00]">up to 3 tags</span>
              <span> to refine your taste profile</span>
            </p>

            <div className="mt-4 w-full flex justify-center">
              <TagSelector
                options={TASTE_TAG_OPTIONS}
                selected={tags}
                onToggle={toggleTag}
              />
            </div>

            <button
              type="button"
              disabled={!canSave}
              onClick={handleSave}
              className="mt-8 inline-flex h-11 w-full max-w-[358px] shrink-0 items-center justify-center rounded-[12px] bg-[#ff5b00] px-4 py-2.5 text-[12px] font-normal leading-none text-white transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/45 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save rating
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
