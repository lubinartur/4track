/**
 * Canonical app background — stable ambient system (Figma: “Backgroud System”, 91:411).
 * Implementation: `public/ambient-background-figma.svg` (#161620 base + #FF5B00 rim lights).
 *
 * Policy: do not tweak glow/blur/SVG values unless fixing a clear visual defect; avoid
 * one-off CSS gradients on screens that should match this look.
 *
 * Usage: render once per full-screen shell, first child inside the page `relative` root,
 * with content at z-[1]+. Discover and Item use this layer only — no alternate backgrounds.
 */
export default function AppBackgroundLighting() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#161620]" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element -- static design-system SVG from Figma */}
      <img
        src="/ambient-background-figma.svg"
        alt=""
        className="absolute inset-0 h-full min-h-full w-full object-cover object-center"
        decoding="async"
      />
    </div>
  );
}
