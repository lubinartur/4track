import { NextResponse } from 'next/server';

/**
 * Dev-only route to purge local items.
 * IMPORTANT: Guarded with NODE_ENV check - returns 404 in production.
 * 
 * Note: This route cannot directly access Dexie (client-side database).
 * The purge function must be called from client-side code.
 * For a quick test, you can call it from browser console:
 * 
 * import { purgeLocalItems } from '@/db/migrations/purgeLocalItems';
 * await purgeLocalItems();
 */
export async function GET() {
  // Guard: only available in non-production
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.json({
    message: 'This endpoint cannot directly access Dexie (client-side database).',
    instruction: 'Call purgeLocalItems() from client-side code or browser console.',
    example: `
      import { purgeLocalItems } from '@/db/migrations/purgeLocalItems';
      const result = await purgeLocalItems();
      console.log(result);
    `,
  });
}
