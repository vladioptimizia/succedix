import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section
        className="relative flex flex-col items-center text-center px-6 pt-28 pb-32 gap-8"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.12), transparent)' }}
      >
        <span
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-1.5 rounded-full"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
          Plataforma exclusiva para a Suíça
        </span>

        <h1 className="font-serif text-5xl md:text-7xl font-bold max-w-3xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
          Empresas locais.<br />
          <span style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Oportunidades reais.</span>
        </h1>

        <p className="text-gray-400 max-w-lg text-lg leading-relaxed">
          Conectamos compradores locais e proprietários que se aposentam de micro e pequenas empresas — cafés, lojas, estúdios e muito mais. Simples, local e construída para a sua comunidade.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/onboarding/buyer"
            className="h-12 px-8 rounded-full font-medium text-sm flex items-center justify-center transition-all"
            style={{ background: '#10b981', color: '#fff', boxShadow: '0 0 24px rgba(16,185,129,0.3)' }}
          >
            Comprar um negócio
          </Link>
          <Link
            href="/onboarding/seller"
            className="h-12 px-8 rounded-full font-medium text-sm flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e5e7eb' }}
          >
            Vender meu negócio
          </Link>
        </div>

        <p className="text-gray-600 text-xs mt-2">5 swipes gratuitos por dia · Sem cartão de crédito</p>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs tracking-widest uppercase text-gray-500 mb-3">Processo</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-16">Como funciona</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <StepCard number="01" title="Descubra" description="Explore negócios locais verificados com dados financeiros reais." />
            <StepCard number="02" title="Conecte" description="O algoritmo encontra o match perfeito entre comprador e negócio." />
            <StepCard number="03" title="Suceda" description="Dê continuidade ao legado — com suporte na transição." />
          </div>
        </div>
      </section>

      {/* Para quem é */}
      <section className="px-6 py-20" style={{ background: 'rgba(16,185,129,0.03)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <AudienceCard
            tag="Para compradores"
            title="Encontre o negócio certo na sua cidade"
            description="Cafés, lojas, estúdios, serviços. Negócios verificados com histórico real, a dois passos de si."
            cta="Criar perfil de comprador"
            href="/onboarding/buyer"
          />
          <AudienceCard
            tag="Para vendedores"
            title="Passe o seu legado para as mãos certas"
            description="Proprietários que se aposentam merecem um sucessor que valorize o que foi construído."
            cta="Avaliar o meu negócio"
            href="/onboarding/seller"
          />
        </div>
      </section>

      {/* Destaques */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs tracking-widest uppercase text-gray-500 mb-3">Diferenciais</p>
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Porquê a Succedix</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Feature title="Proprietários verificados" description="Todos os vendedores passam por validação manual antes de publicar." />
            <Feature title="Dados financeiros reais" description="Receitas, margens e histórico auditados — sem surpresas." />
            <Feature title="Confidencial por design" description="O nome do negócio só é revelado após match confirmado." />
            <Feature title="Suporte na transição" description="Acompanhamento jurídico e operacional em cada etapa." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 flex flex-col items-center text-center gap-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 className="font-serif text-3xl md:text-4xl font-bold max-w-xl">Pronto para encontrar o seu negócio?</h2>
        <p className="text-gray-400 max-w-sm">Comece gratuitamente hoje. 5 swipes por dia, sem compromisso.</p>
        <Link
          href="/onboarding/buyer"
          className="h-12 px-10 rounded-full font-medium text-sm flex items-center justify-center"
          style={{ background: '#10b981', color: '#fff', boxShadow: '0 0 32px rgba(16,185,129,0.25)' }}
        >
          Começar agora
        </Link>
      </section>

      <footer className="px-6 py-8 text-center text-gray-600 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <span className="font-serif text-gray-500 font-medium">Succedix.</span>
        <span className="mx-4">·</span>
        Sobre · Blog · Termos · Privacidade
        <span className="mx-4">·</span>
        © 2025
      </footer>
    </main>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div
      className="p-8 rounded-2xl flex flex-col gap-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <span className="font-serif text-4xl font-bold" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{number}</span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function AudienceCard({ tag, title, description, cta, href }: { tag: string; title: string; description: string; cta: string; href: string }) {
  return (
    <div
      className="p-8 rounded-2xl flex flex-col gap-4"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <span className="text-xs tracking-widest uppercase" style={{ color: '#10b981' }}>{tag}</span>
      <h3 className="font-serif text-xl font-bold leading-snug">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{description}</p>
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

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div
      className="p-6 rounded-xl flex gap-4 items-start"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.15)' }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 2.5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </span>
      <div>
        <p className="font-medium text-sm mb-1">{title}</p>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
