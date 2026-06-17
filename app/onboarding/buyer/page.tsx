'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import ScoreCircle from '@/components/ScoreCircle'
import { calculateBuyerReadinessScore } from '@/lib/scoring'
import { BuyerReadinessInput, Sector } from '@/lib/types'
import { createClient } from '@/lib/supabase/browser'
import { useTranslation } from '@/lib/i18n/LocaleContext'

const SECTOR_VALUES: Sector[] = ['cafe', 'restaurante', 'varejo', 'servicos', 'saude', 'outro']

const initialState: BuyerReadinessInput = {
  capitalMin: 0, capitalMax: 0, capitalSource: 'proprio',
  sectorsInterested: [], openToOtherSectors: false,
  regionMain: 'ZH', radiusKm: 20, exploreOtherRegions: false,
  involvementType: 'unknown', hoursAvailablePerWeek: 0,
  experienceBackground: '', timelineMonths: 6, languages: [],
}

export default function BuyerOnboardingPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const STEPS = t.buyerOnboarding.steps
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
        <p className="text-xs tracking-widest uppercase" style={{ color: '#4b5563' }}>Ergebnis</p>
        <h1 className="font-serif text-3xl font-bold text-center">{t.buyerOnboarding.result.title}</h1>
        <ScoreCircle score={score} label="" size={180} />
        <p className="text-center max-w-sm leading-relaxed" style={{ color: '#6b7280' }}>
          {score >= 60 ? t.buyerOnboarding.result.desc : t.buyerOnboarding.result.descLow}
        </p>
        <Button variant="primary" onClick={() => router.push('/discover')} className="px-10">
          {t.buyerOnboarding.result.cta}
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
        <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#4b5563' }}>{t.buyerOnboarding.pageTitle}</p>
        {STEPS.map((s, i) => {
          const done = i < step
          const active = i === step
          return (
            <div
              key={s.title}
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
                <p className={`text-sm font-medium ${active ? 'text-white' : done ? 'text-gray-400' : 'text-gray-600'}`}>{s.title}</p>
                {active && <p className="text-xs mt-0.5" style={{ color: '#4b5563' }}>{s.subtitle}</p>}
              </div>
            </div>
          )
        })}
      </aside>

      <main className="flex-1 px-6 md:px-12 py-12 max-w-xl">
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#4b5563' }}>Schritt {step + 1} von {STEPS.length}</p>
          <h1 className="font-serif text-3xl font-bold">{STEPS[step].title}</h1>
          <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>{STEPS[step].subtitle}</p>
        </div>

        <div className="space-y-4">
          {step === 0 && (
            <>
              <Field label={t.buyerOnboarding.fields.capitalMin}>
                <input type="number" className="input" value={data.capitalMin} onChange={e => update('capitalMin', Number(e.target.value))} />
              </Field>
              <Field label={t.buyerOnboarding.fields.capitalMax}>
                <input type="number" className="input" value={data.capitalMax} onChange={e => update('capitalMax', Number(e.target.value))} />
              </Field>
              <Field label={t.buyerOnboarding.fields.capitalSource}>
                <select className="input" value={data.capitalSource} onChange={e => update('capitalSource', e.target.value as any)}>
                  {(['proprio','credito','combinado','investor'] as const).map((val, idx) => (
                    <option key={val} value={val}>{t.buyerOnboarding.fields.capitalSources[idx]}</option>
                  ))}
                </select>
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <p className="text-sm mb-3" style={{ color: '#6b7280' }}>{t.buyerOnboarding.fields.sectorsLabel}</p>
              <div className="flex flex-wrap gap-2">
                {SECTOR_VALUES.map((val, idx) => {
                  const selected = data.sectorsInterested.includes(val)
                  return (
                    <button
                      key={val}
                      onClick={() => toggleSector(val)}
                      className="h-9 px-4 rounded-full text-sm font-medium transition-all"
                      style={selected
                        ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' }
                        : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }
                      }
                    >{t.buyerOnboarding.fields.sectors[idx]}</button>
                  )
                })}
              </div>
              <Toggle label={t.buyerOnboarding.fields.openToOtherSectors} value={data.openToOtherSectors} onChange={v => update('openToOtherSectors', v)} yes={t.buyerOnboarding.yes} no={t.buyerOnboarding.no} />
            </>
          )}

          {step === 2 && (
            <>
              <Field label={t.buyerOnboarding.fields.canton}>
                <select className="input" value={data.regionMain} onChange={e => update('regionMain', e.target.value as any)}>
                  {['ZH','BE','AG','ZG','VD','GE','TI','outro'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label={`${t.buyerOnboarding.fields.radius}: ${data.radiusKm} km`}>
                <input type="range" min={10} max={100} step={10} className="w-full accent-success" value={data.radiusKm} onChange={e => update('radiusKm', Number(e.target.value))} />
              </Field>
              <Toggle label={t.buyerOnboarding.fields.exploreOtherRegions} value={data.exploreOtherRegions} onChange={v => update('exploreOtherRegions', v)} yes={t.buyerOnboarding.yes} no={t.buyerOnboarding.no} />
            </>
          )}

          {step === 3 && (
            <>
              <Field label={t.buyerOnboarding.fields.involvementType}>
                <select className="input" value={data.involvementType} onChange={e => update('involvementType', e.target.value as any)}>
                  {(['operator','investor','unknown'] as const).map((val, idx) => (
                    <option key={val} value={val}>{t.buyerOnboarding.fields.involvementTypes[idx]}</option>
                  ))}
                </select>
              </Field>
              <Field label={t.buyerOnboarding.fields.hoursPerWeek}>
                <input type="number" className="input" value={data.hoursAvailablePerWeek} onChange={e => update('hoursAvailablePerWeek', Number(e.target.value))} />
              </Field>
            </>
          )}

          {step === 4 && (
            <Field label={t.buyerOnboarding.fields.experienceBackground}>
              <input className="input" value={data.experienceBackground} onChange={e => update('experienceBackground', e.target.value)} placeholder={t.buyerOnboarding.fields.experiencePlaceholder} />
            </Field>
          )}

          {step === 5 && (
            <>
              <Field label={t.buyerOnboarding.fields.timelineMonths}>
                <input type="number" className="input" value={data.timelineMonths} onChange={e => update('timelineMonths', Number(e.target.value))} />
              </Field>
              <Field label={t.buyerOnboarding.fields.languages}>
                <input className="input" value={data.languages.join(', ')} onChange={e => update('languages', e.target.value.split(',').map(l => l.trim()).filter(Boolean))} placeholder={t.buyerOnboarding.fields.languagesPlaceholder} />
              </Field>
            </>
          )}
        </div>

        <div className="flex justify-between mt-10">
          <Button variant="secondary" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>{t.buyerOnboarding.back}</Button>
          {step < STEPS.length - 1 ? (
            <Button variant="primary" onClick={() => setStep(s => s + 1)}>{t.buyerOnboarding.next}</Button>
          ) : (
            <Button variant="primary" onClick={submit}>{t.buyerOnboarding.submit}</Button>
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

function Toggle({ label, value, onChange, yes, no }: { label: string; value: boolean; onChange: (v: boolean) => void; yes: string; no: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm" style={{ color: '#9ca3af' }}>{label}</span>
      <div className="flex gap-2">
        <button onClick={() => onChange(true)} className="h-8 px-4 rounded-full text-xs font-medium transition-all" style={value ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>{yes}</button>
        <button onClick={() => onChange(false)} className="h-8 px-4 rounded-full text-xs font-medium transition-all" style={!value ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>{no}</button>
      </div>
    </div>
  )
}
