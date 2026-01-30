/**
 * Creates a stable, deterministic source ID from a title and optional year.
 * Format: `local-${slug}-${year?}-${hash}`
 */
export function makeLocalSourceIdFromTitle(title: string, year?: number): string {
  // Create slug: lowercase, trim, replace spaces with '-', remove non-alphanum/-
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Simple djb2 hash for collision avoidance
  let hash = 5381;
  const str = `${slug}${year || ''}`;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  const hashStr = Math.abs(hash).toString(36).substring(0, 6);

  // Build sourceId
  const parts = ['local', slug];
  if (year) {
    parts.push(String(year));
  }
  parts.push(hashStr);

  return parts.join('-');
}
