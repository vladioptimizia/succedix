import { Canton } from '@/lib/types';

// A API Nominatim é chamada com Accept-Language: en, pelo que 'address.state'
// vem tipicamente em inglês — mas incluímos também variantes DE/FR/IT por
// segurança, caso a API devolva o nome local para algum cantão.
const CANTON_MAP: Record<string, Canton> = {
  'Aargau': 'AG',
  'Appenzell Innerrhoden': 'AI', 'Appenzell Inner-Rhoden': 'AI',
  'Appenzell Ausserrhoden': 'AR', 'Appenzell Outer-Rhoden': 'AR',
  'Bern': 'BE', 'Berne': 'BE',
  'Basel-Landschaft': 'BL', 'Basel-Country': 'BL',
  'Basel-Stadt': 'BS', 'Basel-City': 'BS',
  'Fribourg': 'FR', 'Freiburg': 'FR',
  'Geneva': 'GE', 'Genève': 'GE', 'Genf': 'GE',
  'Glarus': 'GL',
  'Graubünden': 'GR', 'Grisons': 'GR', 'Grigioni': 'GR',
  'Jura': 'JU',
  'Lucerne': 'LU', 'Luzern': 'LU',
  'Neuchâtel': 'NE', 'Neuenburg': 'NE',
  'Nidwalden': 'NW',
  'Obwalden': 'OW',
  'St. Gallen': 'SG', 'St Gallen': 'SG', 'Saint Gallen': 'SG',
  'Schaffhausen': 'SH',
  'Solothurn': 'SO',
  'Schwyz': 'SZ',
  'Thurgau': 'TG',
  'Ticino': 'TI',
  'Uri': 'UR',
  'Vaud': 'VD',
  'Valais': 'VS', 'Wallis': 'VS',
  'Zug': 'ZG',
  'Zürich': 'ZH', 'Zurich': 'ZH',
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
