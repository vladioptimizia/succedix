// Google Analytics 4 + Meta Pixel event helpers

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', name, params);
  window.fbq?.('trackCustom', name, params);
}

export function trackPageView(url: string) {
  if (typeof window === 'undefined') return;
  window.gtag?.('config', process.env.NEXT_PUBLIC_GA_ID, { page_path: url });
}

export function trackSwipe(action: 'like' | 'pass' | 'save', businessId: string) {
  trackEvent('swipe', { action, business_id: businessId });
  if (action === 'like' || action === 'save') {
    window.fbq?.('track', 'AddToWishlist', { content_ids: [businessId] });
  }
}

export function trackSignup(userType: 'buyer' | 'seller') {
  trackEvent('sign_up', { user_type: userType });
  window.fbq?.('track', 'CompleteRegistration', { content_name: userType });
}

export function trackOnboardingStart(userType: 'buyer' | 'seller') {
  trackEvent('onboarding_start', { user_type: userType });
  window.fbq?.('track', 'InitiateCheckout', { content_name: userType });
}
