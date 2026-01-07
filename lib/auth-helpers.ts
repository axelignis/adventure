/**
 * Helper functions for authentication
 */

/**
 * Check which authentication providers are configured
 */
export function getAvailableProviders() {
  return {
    email: !!process.env.RESEND_API_KEY,
    google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  };
}

/**
 * Check if any providers are configured
 */
export function hasAnyProvider() {
  const providers = getAvailableProviders();
  return providers.email || providers.google;
}
