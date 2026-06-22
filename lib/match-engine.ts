import Anthropic from '@anthropic-ai/sdk'
import { calculateSuccessionFitScore } from './scoring'
import type { BuyerReadinessInput, Business } from './types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface MatchResult {
  businessId: string
  fitScore: number
  sectorMatch: boolean
  priceMatch: boolean
  regionMatch: boolean
  aiExplanation: string
  aiHighlights: string[]
}

export interface MatchBusiness {
  id: string
  name: string
  sector: string
  canton: string
  city: string | null
  price_min: number
  price_max: number
  annual_revenue: number | null
  description: string | null
  employees: number | null
  established_year: number | null
  seller_readiness_score: number
}

export async function scoreBusiness(
  business: MatchBusiness,
  buyer: BuyerReadinessInput
): Promise<MatchResult> {
  const bizForScoring: Business = {
    id: business.id,
    name: business.name,
    sector: business.sector as Business['sector'],
    canton: business.canton as Business['canton'],
    city: business.city ?? '',
    distanceKm: business.canton === buyer.regionMain ? 5 : 50,
    priceMin: business.price_min ?? 0,
    priceMax: business.price_max ?? 0,
    establishedYear: business.established_year ?? 2000,
    photoUrl: '',
    sellerReadinessScore: business.seller_readiness_score ?? 50,
    tags: [],
  }

  const sectorMatch = buyer.sectorsInterested.includes(bizForScoring.sector)
  const priceMatch = bizForScoring.priceMin <= buyer.capitalMax && bizForScoring.priceMax >= buyer.capitalMin
  const regionMatch = bizForScoring.canton === buyer.regionMain
  const baseScore = calculateSuccessionFitScore(bizForScoring, buyer)

  let aiExplanation = ''
  let aiHighlights: string[] = []

  try {
    const prompt = `Analisa a compatibilidade entre este comprador e este negócio à venda.

NEGÓCIO:
- Nome: ${business.name}
- Sector: ${business.sector}
- Cantão: ${business.canton}
- Preço: CHF ${(business.price_min / 1000).toFixed(0)}k – ${(business.price_max / 1000).toFixed(0)}k
- Receita anual: ${business.annual_revenue ? `CHF ${(business.annual_revenue / 1000).toFixed(0)}k` : 'não indicada'}
- Funcionários: ${business.employees ?? 'não indicado'}
- Descrição: ${business.description?.slice(0, 300) ?? 'sem descrição'}

COMPRADOR:
- Capital disponível: CHF ${(buyer.capitalMin / 1000).toFixed(0)}k – ${(buyer.capitalMax / 1000).toFixed(0)}k
- Sectores de interesse: ${buyer.sectorsInterested.join(', ') || 'aberto a todos'}
- Região: ${buyer.regionMain}
- Experiência: ${buyer.experienceBackground || 'não indicada'}
- Tipo de envolvimento: ${buyer.involvementType}

Responde APENAS em JSON:
{
  "explanation": "1-2 frases explicando porque este negócio é (ou não) ideal para este comprador",
  "highlights": ["ponto forte 1", "ponto forte 2", "ponto forte 3"]
}`

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const parsed = JSON.parse(text)
    aiExplanation = parsed.explanation ?? ''
    aiHighlights = parsed.highlights ?? []
  } catch {
    aiExplanation = sectorMatch
      ? `Sector compatível. ${priceMatch ? 'Preço dentro do orçamento.' : 'Preço acima do orçamento.'}`
      : `Fora do sector preferido. ${priceMatch ? 'Preço dentro do orçamento.' : ''}`
    aiHighlights = []
  }

  return { businessId: business.id, fitScore: baseScore, sectorMatch, priceMatch, regionMatch, aiExplanation, aiHighlights }
}

export async function generateMatchesForBuyer(
  buyer: BuyerReadinessInput & { id: string },
  businesses: MatchBusiness[],
  topN = 10
): Promise<MatchResult[]> {
  const candidates = businesses.filter(b => b.price_min <= buyer.capitalMax * 1.3)

  const scored = candidates.map(b => {
    const biz: Business = {
      id: b.id, name: b.name,
      sector: b.sector as Business['sector'],
      canton: b.canton as Business['canton'],
      city: b.city ?? '',
      distanceKm: b.canton === buyer.regionMain ? 5 : 50,
      priceMin: b.price_min ?? 0, priceMax: b.price_max ?? 0,
      establishedYear: b.established_year ?? 2000,
      photoUrl: '', sellerReadinessScore: b.seller_readiness_score ?? 50, tags: [],
    }
    return { business: b, score: calculateSuccessionFitScore(biz, buyer) }
  })

  const topCandidates = scored.sort((a, b) => b.score - a.score).slice(0, topN).map(s => s.business)

  const results: MatchResult[] = []
  for (let i = 0; i < topCandidates.length; i += 5) {
    const chunk = topCandidates.slice(i, i + 5)
    const chunkResults = await Promise.all(chunk.map(b => scoreBusiness(b, buyer)))
    results.push(...chunkResults)
  }

  return results.sort((a, b) => b.fitScore - a.fitScore)
}
