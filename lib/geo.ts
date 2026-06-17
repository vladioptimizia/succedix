import { Canton } from '@/lib/types';

const CANTON_MAP: Record<string, Canton> = {
  'Zürich': 'ZH',
  'Zurich': 'ZH',
  'Bern': 'BE',
  'Berne': 'BE',
  'Aargau': 'AG',
  'Zug': 'ZG',
  'Vaud': 'VD',
  'Genève': 'GE',
  'Geneva': 'GE',
  'Ticino': 'TI',
};

async function getUserCanton(): Promise<Canton | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const state = data?.address?.state as string | undefined;
          if (state) {
            const canton = CANTON_MAP[state] ?? 'outro';
            resolve(canton as Canton);
          } else {
            resolve('outro');
          }
        } catch {
          resolve(null);
        }
      },
      () => resolve(null)
    );
  });
}

export async function requestLocationPermission(): Promise<Canton | null> {
  try {
    return await getUserCanton();
  } catch {
    return null;
  }
}
