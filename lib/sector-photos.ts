export const SECTOR_PHOTOS: Record<string, string> = {
  restaurante:  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80&fit=crop',
  cafe:         'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80&fit=crop',
  hotelaria:    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80&fit=crop',
  varejo:       'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80&fit=crop',
  grossista:    'https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80&fit=crop',
  servicos:     'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80&fit=crop',
  saude:        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80&fit=crop',
  beleza:       'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80&fit=crop',
  construcao:   'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80&fit=crop',
  industria:    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80&fit=crop',
  tecnologia:   'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80&fit=crop',
  logistica:    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80&fit=crop',
  imobiliario:  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80&fit=crop',
  alimentar:    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80&fit=crop',
  automotivo:   'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80&fit=crop',
  agricultura:  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80&fit=crop',
  financeiro:   'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80&fit=crop',
  educacao:     'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80&fit=crop',
  energia:      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80&fit=crop',
  outro:        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80&fit=crop',
}

export function getBusinessPhoto(photos: string[] | null | undefined, sector: string): string {
  if (photos && photos.length > 0) return photos[0]
  return SECTOR_PHOTOS[sector] ?? SECTOR_PHOTOS.outro
}
