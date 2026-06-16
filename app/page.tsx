import Link from "next/link";
import Button from "@/components/Button";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <section className="flex flex-col items-center text-center px-6 py-24 gap-6">
        <span className="text-sm tracking-widest text-gray-400 uppercase">
          Succedix.ch
        </span>
        <h1 className="text-4xl md:text-5xl font-bold max-w-2xl">
          Empresas locais. Oportunidades reais.
        </h1>
        <p className="text-gray-300 max-w-xl">
          Conectamos proprietários e compradores certos. Sem intermediários.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link href="/onboarding/seller">
            <Button variant="primary">Vender meu negócio</Button>
          </Link>
          <Link href="/onboarding/buyer">
            <Button variant="ghost">Comprar um negócio</Button>
          </Link>
        </div>
      </section>

      <section className="px-6 py-16 bg-gray-900/40">
        <h2 className="text-2xl font-bold text-center mb-12">Como funciona</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Step number="01" title="Descobrir">
            Encontre o negócio perfeito
          </Step>
          <Step number="02" title="Conectar">
            Contacte o proprietário
          </Step>
          <Step number="03" title="Continuar">
            Mantenha o sucesso local
          </Step>
        </div>
      </section>

      <section className="px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">Destaques</h2>
        <ul className="max-w-md mx-auto space-y-3 text-gray-300">
          <li>✓ Proprietários locais verificados</li>
          <li>✓ Informações financeiras reais</li>
          <li>✓ Confidencial por design</li>
          <li>✓ Suporte na transição</li>
        </ul>
      </section>

      <footer className="px-6 py-8 text-center text-gray-500 text-sm border-t border-gray-800">
        Sobre · Blog · Termos · Privacidade
      </footer>
    </main>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <span className="text-success text-3xl font-bold">{number}</span>
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-gray-400 mt-1">{children}</p>
    </div>
  );
}
