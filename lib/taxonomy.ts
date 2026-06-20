// Fonte única de verdade para a taxonomia de Sector e Cantão usada em toda a Succedix:
// formulários de onboarding, filtros de discover/matches, scraping (guessSector/guessCanton)
// e validação de API (zod enums). Qualquer adição de sector/cantão deve ser feita APENAS aqui
// e depois propagada (os ficheiros que a usam importam destas constantes, não duplicam listas).

export const SECTOR_VALUES = [
  'cafe',
  'restaurante',
  'hotelaria',
  'varejo',
  'grossista',
  'servicos',
  'saude',
  'beleza',
  'construcao',
  'industria',
  'tecnologia',
  'logistica',
  'imobiliario',
  'alimentar',
  'automotivo',
  'agricultura',
  'financeiro',
  'educacao',
  'energia',
  'outro',
] as const

export type SectorValue = (typeof SECTOR_VALUES)[number]

export const SECTOR_LABELS_PT: Record<SectorValue, string> = {
  cafe: 'Café',
  restaurante: 'Restaurante',
  hotelaria: 'Hotelaria & Entretenimento',
  varejo: 'Comércio / Retalho',
  grossista: 'Comércio por Grosso',
  servicos: 'Serviços',
  saude: 'Saúde',
  beleza: 'Beleza & Bem-estar',
  construcao: 'Construção',
  industria: 'Indústria',
  tecnologia: 'Tecnologia / IT',
  logistica: 'Logística & Transportes',
  imobiliario: 'Imobiliário',
  alimentar: 'Alimentar',
  automotivo: 'Automóvel',
  agricultura: 'Agricultura',
  financeiro: 'Financeiro & Seguros',
  educacao: 'Educação & Formação',
  energia: 'Energia & Ambiente',
  outro: 'Outro',
}

export const SECTOR_LABELS_DE: Record<SectorValue, string> = {
  cafe: 'Café',
  restaurante: 'Restaurant',
  hotelaria: 'Gastgewerbe & Unterhaltung',
  varejo: 'Einzelhandel',
  grossista: 'Grosshandel',
  servicos: 'Dienstleistungen',
  saude: 'Gesundheit',
  beleza: 'Beauty & Wellness',
  construcao: 'Bauwesen',
  industria: 'Industrie',
  tecnologia: 'IT & Technologie',
  logistica: 'Logistik & Transport',
  imobiliario: 'Immobilien',
  alimentar: 'Lebensmittel',
  automotivo: 'Autoindustrie',
  agricultura: 'Landwirtschaft',
  financeiro: 'Finanzen & Versicherung',
  educacao: 'Bildung & Ausbildung',
  energia: 'Energie & Umwelt',
  outro: 'Sonstiges',
}

export const SECTOR_LABELS_EN: Record<SectorValue, string> = {
  cafe: 'Café',
  restaurante: 'Restaurant',
  hotelaria: 'Hospitality & Entertainment',
  varejo: 'Retail',
  grossista: 'Wholesale',
  servicos: 'Services',
  saude: 'Healthcare',
  beleza: 'Beauty & Wellness',
  construcao: 'Construction',
  industria: 'Industry & Manufacturing',
  tecnologia: 'IT & Technology',
  logistica: 'Logistics & Transport',
  imobiliario: 'Real Estate',
  alimentar: 'Food',
  automotivo: 'Automotive',
  agricultura: 'Agriculture',
  financeiro: 'Finance & Insurance',
  educacao: 'Education & Training',
  energia: 'Energy & Environment',
  outro: 'Other',
}

export const SECTOR_ICONS: Record<SectorValue, string> = {
  cafe: '☕',
  restaurante: '🍽️',
  hotelaria: '🎉',
  varejo: '🛍️',
  grossista: '📦',
  servicos: '⚙️',
  saude: '🏥',
  beleza: '💆',
  construcao: '🏗️',
  industria: '🏭',
  tecnologia: '💻',
  logistica: '🚚',
  imobiliario: '🏢',
  alimentar: '🍞',
  automotivo: '🚗',
  agricultura: '🌾',
  financeiro: '💰',
  educacao: '🎓',
  energia: '🔋',
  outro: '🏪',
}

export const CANTON_VALUES = [
  'AG', 'AI', 'AR', 'BE', 'BL', 'BS', 'FR', 'GE', 'GL', 'GR', 'JU', 'LU', 'NE',
  'NW', 'OW', 'SG', 'SH', 'SO', 'SZ', 'TG', 'TI', 'UR', 'VD', 'VS', 'ZG', 'ZH',
  'outro',
] as const

export type CantonValue = (typeof CANTON_VALUES)[number]

export const CANTON_LABELS_DE: Record<CantonValue, string> = {
  AG: 'Aargau', AI: 'Appenzell Innerrhoden', AR: 'Appenzell Ausserrhoden', BE: 'Bern',
  BL: 'Basel-Landschaft', BS: 'Basel-Stadt', FR: 'Freiburg', GE: 'Genf', GL: 'Glarus',
  GR: 'Graubünden', JU: 'Jura', LU: 'Luzern', NE: 'Neuenburg', NW: 'Nidwalden',
  OW: 'Obwalden', SG: 'St. Gallen', SH: 'Schaffhausen', SO: 'Solothurn', SZ: 'Schwyz',
  TG: 'Thurgau', TI: 'Tessin', UR: 'Uri', VD: 'Waadt', VS: 'Wallis', ZG: 'Zug',
  ZH: 'Zürich', outro: 'Andere',
}

export const CANTON_LABELS_EN: Record<CantonValue, string> = {
  AG: 'Aargau', AI: 'Appenzell Innerrhoden', AR: 'Appenzell Ausserrhoden', BE: 'Bern',
  BL: 'Basel-Landschaft', BS: 'Basel-Stadt', FR: 'Fribourg', GE: 'Geneva', GL: 'Glarus',
  GR: 'Graubünden', JU: 'Jura', LU: 'Lucerne', NE: 'Neuchâtel', NW: 'Nidwalden',
  OW: 'Obwalden', SG: 'St. Gallen', SH: 'Schaffhausen', SO: 'Solothurn', SZ: 'Schwyz',
  TG: 'Thurgau', TI: 'Ticino', UR: 'Uri', VD: 'Vaud', VS: 'Valais', ZG: 'Zug',
  ZH: 'Zürich', outro: 'Other',
}

/* ─────────────────────────── guessSector / guessCanton ───────────────────────────
 * Usadas pelo pipeline de scraping (app/api/n8n/import) para classificar negócios
 * importados a partir de texto livre (categoria/branche do site de origem, ou
 * nome+descrição como fallback). Taxonomia de "Branche" alinhada com a usada por
 * sites de M&A suíços (ex. companymarket.ch tem 18 categorias "Branche" oficiais).
 * Todas as chaves usam fronteira de palavra (\b) para evitar falsos positivos de
 * substring (ex.: "ag" dentro de "Lage" ou "Tagelswangen").
 */

function matchesKeyword(text: string, keyword: string): boolean {
  // Fronteira de palavra; escapa caracteres especiais de regex no keyword.
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${escaped}\\b`, 'i').test(text)
}

const SECTOR_KEYWORDS: Record<SectorValue, string[]> = {
  cafe: ['café', 'cafe', 'kaffee', 'bakery', 'bäckerei', 'konditorei', 'patisserie', 'boulangerie'],
  restaurante: ['restaurant', 'gastro', 'pizz', 'bistro', 'take-away', 'takeaway', 'imbiss', 'beizli', 'gasthaus', 'trattoria', 'pizzeria'],
  hotelaria: ['hotel', 'gastgewerbe', 'unterhaltung', 'bar', 'lounge', 'club', 'disco', 'event', 'hôtel', 'albergo', 'auberge'],
  varejo: ['shop', 'handel', 'retail', 'boutique', 'kleinhandel', 'einzelhandel', 'laden', 'geschäft', 'magasin', 'negozio', 'kiosk'],
  grossista: ['grosshandel', 'wholesale', 'grossiste'],
  servicos: ['service', 'beratung', 'consulting', 'agentur', 'dienstleistung', 'conseil', 'grafik', 'design', 'werbung', 'marketing'],
  saude: ['arzt', 'medizin', 'health', 'pflege', 'dental', 'praxis', 'klinik', 'therapie', 'gesundheit', 'médecin', 'santé', 'physio'],
  beleza: ['coiffeur', 'kosmetik', 'beauty', 'fusspflege', 'massage', 'spa', 'nagelstudio', 'wellness', 'friseur', 'beautysalon', 'beautycenter', 'beautyinstitut'],
  construcao: ['bauwesen', 'bau', 'handwerk', 'sanitär', 'elektriker', 'maler', 'schreinerei', 'bâtiment', 'construction', 'storen'],
  industria: ['industrie', 'produktion', 'fertigung', 'fabrik', 'manufaktur'],
  tecnologia: ['software', 'plattform', 'e-commerce', 'digitalisiert', 'app ', 'tech', 'b2b-matching'],
  logistica: ['logistik', 'transport', 'spedition', 'fuhrpark'],
  imobiliario: ['immobilien', 'immobilie', 'liegenschaft', 'real estate'],
  alimentar: ['lebensmittel', 'food', 'metzgerei', 'brauerei', 'weinhandel'],
  automotivo: ['autohaus', 'garage', 'autoindustrie', 'fahrzeughandel', 'werkstatt', 'autowerkstatt'],
  agricultura: ['landwirtschaft', 'agricultura', 'bauernhof', 'farm'],
  financeiro: ['versicherung', 'finanzierung', 'treuhand', 'fintech', 'investor'],
  educacao: ['ausbildung', 'training', 'schule', 'bildung', 'nachhilfe'],
  energia: ['energie', 'umwelt', 'solar', 'photovoltaik'],
  outro: [],
}

export function guessSector(text: string): SectorValue {
  const t = (text ?? '').toLowerCase()
  for (const sector of SECTOR_VALUES) {
    if (sector === 'outro') continue
    if (SECTOR_KEYWORDS[sector].some((kw) => matchesKeyword(t, kw))) return sector
  }
  return 'outro'
}

// Cantão (nome oficial DE/FR/IT/EN + abreviatura) -> código de 2 letras.
const CANTON_NAME_MAP: Record<string, CantonValue> = {
  aargau: 'AG', aarau: 'AG',
  'appenzell innerrhoden': 'AI', appenzell: 'AI',
  'appenzell ausserrhoden': 'AR',
  bern: 'BE', berne: 'BE', berna: 'BE',
  'basel-landschaft': 'BL', basellandschaft: 'BL',
  'basel-stadt': 'BS', baselstadt: 'BS', basel: 'BS',
  freiburg: 'FR', fribourg: 'FR',
  genf: 'GE', genève: 'GE', geneve: 'GE', geneva: 'GE', ginevra: 'GE',
  glarus: 'GL',
  graubünden: 'GR', graubunden: 'GR', grigioni: 'GR', grisons: 'GR', chur: 'GR',
  jura: 'JU',
  luzern: 'LU', lucerne: 'LU', lucerna: 'LU',
  neuenburg: 'NE', neuchâtel: 'NE', neuchatel: 'NE',
  nidwalden: 'NW',
  obwalden: 'OW',
  'st. gallen': 'SG', 'st.gallen': 'SG', 'st gallen': 'SG', sankt_gallen: 'SG', 'san gallo': 'SG',
  schaffhausen: 'SH',
  solothurn: 'SO',
  schwyz: 'SZ',
  thurgau: 'TG',
  tessin: 'TI', ticino: 'TI', lugano: 'TI', locarno: 'TI', bellinzona: 'TI',
  uri: 'UR',
  waadt: 'VD', vaud: 'VD', lausanne: 'VD', 'la côte': 'VD',
  wallis: 'VS', valais: 'VS', vallese: 'VS', sion: 'VS',
  zug: 'ZG',
  zürich: 'ZH', zurich: 'ZH', zurigo: 'ZH',
  // grandes cidades suíças (não são cantões, mas aparecem como "city" nos dados de origem)
  winterthur: 'ZH', dietikon: 'ZH', uster: 'ZH', wallisellen: 'ZH', bülach: 'ZH',
  rapperswil: 'SG', wil: 'SG',
  baden: 'AG', wettingen: 'AG', mellingen: 'AG', aarburg: 'AG',
  thun: 'BE', biel: 'BE', bienne: 'BE',
  // abreviaturas oficiais de 2 letras
  ag: 'AG', ai: 'AI', ar: 'AR', be: 'BE', bl: 'BL', bs: 'BS', fr: 'FR', ge: 'GE',
  gl: 'GL', gr: 'GR', ju: 'JU', lu: 'LU', ne: 'NE', nw: 'NW', ow: 'OW', sg: 'SG',
  sh: 'SH', so: 'SO', sz: 'SZ', tg: 'TG', ti: 'TI', ur: 'UR', vd: 'VD', vs: 'VS',
  zg: 'ZG', zh: 'ZH',
}

export function guessCanton(text: string): CantonValue {
  const t = (text ?? '').toLowerCase()
  // nomes/cidades completos primeiro (mais fiáveis), abreviaturas de 2 letras por último
  const entries = Object.entries(CANTON_NAME_MAP).sort((a, b) => b[0].length - a[0].length)
  for (const [key, val] of entries) {
    if (matchesKeyword(t, key)) return val
  }
  return 'outro'
}
