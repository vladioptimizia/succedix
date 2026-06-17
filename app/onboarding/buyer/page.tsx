'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import ScoreCircle from '@/components/ScoreCircle'
import { calculateBuyerReadinessScore } from '@/lib/scoring'
import { BuyerReadinessInput, Sector } from '@/lib/types'
import { createClient } from '@/lib/supabase/browser'

const STEPS = [
  { label: 'Capital', desc: 'Capacidade de investimento' },
  { label: 'Sectores', desc: 'Áreas de interesse' },
  { label: 'Localização', desc: 'Região preferida' },
  { label: 'Envolvimento', desc: 'Dedicação ao negócio' },
  { label: 'Experiência', desc: 'Seu background' },
  { label: 'Prazo', desc: 'Timeline e idiomas' },
]

const SECTORS: { value: Sector; label: string }[] = [
  { value: 'cafe', label: 'Café' },
  { value: 'restaurante', label: 'Restaurante' },
  { value: 'varejo', label: 'Varejo' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'saude', label: 'Saúde' },
  { value: 'outro', label: 'Outro' },
]

const initialState: BuyerReadinessInput = {
  capitalMin: 0, capitalMax: 0, capitalSource: 'proprio',
  sectorsInterested: [], openToOtherSectors: false,
  regionMain: 'ZH', radiusKm: 20, exploreOtherRegions: false,
  involvementType: 'unknown', hoursAvailablePerWeek: 0,
  experienceBackground: '', timelineMonths: 6, languages: [],
}

export default function BuyerOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<BuyerReadinessInput>(initialState)
  const [score, setScore] = useState<number | null>(null)
  const supabase = createClient()

  function update<K extends keyof BuyerReadinessInput>(key: K, value: BuyerReadinessInput[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  function toggleSector(sector: Sector) {
    setData(prev => ({
      ...prev,
      sectorsInterested: prev.sectorsInterested.includes(sector)
        ? prev.sectorsInterested.filter(s => s !== sector)
        : [...prev.sectorsInterested, sector],
    }))
  }

  async function submit() {
    const computed = calculateBuyerReadinessScore(data)
    setScore(computed)

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('succedix_buyer_profile', JSON.stringify(data))
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user.id) {
      await fetch('/api/forms/buyer-readiness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': session.user.id,
        },
        body: JSON.stringify(data),
      })
    }
  }

  if (score !== null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-6 py-16">
        <p className="text-xs tracking-widest uppercase" style={{ color: '#4b5563' }}>Resultado</p>
        <h1 className="font-serif text-3xl font-bold text-center">Buyer Readiness Score</h1>
        <ScoreCircle score={score} label="" size={180} />
        <p className="text-center max-w-sm leading-relaxed" style={{ color: '#6b7280' }}>
          {score >= 60
            ? 'Seu perfil está pronto para explorar oportunidades de aquisição.'
            : 'Recomendamos refinar seu perfil para encontrar melhores matches.'}
        </p>
        <Button variant="primary" onClick={() => router.push('/discover')} className="px-10">
          Explorar negócios →
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <aside
        className="hidden md:flex w-72 flex-col gap-2 p-8 pt-12 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#4b5563' }}>Prontidão do Comprador</p>
        {STEPS.map((s, i) => {
          const done = i < step
          const active = i === step
          return (
            <div
              key={s.label}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
              style={active ? { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' } : {}}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                style={done
                  ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' }
                  : active
                    ? { background: '#10b981', color: '#fff' }
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
          )
        })}
      </aside>

      <main className="flex-1 px-6 md:px-12 py-12 max-w-xl">
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#4b5563' }}>Passo {step + 1} de {STEPS.length}</p>
          <h1 className="font-serif text-3xl font-bold">{STEPS[step].label}</h1>
          <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>{STEPS[step].desc}</p>
        </div>

        <div className="space-y-4">
          {step === 0 && (
            <>
              <Field label="Capital mínimo (CHF)">
                <input type="number" className="input" value={data.capitalMin} onChange={e => update('capitalMin', Number(e.target.value))} />
              </Field>
              <Field label="Capital máximo (CHF)">
                <input type="number" className="input" value={data.capitalMax} onChange={e => update('capitalMax', Number(e.target.value))} />
              </Field>
              <Field label="Fonte do capital">
                <select className="input" value={data.capitalSource} onChange={e => update('capitalSource', e.target.value as any)}>
                  <option value="proprio">Capital próprio</option>
                  <option value="credito">Crédito</option>
                  <option value="combinado">Combinado</option>
                  <option value="investor">Investidor</option>
                </select>
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <p className="text-sm mb-3" style={{ color: '#6b7280' }}>Selecione um ou mais sectores</p>
              <div className="flex flex-wrap gap-2">
                {SECTORS.map(s => {
                  const selected = data.sectorsInterested.includes(s.value)
                  return (
                    <button
                      key={s.value}
                      onClick={() => toggleSector(s.value)}
                      className="h-9 px-4 rounded-full text-sm font-medium transition-all"
                      style={selected
                        ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' }
                        : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }
                      }
                    >{s.label}</button>
                  )
                })}
              </div>
              <Toggle label="Aberto a outros sectores?" value={data.openToOtherSectors} onChange={v => update('openToOtherSectors', v)} />
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Cantão principal">
                <select className="input" value={data.regionMain} onChange={e => update('regionMain', e.target.value as any)}>
                  {['ZH','BE','AG','ZG','VD','GE','TI','outro'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label={`Raio máximo: ${data.radiusKm} km`}>
                <input type="range" min={10} max={100} step={10} className="w-full accent-success" value={data.radiusKm} onChange={e => update('radiusKm', Number(e.target.value))} />
              </Field>
              <Toggle label="Explorar outras regiões?" value={data.exploreOtherRegions} onChange={v => update('exploreOtherRegions', v)} />
            </>
          )}

          {step === 3 && (
            <>
              <Field label="Tipo de envolvimento">
                <select className="input" value={data.involvementType} onChange={e => update('involvementType', e.target.value as any)}>
                  <option value="operator">Operar ativamente</option>
                  <option value="investor">Investidor passivo</option>
                  <option value="unknown">Não sei</option>
                </select>
              </Field>
              <Field label="Horas disponíveis por semana">
                <input type="number" className="input" value={data.hoursAvailablePerWeek} onChange={e => update('hoursAvailablePerWeek', Number(e.target.value))} />
              </Field>
            </>
          )}

          {step === 4 && (
            <Field label="Background de experiência">
              <input className="input" value={data.experienceBackground} onChange={e => update('experienceBackground', e.target.value)} placeholder="Ex: Gestão bancária, 15 anos" />
            </Field>
          )}

          {step === 5 && (
            <>
              <Field label="Quando deseja comprar? (meses)">
                <input type="number" className="input" value={data.timelineMonths} onChange={e => update('timelineMonths', Number(e.target.value))} />
              </Field>
              <Field label="Idiomas (separados por vírgula)">
                <input className="input" value={data.languages.join(', ')} onChange={e => update('languages', e.target.value.split(',').map(l => l.trim()).filter(Boolean))} placeholder="Português, Inglês, Alemão" />
              </Field>
            </>
          )}
        </div>

        <div className="flex justify-between mt-10">
          <Button variant="secondary" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>Voltar</Button>
          {step < STEPS.length - 1 ? (
            <Button variant="primary" onClick={() => setStep(s => s + 1)}>Continuar →</Button>
          ) : (
            <Button variant="primary" onClick={submit}>Ver meu score</Button>
          )}
        </div>
      </main>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm mb-1.5 font-medium" style={{ color: '#9ca3af' }}>{label}</span>
      {children}
    </label>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm" style={{ color: '#9ca3af' }}>{label}</span>
      <div className="flex gap-2">
        <button onClick={() => onChange(true)} className="h-8 px-4 rounded-full text-xs font-medium transition-all" style={value ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>Sim</button>
        <button onClick={() => onChange(false)} className="h-8 px-4 rounded-full text-xs font-medium transition-all" style={!value ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>Não</button>
      </div>
    </div>
  )
}
