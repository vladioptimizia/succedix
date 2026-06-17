'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Seller {
  id: string
  email: string
  full_name: string | null
  user_type: string
  created_at: string
  canton?: string | null
  business_count?: number
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()

        const { data: users, error: usersErr } = await supabase
          .from('users')
          .select('id,email,full_name,user_type,created_at')
          .in('user_type', ['seller', 'vendor'])
          .order('created_at', { ascending: false })

        if (usersErr) throw usersErr

        const userList = (users ?? []) as Seller[]

        // Enrich with business counts and canton — wrap each in try/catch
        const enriched = await Promise.all(userList.map(async (u) => {
          let business_count = 0
          let canton: string | null = null

          try {
            const { count } = await supabase
              .from('businesses')
              .select('id', { count: 'exact', head: true })
              .eq('vendor_id', u.id)
            business_count = count ?? 0
          } catch {
            // ignore
          }

          try {
            const { data: profile } = await supabase
              .from('seller_profiles')
              .select('canton')
              .eq('user_id', u.id)
              .maybeSingle()
            canton = (profile as { canton?: string } | null)?.canton ?? null
          } catch {
            // table may not exist
          }

          return { ...u, business_count, canton }
        }))

        setSellers(enriched)
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
        <h1 className="font-serif text-3xl font-bold">Sellers</h1>
        <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>{sellers.length} registered sellers</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl px-5 py-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {sellers.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-sm font-medium mb-1">No sellers yet</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>Sellers will appear here once they register</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {['Name', 'Email', 'Canton', 'Businesses', 'Joined'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#4b5563' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sellers.map(s => (
                  <>
                    <tr
                      key={s.id}
                      onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                      className="cursor-pointer transition-all"
                      style={{
                        borderBottom: expandedId === s.id ? 'none' : '1px solid rgba(255,255,255,0.03)',
                        background: expandedId === s.id ? 'rgba(255,255,255,0.02)' : 'transparent',
                      }}
                    >
                      <td className="px-6 py-3 text-sm font-medium">{s.full_name ?? '—'}</td>
                      <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>{s.email}</td>
                      <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>{s.canton ?? '—'}</td>
                      <td className="px-6 py-3">
                        <span className="text-sm font-medium" style={{ color: s.business_count ? '#10b981' : '#6b7280' }}>
                          {s.business_count ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>
                        {new Date(s.created_at).toLocaleDateString('de-CH')}
                      </td>
                    </tr>
                    {expandedId === s.id && (
                      <tr key={`${s.id}-detail`} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td colSpan={5} className="px-6 pb-5">
                          <div className="rounded-xl p-5 mt-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#4b5563' }}>Seller Profile</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Email</p><p>{s.email}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>User type</p><p>{s.user_type}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Joined</p><p>{new Date(s.created_at).toLocaleDateString('de-CH')}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Businesses</p><p>{s.business_count ?? 0}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>ID</p><p className="text-xs font-mono" style={{ color: '#6b7280' }}>{s.id}</p></div>
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
