'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Transition {
  id: string
  business_id?: string | null
  business_name?: string | null
  stage?: string | null
  progress?: number | null
  created_at: string
}

function StageBadge({ stage }: { stage: string | null | undefined }) {
  if (!stage) return <span style={{ color: '#4b5563' }}>—</span>
  const map: Record<string, { color: string; bg: string }> = {
    negotiation: { color: '#fbbf24', bg: 'rgba(245,158,11,0.1)' },
    due_diligence: { color: '#60a5fa', bg: 'rgba(59,130,246,0.1)' },
    signing: { color: '#34d399', bg: 'rgba(16,185,129,0.1)' },
    completed: { color: '#a78bfa', bg: 'rgba(139,92,246,0.1)' },
  }
  const s = map[stage] ?? { color: '#9ca3af', bg: 'rgba(107,114,128,0.1)' }
  return (
    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}30` }}>
      {stage.replace(/_/g, ' ')}
    </span>
  )
}

export default function TransitionsPage() {
  const [transitions, setTransitions] = useState<Transition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('transitions')
          .select('id,business_id,business_name,stage,progress,created_at')
          .order('created_at', { ascending: false })
        setTransitions((data ?? []) as Transition[])
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
      <div className="h-8 w-44 rounded animate-pulse mb-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="h-40 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
      </div>
    </div>
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#4b5563' }}>Admin</p>
        <h1 className="font-serif text-3xl font-bold">Transitions</h1>
        <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>Active business handover oversight</p>
      </div>

      {transitions.length === 0 ? (
        <div
          className="rounded-2xl p-16 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5" className="mx-auto mb-4">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
          <p className="font-medium mb-1">No active transitions</p>
          <p className="text-sm" style={{ color: '#6b7280' }}>Completed deals will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transitions.map(t => (
            <div
              key={t.id}
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="font-medium text-sm">{t.business_name ?? `Business ${t.business_id?.slice(0,8) ?? t.id.slice(0,8)}`}</p>
                <StageBadge stage={t.stage} />
              </div>
              <p className="text-xs mb-2" style={{ color: '#6b7280' }}>
                Started {new Date(t.created_at).toLocaleDateString('de-CH')}
              </p>
              {t.progress != null && (
                <div>
                  <div className="flex justify-between text-xs mb-1" style={{ color: '#6b7280' }}>
                    <span>Progress</span>
                    <span>{t.progress}%</span>
                  </div>
                  <div className="rounded-full overflow-hidden h-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${t.progress}%`, background: '#10b981' }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
