'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Buyer {
  id: string
  email: string
  full_name: string | null
  created_at: string
  capital_min?: number | null
  capital_max?: number | null
  readiness_score?: number | null
}

function ReadinessBadge({ score }: { score: number | null | undefined }) {
  if (score == null) return <span style={{ color: '#4b5563' }}>—</span>
  const color = score >= 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171'
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      {score}/100
    </span>
  )
}

export default function BuyersPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()

        const { data: users, error: usersErr } = await supabase
          .from('users')
          .select('id,email,full_name,created_at')
          .eq('user_type', 'buyer')
          .order('created_at', { ascending: false })

        if (usersErr) throw usersErr

        const userList = (users ?? []) as Buyer[]

        const enriched = await Promise.all(userList.map(async (u) => {
          try {
            const { data: profile } = await supabase
              .from('buyer_profiles')
              .select('capital_min,capital_max,readiness_score')
              .eq('user_id', u.id)
              .maybeSingle()

            if (profile) {
              const p = profile as { capital_min?: number; capital_max?: number; readiness_score?: number }
              return { ...u, capital_min: p.capital_min ?? null, capital_max: p.capital_max ?? null, readiness_score: p.readiness_score ?? null }
            }
          } catch {
            // buyer_profiles may not exist
          }
          return { ...u, capital_min: null, capital_max: null, readiness_score: null }
        }))

        setBuyers(enriched)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="p-8">
      <div className="h-8 w-40 rounded animate-pulse mb-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
      {[1,2,3].map(i => <div key={i} className="h-14 rounded-xl animate-pulse mb-3" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
    </div>
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#4b5563' }}>Admin</p>
        <h1 className="font-serif text-3xl font-bold">Buyers</h1>
        <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>{buyers.length} registered buyers</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl px-5 py-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {buyers.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-sm font-medium mb-1">No buyers yet</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>Buyers will appear here once they register</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {['Name', 'Email', 'Capital Range', 'Readiness', 'Joined'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#4b5563' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {buyers.map(b => (
                  <>
                    <tr
                      key={b.id}
                      onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                      className="cursor-pointer transition-all"
                      style={{
                        borderBottom: expandedId === b.id ? 'none' : '1px solid rgba(255,255,255,0.03)',
                        background: expandedId === b.id ? 'rgba(255,255,255,0.02)' : 'transparent',
                      }}
                    >
                      <td className="px-6 py-3 text-sm font-medium">{b.full_name ?? '—'}</td>
                      <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>{b.email}</td>
                      <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>
                        {b.capital_min && b.capital_max
                          ? `CHF ${(b.capital_min/1000).toFixed(0)}k – ${(b.capital_max/1000).toFixed(0)}k`
                          : '—'}
                      </td>
                      <td className="px-6 py-3"><ReadinessBadge score={b.readiness_score} /></td>
                      <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>
                        {new Date(b.created_at).toLocaleDateString('de-CH')}
                      </td>
                    </tr>
                    {expandedId === b.id && (
                      <tr key={`${b.id}-detail`} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td colSpan={5} className="px-6 pb-5">
                          <div className="rounded-xl p-5 mt-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#4b5563' }}>Buyer Profile</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Email</p><p>{b.email}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Joined</p><p>{new Date(b.created_at).toLocaleDateString('de-CH')}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Capital Min</p><p>{b.capital_min ? `CHF ${(b.capital_min/1000).toFixed(0)}k` : '—'}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Capital Max</p><p>{b.capital_max ? `CHF ${(b.capital_max/1000).toFixed(0)}k` : '—'}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Readiness Score</p><ReadinessBadge score={b.readiness_score} /></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>ID</p><p className="text-xs font-mono" style={{ color: '#6b7280' }}>{b.id}</p></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
