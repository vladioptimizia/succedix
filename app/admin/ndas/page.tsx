'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface NDA {
  id: string
  business_id?: string | null
  buyer_id?: string | null
  seller_id?: string | null
  status?: string | null
  signed_at?: string | null
  expiry?: string | null
  created_at: string
}

export default function NDAsPage() {
  const [ndas, setNdas] = useState<NDA[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('ndas')
          .select('id,business_id,buyer_id,seller_id,status,signed_at,expiry,created_at')
          .order('created_at', { ascending: false })
        setNdas((data ?? []) as NDA[])
      } catch {
        // table may not exist yet
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="p-8">
      <div className="h-8 w-32 rounded animate-pulse mb-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="h-48 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
    </div>
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#4b5563' }}>Admin</p>
        <h1 className="font-serif text-3xl font-bold">NDAs</h1>
        <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>Non-disclosure agreement tracking</p>
      </div>

      <div
        className="rounded-2xl p-5 mb-6 flex items-center gap-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p className="text-sm" style={{ color: '#6b7280' }}>NDA tracking module — document signing workflow</p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {['Business', 'Buyer', 'Seller', 'Status', 'Signed At', 'Expiry'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#4b5563' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ndas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm" style={{ color: '#6b7280' }}>
                    No NDAs yet — agreements will appear here once generated
                  </td>
                </tr>
              ) : (
                ndas.map(n => (
                  <tr key={n.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td className="px-6 py-3 text-xs font-mono" style={{ color: '#6b7280' }}>{n.business_id?.slice(0,8) ?? '—'}</td>
                    <td className="px-6 py-3 text-xs font-mono" style={{ color: '#6b7280' }}>{n.buyer_id?.slice(0,8) ?? '—'}</td>
                    <td className="px-6 py-3 text-xs font-mono" style={{ color: '#6b7280' }}>{n.seller_id?.slice(0,8) ?? '—'}</td>
                    <td className="px-6 py-3 text-sm" style={{ color: '#9ca3af' }}>{n.status ?? '—'}</td>
                    <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>{n.signed_at ? new Date(n.signed_at).toLocaleDateString('de-CH') : '—'}</td>
                    <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>{n.expiry ? new Date(n.expiry).toLocaleDateString('de-CH') : '—'}</td>
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
