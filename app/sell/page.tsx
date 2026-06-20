'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import { createClient } from '@/lib/supabase/browser'
import { useTranslation } from '@/lib/i18n/LocaleContext'
import { SECTOR_VALUES, CANTON_VALUES } from '@/lib/taxonomy'

interface FormData {
  name: string
  sector: string
  canton: string
  city: string
  description: string
  priceMin: number
  priceMax: number
  annualRevenue: number
  establishedYear: number
}

const initial: FormData = {
  name: '', sector: 'cafe', canton: 'ZH', city: '',
  description: '', priceMin: 0, priceMax: 0,
  annualRevenue: 0, establishedYear: new Date().getFullYear() - 5,
}

export default function SellPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const STEPS = t.sell.steps
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(initial)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  async function submit() {
    setLoading(true)
    setError(null)
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/businesses/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': session?.user.id ?? '',
      },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) { setError(json.error); setLoading(false); return }
    setDone(true)
    setLoading(false)
  }

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 py-16">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M6 14l6 6L22 8" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="font-serif text-3xl font-bold text-center">{t.sell.success.title}</h1>
      <p className="text-center max-w-sm leading-relaxed" style={{ color: '#6b7280' }}>
        {t.sell.success.desc}
      </p>
      <Button variant="primary" onClick={() => router.push('/')}>{t.sell.success.back}</Button>
    </div>
  )

  return (
    <div className="min-h-screen flex">
      <aside
        className="hidden md:flex w-72 flex-col gap-2 p-8 pt-12 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#4b5563' }}>{t.sell.pageTitle}</p>
        {STEPS.map((s, i) => {
          const isDone = i < step
          const active = i === step
          return (
            <div
              key={s.title}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
              style={active ? { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' } : {}}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                style={isDone
                  ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' }
                  : active
                    ? { background: '#10b981', color: '#fff' }
                    : { background: 'rgba(255,255,255,0.05)', color: '#4b5563' }
                }
              >
                {isDone ? '✓' : i + 1}
              </div>
              <div>
                <p className={`text-sm font-medium ${active ? 'text-white' : isDone ? 'text-gray-400' : 'text-gray-600'}`}>{s.title}</p>
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

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            {error}
          </div>
        )}

        <div className="space-y-4">
          {step === 0 && (
            <>
              <Field label={t.sell.fields.businessName}>
                <input className="input" value={data.name} onChange={e => update('name', e.target.value)} placeholder={t.sell.fields.businessNamePlaceholder} />
              </Field>
              <Field label={t.sell.fields.sector}>
                <div className="flex flex-wrap gap-2">
                  {SECTOR_VALUES.map((val, idx) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => update('sector', val)}
                      className="h-9 px-4 rounded-full text-sm font-medium transition-all"
                      style={data.sector === val
                        ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' }
                        : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }
                      }
                    >{t.sell.fields.sectors[idx]}</button>
                  ))}
                </div>
              </Field>
              <Field label={t.sell.fields.foundedYear}>
                <input type="number" className="input" value={data.establishedYear} onChange={e => update('establishedYear', Number(e.target.value))} />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label={t.sell.fields.canton}>
                <select className="input" value={data.canton} onChange={e => update('canton', e.target.value)}>
                  {CANTON_VALUES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label={t.sell.fields.city}>
                <input className="input" value={data.city} onChange={e => update('city', e.target.value)} placeholder={t.sell.fields.cityPlaceholder} />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <Field label={t.sell.fields.priceMin}>
                <input type="number" className="input" value={data.priceMin} onChange={e => update('priceMin', Number(e.target.value))} />
              </Field>
              <Field label={t.sell.fields.priceMax}>
                <input type="number" className="input" value={data.priceMax} onChange={e => update('priceMax', Number(e.target.value))} />
              </Field>
              <Field label={t.sell.fields.annualRevenue}>
                <input type="number" className="input" value={data.annualRevenue} onChange={e => update('annualRevenue', Number(e.target.value))} />
              </Field>
            </>
          )}

          {step === 3 && (
            <Field label={t.sell.fields.description}>
              <textarea
                className="input h-40 resize-none"
                value={data.description}
                onChange={e => update('description', e.target.value)}
                placeholder={t.sell.fields.descriptionPlaceholder}
              />
            </Field>
          )}
        </div>

        <div className="flex justify-between mt-10">
          <Button variant="secondary" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>{t.sell.back}</Button>
          {step < STEPS.length - 1 ? (
            <Button variant="primary" onClick={() => setStep(s => s + 1)}>{t.sell.next}</Button>
          ) : (
            <Button variant="primary" onClick={submit} disabled={loading}>
              {loading ? t.sell.loading : t.sell.submit}
            </Button>
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
