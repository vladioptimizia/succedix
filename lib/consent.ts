export type ConsentState = {
  analytics: boolean;
  location: boolean;
  marketing: boolean;
  decided: boolean;
};

const CONSENT_KEY = 'succedix_consent';

export function getConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveConsent(state: ConsentState) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  document.cookie = `succedix_consent=${JSON.stringify(state)};path=/;max-age=31536000;SameSite=Lax`;
}

export function acceptAll(): ConsentState {
  const state = { analytics: true, location: true, marketing: true, decided: true };
  saveConsent(state);
  return state;
}

export function rejectAll(): ConsentState {
  const state = { analytics: false, location: false, marketing: false, decided: true };
  saveConsent(state);
  return state;
}
