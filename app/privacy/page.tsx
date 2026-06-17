'use client';

import { useState } from 'react';
import Link from 'next/link';

type Section = 'overview' | 'data-collected' | 'usage' | 'sharing' | 'retention' | 'rights' | 'cookies' | 'contact';

interface NavItem {
  id: Section;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',       label: 'Visão Geral',         icon: '🛡️' },
  { id: 'data-collected', label: 'Dados Recolhidos',    icon: '📋' },
  { id: 'usage',          label: 'Utilização dos Dados', icon: '⚙️' },
  { id: 'sharing',        label: 'Partilha de Dados',   icon: '🔗' },
  { id: 'retention',      label: 'Retenção',            icon: '🗓️' },
  { id: 'rights',         label: 'Os Seus Direitos',    icon: '✅' },
  { id: 'cookies',        label: 'Cookies',             icon: '🍪' },
  { id: 'contact',        label: 'Contacto',            icon: '📬' },
];

function SectionBlock({ id, title, children }: { id: Section; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: '#f9fafb' }}>{title}</h2>
      <div className="flex flex-col gap-4 text-gray-400 leading-relaxed text-sm">
        {children}
      </div>
    </section>
  );
}

function DataTable({ rows }: { rows: { tipo: string; exemplos: string; finalidade: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <th className="text-left px-4 py-3 text-gray-300 font-medium">Tipo de Dado</th>
            <th className="text-left px-4 py-3 text-gray-300 font-medium">Exemplos</th>
            <th className="text-left px-4 py-3 text-gray-300 font-medium">Finalidade</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <td className="px-4 py-3 text-gray-200 font-medium whitespace-nowrap">{r.tipo}</td>
              <td className="px-4 py-3 text-gray-400">{r.exemplos}</td>
              <td className="px-4 py-3 text-gray-400">{r.finalidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RightCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl p-5" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)' }}>
      <p className="font-medium text-emerald-400 mb-1">{title}</p>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

export default function PrivacyPage() {
  const [active, setActive] = useState<Section>('overview');

  const handleScroll = (id: Section) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12 text-center">
          <span
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Última actualização: Junho 2026
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Política de Privacidade
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            A Succedix está comprometida com a protecção dos seus dados pessoais, em conformidade com a{' '}
            <span className="text-gray-300 font-medium">nLPD suíça</span> e o{' '}
            <span className="text-gray-300 font-medium">RGPD europeu</span>.
          </p>
        </div>

        <div className="flex gap-8 items-start">

          {/* Sidebar nav */}
          <aside className="hidden lg:flex flex-col gap-1 w-56 shrink-0 sticky top-24">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                style={{
                  background: active === item.id ? 'rgba(16,185,129,0.1)' : 'transparent',
                  border: active === item.id ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
                  color: active === item.id ? '#6ee7b7' : '#6b7280',
                }}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <div className="mt-6 px-3">
              <Link
                href="mailto:privacidade@succedix.ch"
                className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Contactar DPO →
              </Link>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 flex flex-col gap-14">

            <SectionBlock id="overview" title="Visão Geral">
              <p>
                A Succedix Sàrl (&quot;Succedix&quot;, &quot;nós&quot;) opera a plataforma de sucessão empresarial disponível em succedix.ch.
                Esta Política de Privacidade explica como recolhemos, utilizamos, partilhamos e protegemos as suas informações quando
                utiliza os nossos serviços.
              </p>
              <p>
                Ao criar uma conta ou utilizar a plataforma, concorda com as práticas descritas neste documento.
                Se não concordar, por favor não utilize os nossos serviços.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mt-2">
                {[
                  { icon: '🇨🇭', title: 'Lei Suíça', desc: 'Regemo-nos pela nova Lei de Protecção de Dados (nLPD) em vigor desde Setembro de 2023.' },
                  { icon: '🇪🇺', title: 'RGPD', desc: 'Aplicamos os princípios do RGPD para utilizadores da União Europeia.' },
                  { icon: '🔒', title: 'Minimização', desc: 'Recolhemos apenas os dados estritamente necessários para prestar o serviço.' },
                ].map((c, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-2xl mb-2">{c.icon}</div>
                    <p className="font-medium text-gray-200 mb-1 text-sm">{c.title}</p>
                    <p className="text-xs text-gray-500">{c.desc}</p>
                  </div>
                ))}
              </div>
            </SectionBlock>

            <SectionBlock id="data-collected" title="Dados Recolhidos">
              <p>Recolhemos dados em diferentes momentos da sua interacção com a plataforma:</p>
              <DataTable rows={[
                {
                  tipo: 'Identificação',
                  exemplos: 'Nome completo, endereço de e-mail',
                  finalidade: 'Criação e gestão de conta',
                },
                {
                  tipo: 'Perfil de Comprador',
                  exemplos: 'Capital disponível, sectores de interesse, região, experiência',
                  finalidade: 'Matching inteligente com negócios',
                },
                {
                  tipo: 'Perfil de Vendedor',
                  exemplos: 'Nome do negócio, sector, canton, receitas, dependência do proprietário',
                  finalidade: 'Avaliação de preparação e listagem',
                },
                {
                  tipo: 'Interacções',
                  exemplos: 'Swipes (like/pass/save), negócios guardados',
                  finalidade: 'Melhoria das recomendações',
                },
                {
                  tipo: 'Dados Técnicos',
                  exemplos: 'Endereço IP, tipo de browser, sistema operativo',
                  finalidade: 'Segurança e diagnóstico técnico',
                },
                {
                  tipo: 'Cookies',
                  exemplos: 'Sessão autenticada, preferências de UI',
                  finalidade: 'Manter sessão activa, personalização',
                },
              ]} />
              <p className="text-xs text-gray-500">
                Não recolhemos categorias especiais de dados (saúde, religião, origem étnica, etc.) nem dados de menores de 18 anos.
              </p>
            </SectionBlock>

            <SectionBlock id="usage" title="Utilização dos Dados">
              <p>Utilizamos os seus dados exclusivamente para as seguintes finalidades, com base jurídica indicada:</p>
              <div className="flex flex-col gap-3">
                {[
                  { base: 'Contrato',       finalidade: 'Prestar o serviço de matching comprador-vendedor' },
                  { base: 'Contrato',       finalidade: 'Calcular e apresentar scores de prontidão (Seller/Buyer Readiness)' },
                  { base: 'Contrato',       finalidade: 'Gerir conta, autenticação e limites de utilização diária' },
                  { base: 'Interesse Legítimo', finalidade: 'Melhorar algoritmos de matching com dados agregados e anonimizados' },
                  { base: 'Interesse Legítimo', finalidade: 'Prevenir fraude e garantir segurança da plataforma' },
                  { base: 'Consentimento', finalidade: 'Enviar comunicações de marketing (apenas se optar por receber)' },
                  { base: 'Obrigação Legal', finalidade: 'Cumprir obrigações fiscais e regulatórias suíças' },
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full shrink-0 mt-0.5"
                      style={{
                        background: r.base === 'Contrato' ? 'rgba(16,185,129,0.1)' : r.base === 'Consentimento' ? 'rgba(99,102,241,0.12)' : 'rgba(245,158,11,0.1)',
                        color: r.base === 'Contrato' ? '#6ee7b7' : r.base === 'Consentimento' ? '#a5b4fc' : '#fcd34d',
                        border: `1px solid ${r.base === 'Contrato' ? 'rgba(16,185,129,0.2)' : r.base === 'Consentimento' ? 'rgba(99,102,241,0.2)' : 'rgba(245,158,11,0.2)'}`,
                      }}
                    >
                      {r.base}
                    </span>
                    <span>{r.finalidade}</span>
                  </div>
                ))}
              </div>
            </SectionBlock>

            <SectionBlock id="sharing" title="Partilha de Dados">
              <p>
                A Succedix <strong className="text-gray-200">não vende</strong> os seus dados pessoais a terceiros.
                Partilhamos informações apenas nas seguintes circunstâncias:
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { quem: 'Supabase (Suíça/UE)', o_que: 'Base de dados e autenticação', motivo: 'Prestador de infraestrutura — contrato de processamento de dados (DPA) em vigor' },
                  { quem: 'Stripe', o_que: 'Dados de pagamento', motivo: 'Processamento de subscrições — certificado PCI-DSS Nível 1' },
                  { quem: 'Vercel', o_que: 'Logs de acesso técnico', motivo: 'Hospedagem da aplicação — DPA em vigor, dados na UE/Suíça' },
                  { quem: 'Compradores Verificados', o_que: 'Detalhes do negócio (progressivos)', motivo: 'Revelação gradual apenas após match e confirmação de interesse mútuo' },
                  { quem: 'Autoridades Legais', o_que: 'Dados solicitados por mandado', motivo: 'Cumprimento de obrigação legal — apenas mediante exigência formal' },
                ].map((r, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <span className="font-medium text-gray-200 text-sm">{r.quem}</span>
                      <span className="text-xs text-gray-500 shrink-0">{r.o_que}</span>
                    </div>
                    <p className="text-xs text-gray-500">{r.motivo}</p>
                  </div>
                ))}
              </div>
              <p>
                Qualquer novo prestador de serviços é sujeito a avaliação de conformidade antes de aceder a dados pessoais.
              </p>
            </SectionBlock>

            <SectionBlock id="retention" title="Retenção de Dados">
              <p>Conservamos os seus dados pelo tempo necessário para cada finalidade:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { tipo: 'Conta activa', prazo: 'Enquanto a conta existir' },
                  { tipo: 'Dados de perfil (comprador/vendedor)', prazo: '3 anos após última actividade' },
                  { tipo: 'Histórico de interacções (swipes)', prazo: '12 meses' },
                  { tipo: 'Dados de transacção', prazo: '10 anos (obrigação fiscal suíça)' },
                  { tipo: 'Logs técnicos e de segurança', prazo: '90 dias' },
                  { tipo: 'Backups de base de dados', prazo: '30 dias em retenção rotativa' },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="text-sm text-gray-300">{r.tipo}</span>
                    <span className="text-xs text-emerald-400 font-medium shrink-0 ml-4">{r.prazo}</span>
                  </div>
                ))}
              </div>
              <p>
                Após o período de retenção, os dados são eliminados de forma segura ou anonimizados irreversivelmente
                para fins estatísticos.
              </p>
            </SectionBlock>

            <SectionBlock id="rights" title="Os Seus Direitos">
              <p>
                Ao abrigo da nLPD suíça e do RGPD, tem os seguintes direitos sobre os seus dados pessoais.
                Para exercer qualquer direito, contacte-nos em{' '}
                <Link href="mailto:privacidade@succedix.ch" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  privacidade@succedix.ch
                </Link>
                . Respondemos no prazo de <strong className="text-gray-200">30 dias</strong>.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <RightCard title="Direito de Acesso" description="Pode solicitar uma cópia completa de todos os dados pessoais que detemos sobre si." />
                <RightCard title="Direito de Rectificação" description="Pode corrigir dados incorrectos ou incompletos directamente no seu perfil ou por pedido." />
                <RightCard title="Direito ao Apagamento" description='Pode solicitar a eliminação dos seus dados ("direito a ser esquecido"), sujeito a obrigações legais.' />
                <RightCard title="Direito de Portabilidade" description="Pode receber os seus dados num formato estruturado e legível por máquina (JSON/CSV)." />
                <RightCard title="Direito de Oposição" description="Pode opor-se ao tratamento baseado em interesse legítimo, incluindo marketing directo." />
                <RightCard title="Direito de Limitação" description="Pode solicitar que suspendamos temporariamente o tratamento dos seus dados em determinadas circunstâncias." />
              </div>
              <p>
                Se considerar que o tratamento dos seus dados viola a lei, tem o direito de apresentar uma reclamação junto do{' '}
                <strong className="text-gray-200">PFPDT</strong> (Comissário Federal Suíço de Protecção de Dados e Informação).
              </p>
            </SectionBlock>

            <SectionBlock id="cookies" title="Cookies e Rastreamento">
              <p>
                Utilizamos apenas cookies essenciais ao funcionamento da plataforma. Não utilizamos cookies de rastreamento
                de terceiros nem publicidade comportamental.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { nome: 'sb-access-token', tipo: 'Essencial', descricao: 'Mantém a sessão autenticada via Supabase Auth', expira: 'Sessão / 1 hora' },
                  { nome: 'sb-refresh-token', tipo: 'Essencial', descricao: 'Renova automaticamente a sessão sem novo login', expira: '60 dias' },
                  { nome: 'succedix_buyer_profile', tipo: 'Funcional', descricao: 'Cache local do perfil de comprador (localStorage)', expira: 'Permanente até eliminar' },
                ].map((c, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-3 mb-1">
                      <code className="text-xs text-emerald-400 font-mono">{c.nome}</code>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: c.tipo === 'Essencial' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                          color: c.tipo === 'Essencial' ? '#6ee7b7' : '#fcd34d',
                          border: `1px solid ${c.tipo === 'Essencial' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
                        }}
                      >
                        {c.tipo}
                      </span>
                      <span className="text-xs text-gray-600 ml-auto">{c.expira}</span>
                    </div>
                    <p className="text-xs text-gray-500">{c.descricao}</p>
                  </div>
                ))}
              </div>
              <p>
                Por não utilizarmos cookies de rastreamento, não é necessário apresentar um banner de consentimento de cookies.
                Os cookies essenciais são necessários para o funcionamento da plataforma e não podem ser desactivados.
              </p>
            </SectionBlock>

            <SectionBlock id="contact" title="Contacto e DPO">
              <p>Para exercer os seus direitos, apresentar uma queixa ou obter esclarecimentos sobre esta política:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: '📬', title: 'E-mail de Privacidade', value: 'privacidade@succedix.ch', href: 'mailto:privacidade@succedix.ch' },
                  { icon: '🏢', title: 'Morada', value: 'Succedix Sàrl, Suíça', href: null },
                  { icon: '⏱️', title: 'Prazo de Resposta', value: 'Máximo 30 dias úteis', href: null },
                  { icon: '🏛️', title: 'Autoridade de Supervisão', value: 'PFPDT — pfpdt.admin.ch', href: 'https://www.pfpdt.admin.ch' },
                ].map((c, i) => (
                  <div key={i} className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-2xl mb-2">{c.icon}</div>
                    <p className="text-xs text-gray-500 mb-1">{c.title}</p>
                    {c.href ? (
                      <Link href={c.href} className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium">
                        {c.value}
                      </Link>
                    ) : (
                      <p className="text-gray-200 text-sm font-medium">{c.value}</p>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Esta política pode ser actualizada periodicamente. Notificamo-lo por e-mail em caso de alterações materiais.
                A data da última revisão está indicada no topo desta página.
              </p>
            </SectionBlock>

          </div>
        </div>
      </div>
    </main>
  );
}
