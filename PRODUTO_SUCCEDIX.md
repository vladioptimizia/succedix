# SUCCEDIX MVP
## Documento Completo do Produto

**Versão:** 1.0
**Status:** Ready for Development
**Data:** Junho 2026
**Preparado por:** Optimizia / Vladimir Ferreira

---

## 1. VISÃO GERAL DO PRODUTO

### O Succedix é...

**Um Tinder para negócios.** Uma plataforma de inteligência que ajuda pequenos negócios suíços a encontrar sucessores certos e compradores a encontrar oportunidades compatíveis.

### O Problema

- 101k empresas suíças buscam sucessor (sem saber por onde começar)
- Compradores não sabem avaliar compatibilidade
- Falta de discrição em transações sensíveis
- Processo não guiado; muita fricção

### A Solução

- Plataforma guiada (Prepare → Qualify → Match → Discover)
- Scores de compatibilidade (Seller Readiness, Buyer Readiness, Succession Fit)
- Descoberta gamificada com limite (5-6 swipes/dia = urgência + monetização)
- Discrição progressiva (blur de dados até intenção clara)

### Métrica de Sucesso do MVP

- 30 dias de operação
- 20 negócios publicados
- 15 compradores qualificados
- Então: ativa monetização / escala

---

## 2. DEFINIÇÃO DE TERMOS

| Termo | Definição |
|---|---|
| Seller Readiness Score | Indicador (0-100) de preparação do vendedor/negócio para sucessão |
| Buyer Readiness Score | Indicador (0-100) de maturidade do comprador para adquirir negócio |
| Succession Fit Score | Indicador (0-100) de compatibilidade entre negócio e comprador |
| Swipe | Ação do comprador: Like / Pass / Save em um card de negócio |
| Card | Card grande (visual-first) com negócio, imagem, setor, cantão, preço, Fit Score |
| Tier Gratuito | Acesso limitado: 5-6 swipes/dia, dados públicos |
| Tier Pago | Acesso ilimitado: dados completos, contacto direto, alertas |
| Blur | Ocultação de dados sensíveis (nome, localização exata, financeiro) |
| Like | Comprador manifesta interesse; guardado em "Salvos" |
| Pass | Comprador rejeita; invisível ao vendedor |
| Save | Comprador marca para depois; privado |
| Admin | Curador manual da plataforma (Vladimir no MVP) |
| Raio | Distância máxima em km que comprador aceita |

---

## 3. PROPOSTA DE VALOR

### Para Vendedores

"Prepare seu pequeno negócio e encontre o sucessor certo. Discrição, qualidade, continuidade."

**Benefícios:** diagnóstico claro (Seller Readiness Score), orientação de preparação, acesso a compradores qualificados, discrição (blur de dados até aprovação), especialistas + suporte (futuro).

**Preços MVP:** Seller Readiness Report CHF 149-299; Tier Pago CHF 49-99/mês ou CHF 149 one-time.

### Para Compradores

"Descubra o negócio perfeito para seu próximo passo. Swipe, goste, contacte."

**Benefícios:** descoberta diária (5-6 negócios/dia), compatibilidade clara (Fit Score), sem fricção, dados progressivos, alertas inteligentes (futuro).

**Preços MVP:** Buyer Readiness Profile CHF 49-99; Tier Pago CHF 19-29/mês.

### Para a Plataforma

"Monetizar preparação, qualificação e acesso. Não comissão de venda."

**Receitas:** Relatórios CHF 1.5k-3k/mês; Tiers pagos vendedor CHF 250-1.5k/mês; Tiers pagos comprador CHF 380-1.5k/mês. Total MVP: CHF 3.5k-9k/mês (conservador).

---

## 4. ARQUITETURA DE PRODUTO

Camadas: Pública (landing, educação) → Entrada (onboarding seller/buyer) → Descoberta Gamificada (cards swipeable, limite 5-6/dia, Fit Score) → Curadoria & Matching (admin, Succession Fit Score) → Monetização (tier pago, paywall, contacto) → Dados & Compliance (RLS, permissões, audit logs).

### Módulos principais

| Módulo | Responsabilidade | Prioridade |
|---|---|---|
| Landing | Homepage, proposta, CTAs | Alta |
| Onboarding Vendedor | Seller Readiness form + score | Alta |
| Onboarding Comprador | Buyer Readiness form + score | Alta |
| Descoberta | Cards, swipes, limite | Alta |
| Admin Panel | Aprovações, curadoria, KPIs | Alta |
| Dashboard Comprador | Salvos, histórico, perfil | Alta |
| Dashboard Vendedor | Negócio, interessados, prontidão | Alta |
| Tier Pago | Paywall, subscrição, upgrade | Média/Alta |
| Email | Transacionais, notificações | Média |
| Analytics | Plausible/PostHog, funil | Média |
| Data Room | Armazenamento de docs | Futura |
| Parceiros | Rede de especialistas | Futura |

---

## 5. USER PERSONAS

### Maria, 58, Zurique (Vendedor)

Proprietária de café desde 1998, fatura CHF 210k/ano, sem sucessor familiar, quer aposentar-se em 2 anos. Quer um processo simples e discreto, e encontrar alguém com paixão pelo negócio, não só capital. Disposição a pagar: CHF 200-300 por relatório + CHF 50/mês para ver interessados.

### João, 42, Zurique (Comprador)

Ex-banca (15 anos), capital CHF 200k, fala português/alemão/inglês, quer autonomia e um negócio já em funcionamento perto de Zurique. Disposição a pagar: CHF 25/mês para acesso ilimitado + alertas.

### Vladimir, 45 (Admin/Curador)

Fundador, CEO + curador no MVP, ~10h/semana disponíveis. Precisa de um dashboard simples com fila de aprovações, filtros rápidos e relatório de métricas. Objetivo: manter qualidade alta, 80%+ de aprovação para bons leads.

---

## 6. USER JOURNEYS (resumo)

**Vendedor:** descoberta → onboarding (Seller Readiness Form, 8 passos) → score + diagnóstico → relatório opcional (CHF 249) → publicação do negócio → aprovação do admin → notificação de interessados (blur se grátis) → upgrade para ver nomes → contacto e negociação.

**Comprador:** descoberta → signup → Buyer Readiness Form (7 passos) → score → feed de cards com swipe limitado (5/dia) → Salvos → upgrade para ilimitado (CHF 24/mês) → contacto direto → due diligence → transação.

---

## 7. FEATURES E FUNCIONALIDADES

1. **Landing Page** — proposta de valor, "Como funciona" (Descobrir / Conectar / Continuar), destaques, CTAs duplos (vender/comprar).
2. **Seller Readiness Form** (8 passos): dados básicos, financeiro, motivo da venda, operação, base de clientes, documentação, descrição livre, confirmação. Resultado: score 0-100 + diagnóstico + CTA para relatório pago.
3. **Descoberta com Swipes** (core): card grande visual-first (imagem, nome, setor, localização, preço, Fit Score, tags, ano de fundação), ações Pass/Like/Guardar, indicador de limite diário com CTA de upgrade.
4. **Buyer Readiness Form** (7 passos): capital disponível, setor de interesse, localização/raio, tipo de envolvimento, experiência, prazo, idiomas. Resultado: score 0-100 + recomendações + CTA para explorar.
5. **Dashboard Comprador**: abas Descobrir / Salvos / Perfil.
6. **Dashboard Vendedor**: abas Meu Negócio / Interessados / Status / Perfil.
7. **Admin Dashboard**: status geral, fila de aprovações (aprovar/rejeitar/pedir ajustes), métricas do mês (vendas de relatórios, assinantes pagos, MRR, CAC).

---

## 8. DESIGN SYSTEM

**Cores:** Verde sucesso `#10b981`, vermelho atenção `#ef4444`, azul info `#3b82f6`, âmbar warning `#f59e0b`; fundo escuro `#1a1a1a`, texto branco `#ffffff`.

**Faixas de score:** 80-100 verde (Excelente), 60-79 âmbar (Bom), 40-59 laranja (Aceitável), 0-39 vermelho (Fraco).

**Tipografia:** Headings serif (Playfair) para landing, sans (Inter/Poppins) para body; line-height 1.2 (headings) / 1.6 (body).

**Componentes reutilizáveis:** Button, Card, Badge, Input, Score Circle, Progress Bar, Modal, Toast.

---

## 9-10. COMPONENTES UI E FLUXOS DE DADOS

Componentes principais: Card de Negócio (discovery), Score Circle, Swipe Feedback (toasts de like/pass/guardar), Limit Badge.

Fluxos de dados chave: Like do comprador (cria interaction, atualiza swipe counter, calcula Succession Fit Score async, notifica vendedor se pago), reset diário de swipe counters à meia-noite, publicação de negócio (validação de score mínimo → pending_approval → aprovação do admin → notificação ao vendedor → aparece no feed de compradores).

---

## 11. ESPECIFICAÇÕES TÉCNICAS

**Stack de referência (PRD original):** Next.js 14 (App Router) + Tailwind CSS, Supabase (Postgres + Auth + Storage), Resend (email), Plausible (analytics), Vercel (hosting), Sentry (monitoring).

**Performance targets:** FCP <1.5s, LCP <2.5s, CLS <0.1, latência de swipe <150ms.

**Endpoints REST principais:** `/api/auth/*`, `/api/users/*`, `/api/businesses/*`, `/api/interactions/*`, `/api/matching/*`, `/api/subscriptions/*`, `/api/admin/*`.

---

## 12. MODELO DE DADOS

Tabelas principais: `users`, `businesses`, `interactions`, `buyer_profiles`, `swipe_counters`, `subscriptions`. RLS: usuários veem apenas seus próprios dados; vendedores veem seu próprio negócio; compradores veem apenas negócios aprovados; campos sensíveis ocultos para tier gratuito.

Ver schema SQL completo e pronto para uso em `supabase/schema.sql`.

---

## 13. MONETIZAÇÃO E LIMITES

**Comprador:** grátis = 5-6 swipes/dia, dados básicos, sem contacto; pro = swipes ilimitados, dados completos, contacto, alertas (CHF 19-29/mês).

**Vendedor:** grátis = publicar + ver contagem de interessados (blur); pro = ver nomes/dados/contacto direto (CHF 49-99/mês ou CHF 149 one-time).

**Produtos complementares:** Seller Readiness Report (CHF 149-299), Buyer Readiness Profile (CHF 49-99).

**Projeção conservadora (30-90 dias):** MRR total estimado ~CHF 6.7k/mês com 100 compradores, 20 negócios publicados e 30 relatórios vendidos.

---

## 14. NOTIFICAÇÕES E COMUNICAÇÕES

Emails transacionais para: confirmação de signup, conclusão de Readiness (buyer/seller), publicação/aprovação de negócio, novo interessado, limite diário atingido, sucesso de upgrade. Toasts in-app para like, pass, limite atingido, erro, sucesso de submissão.

---

## 15. ANALYTICS E MÉTRICAS

Funis de comprador e vendedor (visitantes → forms → ativos → swipes → likes → upgrades → MRR) e métricas de matching (matches criados, fit score médio, contactos iniciados, taxa de conversão para transação). Eventos sugeridos via Plausible: `Buyer:FormComplete`, `Buyer:Swipe`, `Buyer:Upgrade`, `Vendor:FormComplete`, `Vendor:Publish`, `Vendor:NewInterest`.

---

## 16. ROADMAP DE IMPLEMENTAÇÃO (10 semanas, referência original)

1. Semana 1: setup, auth, schema, deploy inicial.
2. Semanas 2-3: onboarding e formulários (Seller/Buyer Readiness), scores, relatórios em PDF, admin básico.
3. Semanas 4-5: motor de descoberta (cards, swipes, limite, filtragem geográfica, Fit Score, responsivo).
4. Semanas 6-7: admin completo e moderação (fila de aprovação, blur por tier, RLS, audit logs).
5. Semanas 8-9: monetização (Stripe, paywall, dashboards de assinatura, A/B test de preço).
6. Semana 10: polish, segurança, performance, analytics, monitoramento, checklist de lançamento.

---

## 17. CHECKLISTS DE VALIDAÇÃO (resumo)

**Pré-lançamento:** produto (cards, swipes, limite, blur), monetização (Stripe, paywall, tiers), compliance (NDA, GDPR, termos, audit logs), performance (FCP/LCP/latência), UX (onboarding <5min, contraste WCAG AA), admin (fila, métricas), emails (deliverability), testes (RLS, permissões, cross-browser).

**Pós-lançamento (dias 1-7):** monitoramento de erros (Sentry), analytics (Plausible), suporte (<24h), feedback de primeiros usuários, métricas de conversão, zero bugs críticos bloqueando o fluxo principal.

---

## Conclusão

O Succedix MVP é uma plataforma de descoberta gamificada para sucessão de pequenos negócios suíços. Com swipes limitados (5-6/dia), Fit Scores inteligentes e blur progressivo de dados, cria urgência, engagement e monetização desde o dia 1.

**Status:** Pronto para Desenvolvimento.
