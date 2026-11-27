/**
 * Feature switches. Vouching is built but hidden for now: set NEXT_PUBLIC_VOUCHES_ENABLED=true (and redeploy) to bring it back.
 * While off, the nav link, the /vouch page, vouch buttons and badges, and vouches in the "What's new" feed all disappear.
 * Existing vouch data is kept untouched.
 */
export const VOUCHES_ENABLED = process.env.NEXT_PUBLIC_VOUCHES_ENABLED === "true";
