'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Business {
  id: string
  name: string
  sector: string
  canton: string
  city: string
  price_min: number
  price_max: number
  annual_revenue: number
  created_at: string
  vendor_id: string
}

export default function AdminPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const supabase = createClient()

  async function fetchPending() {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/admin/businesses', {
      headers: { 'x-user-id': session?.user.id ?? '' },
    })
    if (res.status === 403) { setForbidden(true); setLoading(false); return }
    const json = await res.json()
    setBusinesses(json.businesses ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchPending() }, [])

  async function approve(id: string) {
    setActionLoading(id)
    const { data: { session } } = await supabase.auth.getSession()
    await fetch(`/api/admin/businesses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-id': session?.user.id ?? '' },
      body: JSON.stringify({ status: 'approved' }),
    })
    setBusinesses(prev => prev.filter(b => b.id !== id))
    setActionLoading(null)
  }

  async function reject(id: string) {
    setActionLoading(id)
    const { data: { session } } = await supabase.auth.getSession()
    await fetch(`/api/admin/businesses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-user-id': session?.user.id ?? '' },
      body: JSON.stringify({ status: 'archived' }),
    })
    setBusinesses(prev => prev.filter(b => b.id !== id))
    setActionLoading(null)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-success border-t-transparent animate-spin" />
    </div>
  )

  if (forbidden) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl font-serif font-bold mb-2">Acesso negado</p>
        <p className="text-sm" style={{ color: '#6b7280' }}>Esta página é restrita a administradores.</p>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#4b5563' }}>Painel</p>
          <h1 className="font-serif text-3xl font-bold">Aprovação de Negócios</h1>
          <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>
            {businesses.length} negócio{businesses.length !== 1 ? 's' : ''} aguardando aprovação
          </p>
        </div>

        {businesses.length === 0 ? (
          <div
            className="rounded-2xl p-12 flex flex-col items-center gap-3 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-4xl">✓</span>
            <p className="font-medium">Nenhum negócio pendente</p>
            <p className="text-sm" style={{ color: '#6b7280' }}>Todos os negócios foram revisados.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {businesses.map((b) => (
              <div
                key={b.id}
                className="rounded-xl p-5 flex items-start justify-between gap-4"
                style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold">{b.name}</h2>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}
                    >
                      pendente
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm" style={{ color: '#6b7280' }}>
                    <span>{b.sector}</span>
                    <span>{b.city}, {b.canton}</span>
                    <span>CHF {(b.price_min / 1000).toFixed(0)}k – {(b.price_max / 1000).toFixed(0)}k</span>
                    {b.annual_revenue > 0 && <span>Rec. anual CHF {(b.annual_revenue / 1000).toFixed(0)}k</span>}
                  </div>
                  <p className="text-xs mt-1" style={{ color: '#374151' }}>
                    Submetido em {new Date(b.created_at).toLocaleDateString('pt-PT')}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => reject(b.id)}
                    disabled={actionLoading === b.id}
                    className="h-9 px-4 rounded-full text-xs font-medium transition-all"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                  >
                    Rejeitar
                  </button>
                  <button
                    onClick={() => approve(b.id)}
                    disabled={actionLoading === b.id}
                    className="h-9 px-4 rounded-full text-xs font-medium transition-all"
                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}
                  >
                    {actionLoading === b.id ? '...' : 'Aprovar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
