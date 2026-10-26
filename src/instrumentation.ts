/**
 * Runs once when the server starts.
 *
 * Used for corrections to saved content that have to happen on the server,
 * where the database is reachable. Not awaited: a slow database must not hold
 * the site back from serving, and the fixes swallow their own errors.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  const { applyContentFixes } = await import('./lib/content/fixes')
  void applyContentFixes()
}
