'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Business {
  id: string
  name: string
  sector: string
  canton: string
  status: string
  price_min: number | null
  price_max: number | null
  annual_revenue: number | null
  created_at: string
  description?: string | null
  employees?: number | null
  established_year?: number | null
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    imported: { bg: 'rgba(107,114,128,0.1)', color: '#9ca3af', border: 'rgba(107,114,128,0.2)' },
    pending_review: { bg: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: 'rgba(245,158,11,0.2)' },
    needs_editing: { bg: 'rgba(249,115,22,0.1)', color: '#fb923c', border: 'rgba(249,115,22,0.2)' },
    approved: { bg: 'rgba(16,185,129,0.1)', color: '#34d399', border: 'rgba(16,185,129,0.2)' },
    rejected: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
    published: { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
    archived: { bg: 'rgba(75,85,99,0.1)', color: '#6b7280', border: 'rgba(75,85,99,0.2)' },
  }
  const s = styles[status] ?? styles.imported
  return (
    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

const ALL_STATUSES = ['imported', 'pending_review', 'needs_editing', 'approved', 'rejected', 'published', 'archived']

export default function OpportunitiesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data, error: err } = await supabase
          .from('businesses')
          .select('id,name,sector,canton,status,price_min,price_max,annual_revenue,created_at,description,employees,established_year')
          .order('created_at', { ascending: false })
        if (err) throw err
        setBusinesses((data ?? []) as Business[])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = businesses.filter(b => statusFilter === 'all' || b.status === statusFilter)

  if (loading) return (
    <div className="p-8">
      <div className="h-8 w-56 rounded animate-pulse mb-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
      {[1,2,3,4].map(i => <div key={i} className="h-14 rounded-xl animate-pulse mb-3" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
    </div>
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#4b5563' }}>Admin</p>
        <h1 className="font-serif text-3xl font-bold">Opportunities</h1>
        <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>{filtered.length} businesses total</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl px-5 py-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
        </div>
      )}

      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
        >
          <option value="all">All statuses</option>
          {ALL_STATUSES.map(s => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-sm font-medium mb-1">No businesses found</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>Try a different status filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {['Name', 'Sector', 'Canton', 'Status', 'Price Range', 'Revenue', 'Created'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#4b5563' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
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
                      <td className="px-6 py-3 text-sm font-medium">{b.name}</td>
                      <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>{b.sector}</td>
                      <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>{b.canton}</td>
                      <td className="px-6 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>
                        {b.price_min && b.price_max ? `CHF ${(b.price_min/1000).toFixed(0)}k–${(b.price_max/1000).toFixed(0)}k` : '-'}
                      </td>
                      <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>
                        {b.annual_revenue ? `CHF ${(b.annual_revenue/1000).toFixed(0)}k` : '-'}
                      </td>
                      <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>
                        {new Date(b.created_at).toLocaleDateString('de-CH')}
                      </td>
                    </tr>
                    {expandedId === b.id && (
                      <tr key={`${b.id}-detail`} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td colSpan={7} className="px-6 pb-5">
                          <div className="rounded-xl p-5 mt-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#4b5563' }}>Business Details</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Employees</p><p>{b.employees ?? '-'}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Founded</p><p>{b.established_year ?? '-'}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>ID</p><p className="text-xs font-mono" style={{ color: '#6b7280' }}>{b.id}</p></div>
                            </div>
                            {b.description && (
                              <div>
                                <p className="text-xs mb-1" style={{ color: '#4b5563' }}>Description</p>
                                <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{b.description}</p>
                              </div>
                            )}
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
