'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/browser'
import { useTranslation } from '@/lib/i18n/LocaleContext'

type Tab = 'login' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useTranslation()
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
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout — o servidor demorou demasiado a responder. Tenta novamente.')), 15000)
      )
      const { data, error } = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        timeout,
      ])
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      const userType = data.user?.user_metadata?.user_type
      // Admin vai direto para o painel
      if (data.user?.email === 'vladimir.m.f95@gmail.com') {
        router.push('/admin')
      } else if (userType === 'vendor') {
        router.push('/onboarding/seller')
      } else if (userType === 'buyer') {
        router.push('/onboarding/buyer')
      } else {
        router.push('/discover')
      }
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Erro inesperado ao entrar.')
      setLoading(false)
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout — o Supabase não respondeu em 12s. Verifica se o projeto está ativo (não pausado).')), 12000)
      )
      const { data: authData, error: signupError } = await Promise.race([
        supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName, user_type: userType } },
        }),
        timeout,
      ])

      if (signupError) {
        setError(signupError.message)
        setLoading(false)
        return
      }

      if (authData.user) {
        await supabase.from('users').upsert({
          id: authData.user.id,
          email,
          user_type: userType,
          full_name: fullName || null,
        })
        setSuccess('Conta criada! A redirecionar...')
        router.push(userType === 'buyer' ? '/onboarding/buyer' : '/onboarding/seller')
        router.refresh()
      } else {
        setError('Sem dados de utilizador na resposta. Verifica a confirmação de email no Supabase.')
        setLoading(false)
      }
    } catch (err: any) {
      setError(err?.message || 'Erro inesperado ao criar conta.')
      setLoading(false)
    }
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
            {(['login', 'signup'] as Tab[]).map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => { setTab(tabKey); setError(null); setSuccess(null) }}
                className="flex-1 h-9 text-sm font-medium transition-all rounded-xl"
                style={tab === tabKey
                  ? { background: 'rgba(255,255,255,0.08)', color: '#f9fafb' }
                  : { color: '#6b7280' }
                }
              >
                {tabKey === 'login' ? t.login.tabLogin : t.login.tabSignup}
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
                  <input className="input" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
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
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </Field>
            <Field label={t.login.passwordPlaceholder}>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
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
