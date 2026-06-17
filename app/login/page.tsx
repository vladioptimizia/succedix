'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/browser'
import { useTranslation } from '@/lib/i18n/LocaleContext'

type Tab = 'login' | 'signup'

export default function LoginPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [userType, setUserType] = useState<'buyer' | 'vendor'>('buyer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/discover')
    router.refresh()
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, userType, fullName }),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setLoading(false)
      return
    }
    setSuccess(t.login.successMsg)
    setTab('login')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl font-semibold">
            Succedix<span className="text-success">.</span>
          </Link>
          <p className="mt-2 text-sm" style={{ color: '#6b7280' }}>{t.login.subtitle}</p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {(['login', 'signup'] as Tab[]).map((tab_option) => (
              <button
                key={tab_option}
                onClick={() => { setTab(tab_option); setError(null); setSuccess(null) }}
                className="flex-1 h-9 text-sm font-medium transition-all rounded-xl"
                style={tab === tab_option
                  ? { background: 'rgba(255,255,255,0.08)', color: '#f9fafb' }
                  : { color: '#6b7280' }
                }
              >
                {tab_option === 'login' ? t.login.tabLogin : t.login.tabSignup}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
              {success}
            </div>
          )}

          <form onSubmit={tab === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {tab === 'signup' && (
              <>
                <Field label={t.login.namePlaceholder}>
                  <input className="input" type="text" placeholder={t.login.namePlaceholder} value={fullName} onChange={e => setFullName(e.target.value)} required />
                </Field>
                <Field label={t.login.profileLabel}>
                  <div className="flex gap-2">
                    {([['buyer', t.login.profileBuyer], ['vendor', t.login.profileSeller]] as const).map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setUserType(val)}
                        className="flex-1 h-10 rounded-lg text-sm font-medium transition-all"
                        style={userType === val
                          ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' }
                          : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }
                        }
                      >{label}</button>
                    ))}
                  </div>
                </Field>
              </>
            )}

            <Field label={t.login.emailPlaceholder}>
              <input className="input" type="email" placeholder={t.login.emailPlaceholder} value={email} onChange={e => setEmail(e.target.value)} required />
            </Field>
            <Field label={t.login.passwordPlaceholder}>
              <input className="input" type="password" placeholder={t.login.passwordPlaceholder} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-full font-medium text-sm transition-all mt-2"
              style={{ background: '#10b981', color: '#fff', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? t.login.loadingBtn : tab === 'login' ? t.login.loginBtn : t.login.signupBtn}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium mb-1.5" style={{ color: '#6b7280' }}>{label}</span>
      {children}
    </label>
  )
}
