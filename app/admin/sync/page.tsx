'use client'

import { useState } from 'react'

interface SyncEvent {
  id: string
  type: string
  status: string
  timestamp: string
  message?: string
}

export default function SyncPage() {
  const [copied, setCopied] = useState(false)
  const [events] = useState<SyncEvent[]>([]) // empty by default — real data from n8n webhooks

  const webhookUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/n8n/webhook`
    : 'https://your-domain.com/api/n8n/webhook'

  function copyWebhook() {
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#4b5563' }}>Admin</p>
          <h1 className="font-serif text-3xl font-bold">Sync</h1>
          <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>n8n automation pipeline monitoring</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all hover:opacity-80"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Connection status */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 mb-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <polyline points="16 17 21 12 16 7"/><path d="M21 12H9"/>
              <path d="M3 12a9 9 0 009 9"/><path d="M3 12a9 9 0 019-9"/>
            </svg>
            <h2 className="font-semibold text-sm">n8n Integration</h2>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ background: '#fbbf24', boxShadow: '0 0 6px #fbbf24' }}
            />
            <span className="text-sm" style={{ color: '#fbbf24' }}>Not configured</span>
          </div>
          <p className="text-xs mt-2" style={{ color: '#4b5563' }}>
            Connect your n8n instance to enable automated business imports
          </p>
        </div>

        {/* Webhook URL */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 mb-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
            <h2 className="font-semibold text-sm">Webhook Endpoint</h2>
          </div>
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2 mb-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <code className="text-xs flex-1 truncate" style={{ color: '#9ca3af' }}>{webhookUrl}</code>
            <button
              onClick={copyWebhook}
              className="flex-shrink-0 px-2.5 py-1 rounded-lg text-xs transition-all"
              style={{
                background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.06)',
                color: copied ? '#34d399' : '#9ca3af',
                border: `1px solid ${copied ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs" style={{ color: '#4b5563' }}>Use this URL as the n8n HTTP Request node target</p>
        </div>
      </div>

      {/* Instructions */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h2 className="font-semibold text-sm mb-4">How to connect n8n</h2>
        <ol className="space-y-3">
          {[
            'In n8n, create a new workflow and add a trigger node (e.g. Schedule or Webhook)',
            'Add an HTTP Request node with POST method pointing to the webhook URL above',
            'Map your data fields to the Succedix business schema (name, sector, canton, etc.)',
            'Add an Authorization header: X-N8N-Secret with your shared secret',
            'Activate the workflow — imported businesses will appear in the Import Queue',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', marginTop: '1px' }}
              >
                {i + 1}
              </span>
              <span style={{ color: '#9ca3af' }}>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Recent sync events */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="font-semibold text-sm">Recent Sync Events</h2>
        </div>
        {events.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm" style={{ color: '#6b7280' }}>No sync events yet</p>
            <p className="text-xs mt-1" style={{ color: '#4b5563' }}>Events will appear here once n8n starts sending data</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {['Type', 'Status', 'Message', 'Timestamp'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#4b5563' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map(e => (
                  <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td className="px-6 py-3 text-sm">{e.type}</td>
                    <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>{e.status}</td>
                    <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>{e.message ?? '—'}</td>
                    <td className="px-6 py-3 text-sm" style={{ color: '#6b7280' }}>{new Date(e.timestamp).toLocaleDateString('de-CH')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
