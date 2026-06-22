#!/usr/bin/env node
// Scraper companymarket.ch → Succedix
// Uso: node scripts/scrape-companymarket.mjs

const WEBHOOK_URL = 'https://succedix.vercel.app/api/n8n/import'
const SECRET = '6dcadf3e2d1216a787f3ca906454a1b6db15ac04e504b29c131adfefb17517ef'
const BASE = 'https://www.companymarket.ch'
const DELAY_MS = 1500
const END_PAGE = 28

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml',
  'Accept-Language': 'de-CH,de;q=0.9',
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

function parsePrice(text) {
  if (!text) return 0
  const clean = text.replace(/['\s]/g, '')
  const m = clean.match(/([\d.]+)([KMkm]?)/)
  if (!m) return 0
  const n = parseFloat(m[1])
  if (m[2].toUpperCase() === 'M') return Math.round(n * 1000000)
  if (m[2].toUpperCase() === 'K') return Math.round(n * 1000)
  return Math.round(n)
}

function extractListings(html) {
  const listings = []
  // split por cada bloco <div class="listing ...">
  const blocks = html.split(/<div class="listing /).slice(1)

  for (const block of blocks) {
    try {
      // URL e source_id
      const urlMatch = block.match(/href="(https:\/\/www\.companymarket\.ch\/listing\/([^"]+))"/)
      if (!urlMatch) continue
      const sourceUrl = urlMatch[1]
      const sourceId = urlMatch[2]

      // nome — primeiro link após o href do listing
      const nameMatch = block.match(/href="https:\/\/www\.companymarket\.ch\/listing\/[^"]+">([^<]{5,150})<\/a>/)
      if (!nameMatch) continue
      const name = nameMatch[1].trim()

      // descrição
      const descMatch = block.match(/class="listing__description">\s*([\s\S]{10,400}?)\s*<\/div>/)
      const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : null

      // sector (Branche)
      const sectorMatch = block.match(/<em>Branche:<\/em>\s*<b>([^<]{3,60})<\/b>/)
      const sector = sectorMatch ? sectorMatch[1].trim() : null

      // cantão/região
      const cantonMatch = block.match(/<em>(?:Kanton|Region):<\/em>\s*<b>([^<]{2,50})<\/b>/)
      const canton = cantonMatch ? cantonMatch[1].trim() : null

      // preço
      const priceMatch = block.match(/<em>Preis:<\/em>\s*<b>CHF\s*([\d'.KMkm]+)(?:\s*-\s*[\d'.KMkm]+)?<\/b>/)
      const price = priceMatch ? parsePrice(priceMatch[1]) : 0

      // receita
      const revMatch = block.match(/<em>Umsatz:<\/em>\s*<b>CHF\s*([\d'.KMkm]+)/)
      const annualRevenue = revMatch ? parsePrice(revMatch[1]) : null

      // funcionários
      const empMatch = block.match(/<em>Mitarbeitende:<\/em>\s*<b>(\d+)<\/b>/)
      const employees = empMatch ? parseInt(empMatch[1]) : null

      listings.push({
        source: 'companymarket.ch',
        source_id: sourceId,
        source_url: sourceUrl,
        name,
        description,
        sector,
        canton,
        price_min: price,
        price_max: price,
        annual_revenue: annualRevenue,
        employees,
      })
    } catch {}
  }
  return listings
}

async function scrapePage(page) {
  const url = page === 1 ? BASE : `${BASE}/?page=${page}`
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) { process.stdout.write(` HTTP ${res.status}`); return [] }
  const html = await res.text()
  if (html.includes('cf-turnstile')) { process.stdout.write(' Cloudflare!'); return [] }
  return extractListings(html)
}

async function sendBatch(businesses) {
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-n8n-secret': SECRET },
    body: JSON.stringify({ businesses }),
  })
  if (!res.ok) return { inserted: 0, skipped: 0, errors: 0 }
  return res.json()
}

async function main() {
  console.log('=== Scraper companymarket.ch → Succedix ===\n')
  let totalInserted = 0, totalSkipped = 0, totalFound = 0

  for (let page = 1; page <= END_PAGE; page++) {
    process.stdout.write(`Página ${page}/${END_PAGE}... `)
    const listings = await scrapePage(page)
    totalFound += listings.length
    process.stdout.write(`${listings.length} encontrados`)

    if (listings.length) {
      const r = await sendBatch(listings)
      totalInserted += r.inserted || 0
      totalSkipped += r.updated || 0
      process.stdout.write(`  → novos: ${r.inserted || 0}  actualizados: ${r.updated || 0}`)
    }
    console.log('')
    if (page < END_PAGE) await sleep(DELAY_MS)
  }

  console.log(`\nTotal: ${totalFound} | Novos: ${totalInserted} | Já existiam: ${totalSkipped}`)
}

main().catch(console.error)
