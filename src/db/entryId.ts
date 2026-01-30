import type { Source, Domain } from './db';

/**
 * Creates a deterministic entry ID in the format: `${source}:${domain}:${sourceId}`
 */
export function makeEntryId(source: Source, domain: Domain, sourceId: string | number): string {
  return `${source}:${domain}:${sourceId}`;
}
