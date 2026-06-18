'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Business {
  id: string
  name: string
  sector: string
  canton: string
  annual_revenue: number | null
  created_at: string
  status: string
  description?: string | null
  price_min?: number | null
  price_max?: number | null
  employees?: number | null
  founded_year?: number | null
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; border: string; label: string }> = {
    imported: { bg: 'rgba(107,114,128,0.1)', color: '#9ca3af', border: 'rgba(107,114,128,0.2)', label: 'imported' },
    pending_review: { bg: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: 'rgba(245,158,11,0.2)', label: 'pending review' },
    needs_editing: { bg: 'rgba(249,115,22,0.1)', color: '#fb923c', border: 'rgba(249,115,22,0.2)', label: 'needs editing' },
  }
  const s = map[status] ?? map.imported
  return (
    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </span>
  )
}

export default function ImportQueuePage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: err } = await supabase
        .from('businesses')
        .select('id,name,sector,canton,annual_revenue,created_at,status,description,price_min,price_max,employees,founded_year')
        .in('status', ['imported', 'pending_review', 'needs_editing'])
        .order('created_at', { ascending: false })
      if (err) throw err
      setBusinesses((data ?? []) as Business[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id: string, status: string) {
    setActionLoading(id)
    const supabase = createClient()
    await supabase.from('businesses').update({ status }).eq('id', id)
    await load()
    setActionLoading(null)
  }

  async function bulkUpdate(status: string) {
    const supabase = createClient()
    await Promise.all([...selected].map(id => supabase.from('businesses').update({ status }).eq('id', id)))
    setSelected(new Set())
    await load()
  }

  const filtered = businesses.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  if (loading) return (
    <div className="p-4 sm:p-8">
      <div className="h-8 w-56 rounded animate-pulse mb-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
      {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl animate-pulse mb-3" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
    </div>
  )

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#4b5563' }}>Admin</p>
        <h1 className="font-serif text-3xl font-bold">Import Queue</h1>
        <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>{filtered.length} businesses in queue</p>
      </div>

      {/* Info banner */}
      <div className="mb-6 rounded-xl px-5 py-3 flex items-center gap-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p className="text-sm" style={{ color: '#6ee7b7' }}>This queue receives businesses imported via n8n automation pipelines</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl px-5 py-3" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded-xl text-sm flex-1 min-w-48 outline-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl text-sm outline-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
        >
          <option value="all">All statuses</option>
          <option value="imported">Imported</option>
          <option value="pending_review">Pending Review</option>
          <option value="needs_editing">Needs Editing</option>
        </select>
        {selected.size > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => bulkUpdate('approved')}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}
            >
              Bulk Approve ({selected.size})
            </button>
            <button
              onClick={() => bulkUpdate('rejected')}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
            >
              Bulk Reject ({selected.size})
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-sm font-medium mb-1">No businesses in queue</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>Businesses imported via n8n will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      onChange={e => setSelected(e.target.checked ? new Set(filtered.map(b => b.id)) : new Set())}
                      checked={selected.size === filtered.length && filtered.length > 0}
                    />
                  </th>
                  {['Business Name', 'Sector', 'Canton', 'Revenue', 'Imported At', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#4b5563' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <>
                    <tr
                      key={b.id}
                      style={{ borderBottom: expandedId === b.id ? 'none' : '1px solid rgba(255,255,255,0.03)' }}
                    >
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.has(b.id)} onChange={() => toggleSelect(b.id)} />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{b.name}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#6b7280' }}>{b.sector}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#6b7280' }}>{b.canton}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#6b7280' }}>
                        {b.annual_revenue ? `CHF ${(b.annual_revenue / 1000).toFixed(0)}k` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: '#6b7280' }}>
                        {new Date(b.created_at).toLocaleDateString('de-CH')}
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 flex-wrap">
                          <button
                            onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                            className="px-2.5 py-1 rounded-lg text-xs"
                            style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.08)' }}
                          >
                            {expandedId === b.id ? 'Close' : 'Review'}
                          </button>
                          <button
                            onClick={() => updateStatus(b.id, 'approved')}
                            disabled={actionLoading === b.id}
                            className="px-2.5 py-1 rounded-lg text-xs"
                            style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(b.id, 'needs_editing')}
                            disabled={actionLoading === b.id}
                            className="px-2.5 py-1 rounded-lg text-xs"
                            style={{ background: 'rgba(249,115,22,0.08)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.2)' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => updateStatus(b.id, 'rejected')}
                            disabled={actionLoading === b.id}
                            className="px-2.5 py-1 rounded-lg text-xs"
                            style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === b.id && (
                      <tr key={`${b.id}-detail`} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td colSpan={8} className="px-6 pb-5">
                          <div className="rounded-xl p-5 mt-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <p className="text-xs uppercase tracking-wider mb-4" style={{ color: '#4b5563' }}>Business Details</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Name</p><p>{b.name}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Sector</p><p>{b.sector || '-'}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Canton</p><p>{b.canton || '-'}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Status</p><StatusBadge status={b.status} /></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Annual Revenue</p><p>{b.annual_revenue ? `CHF ${(b.annual_revenue / 1000).toFixed(0)}k` : '-'}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Price Range</p><p>{b.price_min && b.price_max ? `CHF ${(b.price_min/1000).toFixed(0)}k – ${(b.price_max/1000).toFixed(0)}k` : '-'}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Employees</p><p>{b.employees ?? '-'}</p></div>
                              <div><p className="text-xs mb-1" style={{ color: '#4b5563' }}>Founded</p><p>{b.founded_year ?? '-'}</p></div>
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
