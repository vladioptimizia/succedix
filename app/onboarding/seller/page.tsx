'use client';

import { useState } from 'react';
import Button from '@/components/Button';
import ScoreCircle from '@/components/ScoreCircle';
import { calculateSellerReadinessScore } from '@/lib/scoring';
import { SellerReadinessInput } from '@/lib/types';
import { createClient } from '@/lib/supabase/browser';

const STEPS = [
  { label: 'Dados Básicos', desc: 'Informações do negócio' },
  { label: 'Financeiro', desc: 'Receitas e margens' },
  { label: 'Motivo da Venda', desc: 'Contexto e confidencialidade' },
  { label: 'Operação', desc: 'Dependência e equipa' },
  { label: 'Documentação', desc: 'Organização legal e contábil' },
  { label: 'Descrição', desc: 'Apresente seu negócio' },
];

const initialState: SellerReadinessInput = {
  businessName: '', sector: 'cafe', canton: 'ZH', foundedYear: 2015,
  annualRevenue: 0, operatingMargin: 0, recurringClients: false,
  saleReason: 'aposentadoria', timeline: 'aberto', confidentiality: 'normal',
  ownerDependency: 50, hasDocumentedProcesses: false, teamSize: 0,
  documentsOrganized: false, accountingUpToDate: false, licensesValid: false, description: '',
};

export default function SellerOnboardingPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SellerReadinessInput>(initialState);
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  function update<K extends keyof SellerReadinessInput>(key: K, value: SellerReadinessInput[K]) {
    setData(prev => ({ ...prev, [key]: value }));
  }

  async function submit() {
    setSubmitting(true);
    const computed = calculateSellerReadinessScore(data);
    setScore(computed);

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user.id;

    if (userId) {
      // Save readiness score
      await fetch('/api/forms/seller-readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({
          establishedYear: data.foundedYear,
          documentationComplete: data.documentsOrganized && data.accountingUpToDate && data.licensesValid,
          annualRevenue: data.annualRevenue,
          recurringCustomers: data.recurringClients,
          ownerDependency: data.ownerDependency,
        }),
      });

      // Save business as draft
      await fetch('/api/businesses/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({
          name: data.businessName || 'Negócio sem nome',
          sector: data.sector,
          canton: data.canton,
          description: data.description,
          priceMin: Math.round(data.annualRevenue * 2),
          priceMax: Math.round(data.annualRevenue * 4),
          annualRevenue: data.annualRevenue,
          establishedYear: data.foundedYear,
        }),
      });
    }

    setSubmitting(false);
  }

  if (score !== null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 py-16">
        <p className="text-xs tracking-widest uppercase" style={{ color: '#4b5563' }}>Resultado</p>
        <h1 className="font-serif text-3xl font-bold text-center">Seller Readiness Score</h1>
        <ScoreCircle score={score} label="" size={180} />
        <p className="text-center max-w-sm leading-relaxed" style={{ color: '#6b7280' }}>
          {score >= 60
            ? 'Seu negócio está bem preparado para encontrar um sucessor. Submetemos um rascunho para revisão.'
            : 'Há pontos a melhorar antes de publicar. Um relatório detalhado pode ajudar.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="primary" className="px-8" onClick={() => window.location.href = '/sell'}>
            Publicar negócio completo
          </Button>
          <Button variant="ghost" className="px-8">Relatório detalhado — CHF 249</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className="hidden md:flex w-72 flex-col gap-2 p-8 pt-12 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#4b5563' }}>Prontidão do Vendedor</p>
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div
              key={s.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
              style={active ? { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' } : {}}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                style={
                  done ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' }
                  : active ? { background: '#10b981', color: '#fff' }
                  : { background: 'rgba(255,255,255,0.05)', color: '#4b5563' }
                }
              >
                {done ? '✓' : i + 1}
              </div>
              <div>
                <p className={`text-sm font-medium ${active ? 'text-white' : done ? 'text-gray-400' : 'text-gray-600'}`}>{s.label}</p>
                {active && <p className="text-xs mt-0.5" style={{ color: '#4b5563' }}>{s.desc}</p>}
              </div>
            </div>
          );
        })}
      </aside>

      {/* Content */}
      <main className="flex-1 px-6 md:px-12 py-12 max-w-xl">
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#4b5563' }}>Passo {step + 1} de {STEPS.length}</p>
          <h1 className="font-serif text-3xl font-bold">{STEPS[step].label}</h1>
          <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>{STEPS[step].desc}</p>
        </div>

        <div className="space-y-4">
          {step === 0 && (
            <>
              <Field label="Nome do negócio">
                <input className="input" value={data.businessName} onChange={e => update('businessName', e.target.value)} placeholder="Ex: Café da Praça" />
              </Field>
              <Field label="Sector">
                <select className="input" value={data.sector} onChange={e => update('sector', e.target.value as any)}>
                  <option value="cafe">Café</option>
                  <option value="restaurante">Restaurante</option>
                  <option value="varejo">Varejo</option>
                  <option value="servicos">Serviços</option>
                  <option value="saude">Saúde</option>
                  <option value="outro">Outro</option>
                </select>
              </Field>
              <Field label="Cantão">
                <select className="input" value={data.canton} onChange={e => update('canton', e.target.value as any)}>
                  {['ZH','BE','AG','ZG','VD','GE','TI','outro'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Ano de fundação">
                <input type="number" className="input" value={data.foundedYear} onChange={e => update('foundedYear', Number(e.target.value))} />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Faturamento anual (CHF)">
                <input type="number" className="input" value={data.annualRevenue} onChange={e => update('annualRevenue', Number(e.target.value))} />
              </Field>
              <Field label="Margem operacional (%)">
                <input type="number" className="input" value={data.operatingMargin} onChange={e => update('operatingMargin', Number(e.target.value))} />
              </Field>
              <Toggle label="Clientes recorrentes?" value={data.recurringClients} onChange={v => update('recurringClients', v)} />
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Razão da venda">
                <select className="input" value={data.saleReason} onChange={e => update('saleReason', e.target.value as any)}>
                  <option value="aposentadoria">Aposentadoria</option>
                  <option value="burnout">Burnout</option>
                  <option value="mudanca">Mudança</option>
                  <option value="outro">Outro</option>
                </select>
              </Field>
              <Field label="Timeline">
                <select className="input" value={data.timeline} onChange={e => update('timeline', e.target.value as any)}>
                  <option value="1_mes">Próximo mês</option>
                  <option value="3_6_meses">3-6 meses</option>
                  <option value="1_ano">1 ano</option>
                  <option value="aberto">Aberto</option>
                </select>
              </Field>
              <Field label="Confidencialidade">
                <select className="input" value={data.confidentiality} onChange={e => update('confidentiality', e.target.value as any)}>
                  <option value="muito_sigilo">Muito sigilo</option>
                  <option value="normal">Normal</option>
                  <option value="posso_contar">Posso contar</option>
                </select>
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field label={`Dependência do dono: ${data.ownerDependency}%`}>
                <input type="range" min={0} max={100} step={25} className="w-full accent-success" value={data.ownerDependency} onChange={e => update('ownerDependency', Number(e.target.value) as any)} />
              </Field>
              <Toggle label="Há processos documentados?" value={data.hasDocumentedProcesses} onChange={v => update('hasDocumentedProcesses', v)} />
              <Field label="Tamanho da equipa">
                <input type="number" className="input" value={data.teamSize} onChange={e => update('teamSize', Number(e.target.value))} />
              </Field>
            </>
          )}

          {step === 4 && (
            <>
              <Toggle label="Documentos organizados?" value={data.documentsOrganized} onChange={v => update('documentsOrganized', v)} />
              <Toggle label="Contabilidade em dia?" value={data.accountingUpToDate} onChange={v => update('accountingUpToDate', v)} />
              <Toggle label="Licenças válidas?" value={data.licensesValid} onChange={v => update('licensesValid', v)} />
            </>
          )}

          {step === 5 && (
            <Field label="Descreva seu negócio">
              <textarea
                className="input h-36 resize-none"
                value={data.description}
                onChange={e => update('description', e.target.value)}
                placeholder="Ex: Café familiar com 12 anos de história no centro de Zurique..."
              />
            </Field>
          )}
        </div>

        <div className="flex justify-between mt-10">
          <Button variant="secondary" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>Voltar</Button>
          {step < STEPS.length - 1 ? (
            <Button variant="primary" onClick={() => setStep(s => s + 1)}>Continuar →</Button>
          ) : (
            <Button variant="primary" onClick={submit} disabled={submitting}>
              {submitting ? 'A guardar...' : 'Ver meu score'}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm mb-1.5 font-medium" style={{ color: '#9ca3af' }}>{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm" style={{ color: '#9ca3af' }}>{label}</span>
      <div className="flex gap-2">
        <button onClick={() => onChange(true)} className="h-8 px-4 rounded-full text-xs font-medium transition-all"
          style={value ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}
        >Sim</button>
        <button onClick={() => onChange(false)} className="h-8 px-4 rounded-full text-xs font-medium transition-all"
          style={!value ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}
        >Não</button>
      </div>
    </div>
  );
}
