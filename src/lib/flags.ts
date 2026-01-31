/**
 * Feature flags for the application.
 * 
 * To enable legacy films writes, set in your .env.local:
 * NEXT_PUBLIC_LEGACY_FILMS_ENABLED=true
 */
export const LEGACY_FILMS_ENABLED = process.env.NEXT_PUBLIC_LEGACY_FILMS_ENABLED === 'true';
