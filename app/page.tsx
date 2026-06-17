import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">

      {/* ─── HERO ─── */}
      <section
        className="relative flex flex-col items-center text-center px-6 pt-28 pb-32 gap-8"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.12), transparent)' }}
      >
        <span
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-1.5 rounded-full"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
          🇨🇭 Plataforma exclusiva para a Suíça
        </span>

        <h1 className="font-serif text-5xl md:text-7xl font-bold max-w-3xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
          Encontre o seu próximo
          <br />
          <span style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>negócio local.</span>
        </h1>

        <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
          Ou venda o seu com discrição. A Succedix conecta proprietários e sucessores certos.
          <br />
          <span className="text-gray-300 font-medium">Inteligência · Confidencialidade · Suporte.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/onboarding/buyer"
            className="h-12 px-8 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background: '#10b981', color: '#fff', boxShadow: '0 0 24px rgba(16,185,129,0.3)' }}
          >
            🔍 Comprar Um Negócio
          </Link>
          <Link
            href="/onboarding/seller"
            className="h-12 px-8 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e5e7eb' }}
          >
            🏢 Vender Meu Negócio
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex flex-wrap justify-center gap-8 mt-4">
          <Stat value="100+" label="Proprietários confiaram" />
          <Stat value="50+" label="Transições bem-sucedidas" />
          <Stat value="CHF 50M" label="Em volume de negócios" />
        </div>

        <p className="text-gray-600 text-xs mt-1">5 swipes gratuitos por dia · Sem cartão de crédito</p>
      </section>

      {/* ─── 3 PILARES ─── */}
      <section className="px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs tracking-widest uppercase text-gray-500 mb-3">Diferenciais</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-4">Porquê a Succedix</h2>
          <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
            A única plataforma que combina inteligência de matching, confidencialidade progressiva e suporte real na transição.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <PillarCard
              icon="🔒"
              title="Discrição Inteligente"
              description='"Venda com confidencialidade. Os dados só são revelados quando há interesse real."'
              features={[
                "Blur progressivo de informações",
                "Dados vistos apenas após contacto",
                "NDA automático incluído",
                "Zero exposição pública até estar pronto",
              ]}
            />
            <PillarCard
              icon="🎯"
              title="Inteligência de Matching"
              description='"Não procure negócios. Deixe que nós encontremos o ideal para si."'
              features={[
                "Seller Readiness Score (0-100)",
                "Buyer Readiness Score (0-100)",
                "Succession Fit Score (compatibilidade)",
                "5-6 negócios/dia (qualidade > quantidade)",
              ]}
              highlight
            />
            <PillarCard
              icon="🚀"
              title="Suporte de Transição"
              description='"Não vendemos negócios. Garantimos sucessões bem-sucedidas."'
              features={[
                "Data room seguro (docs + financeiro)",
                "Checklist de transição estruturado",
                "Ligação com especialistas",
                "Acompanhamento 6 meses pós-venda",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ─── */}
      <section id="como-funciona" className="px-6 py-24" style={{ background: 'rgba(16,185,129,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs tracking-widest uppercase text-gray-500 mb-3">Processo</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-16">Como funciona</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <StepCard
              number="01"
              title="Preparar"
              description="Diagnóstico de prontidão. Entenda pontos fortes e fracos antes de avançar."
            />
            <StepCard
              number="02"
              title="Encontrar"
              description="Vendedor publica. Comprador swipa. Machine learning encontra matches ideais."
            />
            <StepCard
              number="03"
              title="Conectar"
              description="Intenção confirmada. Dados sensíveis revelados. Negociação direta e segura."
            />
            <StepCard
              number="04"
              title="Transicionar"
              description="Data room, checklist, especialistas e mentoria por 6 meses. Sucesso garantido."
              accent
            />
          </div>
        </div>
      </section>

      {/* ─── PARA QUEM É ─── */}
      <section className="px-6 py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <AudienceCard
            tag="Para vendedores"
            headline="Prepare. Venda. Transite. Sem perder o que construiu."
            body="Há 25 anos construiu o seu negócio. Merece um sucessor à altura. A Succedix ajuda na preparação, encontra o certo, e garante que tudo continua."
            points={[
              "Veja quantos compradores interessados (sem nomes)",
              "Escolha quem pode ver os detalhes",
              "Suporte na transição incluso",
              "Confidencialidade garantida",
            ]}
            cta="Começar Diagnóstico"
            href="/onboarding/seller"
          />
          <AudienceCard
            tag="Para compradores"
            headline="O negócio ideal já existe. Falta encontrar."
            body="Passou meses a procurar sem resultados. A Succedix mostra negócios verificados e compatíveis consigo. Sem perder tempo. Sem risco."
            points={[
              "Apenas 5-6 negócios/dia (qualidade)",
              "Scores de compatibilidade claros",
              "Dados crescem conforme interesse",
              "Suporte na due diligence",
            ]}
            cta="Ver Oportunidades"
            href="/onboarding/buyer"
          />
        </div>
      </section>

      {/* ─── TABELA COMPARATIVA ─── */}
      <section className="px-6 py-20" style={{ background: 'rgba(16,185,129,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-xs tracking-widest uppercase text-gray-500 mb-3">Comparação</p>
          <h2 className="font-serif text-3xl font-bold text-center mb-12">O que nos diferencia</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Funcionalidade</th>
                  <th className="px-6 py-4 text-gray-500 font-medium text-center">Concorrentes</th>
                  <th className="px-6 py-4 font-medium text-center" style={{ color: '#10b981' }}>Succedix</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Foco em negócios locais", "✓✓", "✓✓✓"],
                  ["Discrição real (progressiva)", "✓", "✓✓✓"],
                  ["Guiação de comprador", "✓", "✓✓✓ (scores)"],
                  ["Multilíngue", "✓✓", "✓✓✓"],
                  ["Curadoria de listagens", "✓", "✓✓✓ (IA)"],
                  ["Matching inteligente", "✗", "✓✓✓ (core)"],
                  ["Suporte na transição", "✗", "✓✓✓ (diferencial)"],
                  ["Data room seguro", "✗", "✓"],
                  ["Mentoria pós-venda", "✗", "✓"],
                ].map(([feature, competitors, us], i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-800"
                    style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                  >
                    <td className="px-6 py-4 text-gray-300">{feature}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{competitors}</td>
                    <td className="px-6 py-4 text-center font-semibold" style={{ color: '#10b981' }}>{us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="px-6 py-24 flex flex-col items-center text-center gap-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 className="font-serif text-3xl md:text-4xl font-bold max-w-xl">Pronto para encontrar o seu negócio?</h2>
        <p className="text-gray-400 max-w-sm">Comece gratuitamente hoje. 5 swipes por dia, sem compromisso.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/onboarding/buyer"
            className="h-12 px-10 rounded-full font-medium text-sm flex items-center justify-center"
            style={{ background: '#10b981', color: '#fff', boxShadow: '0 0 32px rgba(16,185,129,0.25)' }}
          >
            🔍 Ver Oportunidades
          </Link>
          <Link
            href="/onboarding/seller"
            className="h-12 px-8 rounded-full font-medium text-sm flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e5e7eb' }}
          >
            🏢 Começar Diagnóstico
          </Link>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-gray-600 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <span className="font-serif text-gray-500 font-medium">Succedix.</span>
        <span className="mx-3">·</span>
        Inteligência + Confidencialidade + Suporte
        <span className="mx-3">·</span>
        🇨🇭 Suíça
        <span className="mx-3">·</span>
        © 2025
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-serif text-2xl font-bold" style={{ color: '#10b981' }}>{value}</p>
      <p className="text-gray-500 text-xs mt-0.5">{label}</p>
    </div>
  );
}

function PillarCard({
  icon, title, description, features, highlight = false,
}: {
  icon: string; title: string; description: string; features: string[]; highlight?: boolean;
}) {
  return (
    <div
      className="p-8 rounded-2xl flex flex-col gap-4"
      style={{
        background: highlight ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
        border: highlight ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <span className="text-3xl">{icon}</span>
      <h3 className="font-serif text-xl font-bold">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed italic">{description}</p>
      <ul className="space-y-2 mt-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
            <span className="mt-0.5 text-success flex-shrink-0">✓</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepCard({
  number, title, description, accent = false,
}: {
  number: string; title: string; description: string; accent?: boolean;
}) {
  return (
    <div
      className="p-6 rounded-2xl flex flex-col gap-3"
      style={{
        background: accent ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)',
        border: accent ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <span
        className="font-serif text-3xl font-bold"
        style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        {number}
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function AudienceCard({
  tag, headline, body, points, cta, href,
}: {
  tag: string; headline: string; body: string; points: string[]; cta: string; href: string;
}) {
  return (
    <div
      className="p-8 rounded-2xl flex flex-col gap-5"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <span className="text-xs tracking-widest uppercase" style={{ color: '#10b981' }}>{tag}</span>
      <h3 className="font-serif text-xl font-bold leading-snug">{headline}</h3>
      <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{body}</p>
      <ul className="space-y-2">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
            <span className="mt-0.5 text-success flex-shrink-0">✓</span>
            {p}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="mt-2 self-start h-9 px-5 rounded-full text-sm font-medium flex items-center"
        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}
      >
        {cta} →
      </Link>
    </div>
  );
}
