import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50" style={{ background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
          Succedix<span className="text-success">.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <Link href="/#como-funciona" className="hover:text-white transition-colors">Como funciona</Link>
          <Link href="/onboarding/seller" className="hover:text-white transition-colors">Vender</Link>
          <Link href="/onboarding/buyer" className="hover:text-white transition-colors">Comprar</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors px-4 h-9 flex items-center">
            Entrar
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium h-9 px-5 rounded-full flex items-center transition-colors"
            style={{ background: '#10b981', color: '#fff' }}
          >
            Criar conta
          </Link>
        </div>
      </div>
    </header>
  );
}
