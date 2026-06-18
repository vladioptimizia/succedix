'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/browser'

interface Business {
  id: string
  name: string
  sector: string
  canton: string
  status: string
  created_at: string
}

interface Stats {
  total: number
  pending: number
  buyers: number
  matches: number
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; border: string }> = {
    imported: { bg: 'rgba(107,114,128,0.1)', color: '#9ca3af', border: 'rgba(107,114,128,0.2)' },
    pending_review: { bg: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: 'rgba(245,158,11,0.2)' },
    approved: { bg: 'rgba(16,185,129,0.1)', color: '#34d399', border: 'rgba(16,185,129,0.2)' },
    rejected: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'rgba(239,68,68,0.2)' },
    published: { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: 'rgba(59,130,246,0.2)' },
  }
  const s = styles[status] ?? styles.imported
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {status.replace('_', ' ')}
    </span>
  )
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, buyers: 0, matches: 0 })
  const [recent, setRecent] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()

        const [totalRes, pendingRes, buyersRes, matchesRes, recentRes] = await Promise.all([
          supabase.from('businesses').select('id', { count: 'exact', head: true }),
          supabase.from('businesses').select('id', { count: 'exact', head: true }).in('status', ['pending_review', 'imported']),
          supabase.from('users').select('id', { count: 'exact', head: true }).eq('user_type', 'buyer'),
          supabase.from('interactions').select('id', { count: 'exact', head: true }),
          supabase.from('businesses').select('id,name,sector,canton,status,created_at').order('created_at', { ascending: false }).limit(10),
        ])

        setStats({
          total: totalRes.count ?? 0,
          pending: pendingRes.count ?? 0,
          buyers: buyersRes.count ?? 0,
          matches: matchesRes.count ?? 0,
        })
        setRecent((recentRes.data ?? []) as Business[])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statCards = [
    { label: 'Total Businesses', value: stats.total, color: '#ffffff' },
    { label: 'Pending Review', value: stats.pending, color: '#fbbf24' },
    { label: 'Active Buyers', value: stats.buyers, color: '#60a5fa' },
    { label: 'Total Matches', value: stats.matches, color: '#10b981' },
  ]

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <div className="h-4 w-24 rounded animate-pulse mb-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="h-8 w-48 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded-2xl p-4 sm:p-6 animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', height: '100px' }} />
          ))}
        </div>
        <div className="rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', height: '300px' }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-8">
        <div className="rounded-2xl p-6 sm:p-8" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
          <p className="text-sm" style={{ color: '#f87171' }}>Error loading dashboard: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#4b5563' }}>Admin Panel</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">Overview</h1>
          <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>Succedix platform dashboard</p>
        </div>
        <Link
          href="/admin/import-queue"
          className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all hover:opacity-90 whitespace-nowrap"
          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}
        >
          Process Queue
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-4 sm:p-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-xs mb-2 sm:mb-3" style={{ color: '#6b7280' }}>{card.label}</p>
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="px-4 sm:px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="font-semibold text-sm">Recent Businesses</h2>
        </div>
        {recent.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <p className="text-sm" style={{ color: '#6b7280' }}>No businesses yet</p>
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="sm:hidden divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              {recent.map((b) => (
                <div key={b.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-medium leading-snug">{b.name}</p>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-xs" style={{ color: '#6b7280' }}>{b.sector} · {b.canton} · {new Date(b.created_at).toLocaleDateString('de-CH')}</p>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {['Name', 'Sector', 'Canton', 'Status', 'Created'].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#4b5563' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td className="px-6 py-3 text-sm font-medium">{b.name}</td>
                      <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>{b.sector}</td>
                      <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>{b.canton}</td>
                      <td className="px-6 py-3"><StatusBadge status={b.status} /></td>
                      <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>{new Date(b.created_at).toLocaleDateString('de-CH')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
