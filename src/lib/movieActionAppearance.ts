/** Shared motion — 4track action buttons (150–180ms, ease-out, subtle press). */
export const movieActionTransition =
  'transition-[transform,background-color,border-color,color,opacity,box-shadow] duration-[170ms] ease-out';

export const movieActionPress = 'active:scale-[0.97] enabled:active:scale-[0.97]';

export const movieActionFocusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/35';

export function queueButtonLabel(inQueue: boolean): 'In Queue' | 'Add to Queue' {
  return inQueue ? 'In Queue' : 'Add to Queue';
}

/** Watched state always reads “Watched” (completed), never “Rated”, for label consistency. */
export function watchedButtonLabel(watched: boolean): 'Watched' | 'Mark as Watched' {
  return watched ? 'Watched' : 'Mark as Watched';
}
