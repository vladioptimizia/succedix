'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Match {
  id: string
  buyer_id?: string
  business_id?: string
  fit_score?: number | null
  status?: string | null
  created_at: string
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        // Try matches table first, fallback to interactions
        const { data, error } = await supabase
          .from('matches')
          .select('id,buyer_id,business_id,fit_score,status,created_at')
          .order('created_at', { ascending: false })
          .limit(50)

        if (!error && data && data.length > 0) {
          setMatches(data as Match[])
        } else {
          const { data: interactions } = await supabase
            .from('interactions')
            .select('id,buyer_id,business_id,created_at')
            .order('created_at', { ascending: false })
            .limit(50)
          setMatches((interactions ?? []) as Match[])
        }
      } catch {
        // show empty state
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="p-8">
      <div className="h-8 w-40 rounded animate-pulse mb-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="h-48 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
    </div>
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#4b5563' }}>Admin</p>
        <h1 className="font-serif text-3xl font-bold">Match Engine</h1>
        <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>Buyer-business compatibility scoring</p>
      </div>

      {matches.length === 0 && (
        <div
          className="rounded-2xl p-8 mb-6 flex items-center gap-4"
          style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
          </svg>
          <p className="text-sm" style={{ color: '#6ee7b7' }}>
            Match engine coming soon — compatibility scoring will appear here
          </p>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {['Buyer', 'Business', 'Fit Score', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#4b5563' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-sm" style={{ color: '#6b7280' }}>
                    No matches yet — compatibility scoring will appear here once the engine is configured
                  </td>
                </tr>
              ) : (
                matches.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td className="px-6 py-3 text-sm font-mono text-xs" style={{ color: '#6b7280' }}>{m.buyer_id?.slice(0,8) ?? '—'}</td>
                    <td className="px-6 py-3 text-sm font-mono text-xs" style={{ color: '#6b7280' }}>{m.business_id?.slice(0,8) ?? '—'}</td>
                    <td className="px-6 py-3 text-sm">{m.fit_score != null ? `${m.fit_score}%` : '—'}</td>
                    <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>{m.status ?? '—'}</td>
                    <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>{new Date(m.created_at).toLocaleDateString('de-CH')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
