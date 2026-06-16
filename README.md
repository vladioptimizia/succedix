# Succedix

MVP de uma plataforma de descoberta gamificada para sucessão de pequenos negócios suíços (ver `PRODUTO_SUCCEDIX.md` para o documento completo de produto enviado).

## O que está implementado nesta entrega

- **Landing page** (`app/page.tsx`)
- **Onboarding Vendedor** — Seller Readiness Form (6 passos) com cálculo de score (`app/onboarding/seller`)
- **Onboarding Comprador** — Buyer Readiness Form (6 passos) com cálculo de score (`app/onboarding/buyer`)
- **Descoberta (swipes)** — feed de cards com Like/Pass/Save, limite diário de 5 swipes, Fit Score calculado por compatibilidade setor/localização/preço, lista de "Salvos" (`app/discover`)
- **Lógica de scoring** (`lib/scoring.ts`): Seller Readiness, Buyer Readiness e Succession Fit Score
- **Schema SQL completo** com RLS para Supabase (`supabase/schema.sql`)

Dados de negócios e perfil de comprador usam mocks/`localStorage` — não há backend/auth real ainda (ver "Próximos passos").

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres) — schema pronto, integração ainda não conectada

## Rodando localmente

```bash
cd succedix
npm install
npm run dev
```

Abra http://localhost:3000

## Próximos passos (fora desta entrega)

- Conectar Supabase (auth, persistência real de businesses/interactions/profiles)
- Admin dashboard (fila de aprovações, KPIs)
- Monetização (Stripe, paywall, tiers pagos)
- Emails transacionais (Resend)
- Blur progressivo de dados sensíveis por tier
- Analytics (Plausible) e monitoramento (Sentry)

Ver roadmap completo de 10 semanas no documento de produto.
