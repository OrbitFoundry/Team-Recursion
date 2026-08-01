/**
 * Redirects to Google OAuth authentication
 */
export const redirectToGoogleAuth = (): void => {
  if (typeof window === 'undefined') return;
  
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const cleanUrl = rawUrl.replace(/\/+$/, '');
  const baseUrl = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  window.location.href = `${baseUrl}/auth/google`;
};

