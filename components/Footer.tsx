import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-24"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,8,8,0.9)' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-serif text-lg font-semibold flex items-center gap-1.5 mb-3">
              Succedix<span style={{ color: '#10b981' }}>.</span>
              <span title="Plataforma exclusiva para a Suíça">🇨🇭</span>
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>
              Inteligência de Sucessão Empresarial.<br />
              Conectamos proprietários e sucessores certos na Suíça.
            </p>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#4b5563' }}>Plataforma</p>
            <nav className="flex flex-col gap-2.5 text-sm" style={{ color: '#6b7280' }}>
              <Link href="/onboarding/buyer" className="hover:text-white transition-colors">Comprar um negócio</Link>
              <Link href="/onboarding/seller" className="hover:text-white transition-colors">Vender o meu negócio</Link>
              <Link href="/discover" className="hover:text-white transition-colors">Descobrir</Link>
            </nav>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#4b5563' }}>Empresa</p>
            <nav className="flex flex-col gap-2.5 text-sm" style={{ color: '#6b7280' }}>
              <Link href="/#como-funciona" className="hover:text-white transition-colors">Como funciona</Link>
              <Link href="/login" className="hover:text-white transition-colors">Entrar</Link>
            </nav>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#4b5563' }}>Legal</p>
            <nav className="flex flex-col gap-2.5 text-sm" style={{ color: '#6b7280' }}>
              <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span>🛡️</span> Privacidade de Dados
              </Link>
              <Link href="/privacy#cookies" className="hover:text-white transition-colors">Política de Cookies</Link>
              <Link href="/privacy#rights" className="hover:text-white transition-colors">Os Seus Direitos</Link>
              <Link href="mailto:privacidade@succedix.ch" className="hover:text-white transition-colors">Contactar DPO</Link>
            </nav>
          </div>

        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: '#4b5563' }}
        >
          <p>© {year} Succedix Sàrl. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }}
              />
              Conforme nLPD &amp; RGPD
            </span>
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
