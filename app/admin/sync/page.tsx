'use client'

export default function SyncPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#4b5563' }}>Admin</p>
        <h1 className="font-serif text-3xl font-bold">n8n Sync</h1>
        <p className="mt-1 text-sm" style={{ color: '#6b7280' }}>Automatisierungsintegration mit n8n</p>
      </div>

      {/* Status card */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚙️</span>
            <h2 className="font-semibold text-lg">n8n Integration</h2>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: '#6b7280' }}
            />
            <span className="text-sm" style={{ color: '#6b7280' }}>Nicht konfiguriert</span>
          </div>
        </div>
        <p className="text-sm" style={{ color: '#6b7280' }}>
          n8n ermöglicht die automatische Synchronisation von Inseraten aus externen Quellen.
          Konfigurieren Sie den Webhook, um die Integration zu aktivieren.
        </p>
      </div>

      {/* Webhook URL */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h3 className="font-semibold mb-3">Webhook URL</h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            readOnly
            placeholder="https://your-n8n.com/webhook/succedix"
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-mono"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#9ca3af',
            }}
          />
          <button
            className="h-10 px-4 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}
          >
            Testen
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: '#4b5563' }}>
          Tragen Sie hier die Webhook-URL Ihrer n8n-Instanz ein.
        </p>
      </div>

      {/* Instructions */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h3 className="font-semibold mb-4">Einrichtungsanleitung</h3>
        <ol className="flex flex-col gap-3">
          {[
            { step: '1', text: 'n8n deployen – Starten Sie eine n8n-Instanz (Cloud oder Self-hosted)' },
            { step: '2', text: 'Workflow erstellen – Importieren Sie den Succedix Import-Workflow aus dem Template' },
            { step: '3', text: 'Webhook URL eintragen – Fügen Sie die generierte Webhook-URL oben ein' },
            { step: '4', text: 'Verbindung testen – Klicken Sie auf "Testen" um die Integration zu prüfen' },
          ].map(item => (
            <li key={item.step} className="flex items-start gap-4">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}
              >
                {item.step}
              </span>
              <p className="text-sm" style={{ color: '#9ca3af' }}>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Recent events */}
      <div>
        <h3 className="font-semibold mb-4">Letzte Ereignisse</h3>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Zeitpunkt', 'Ereignis', 'Status', 'Details'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: '#4b5563' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center" style={{ color: '#4b5563' }}>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">📡</span>
                    <p className="text-sm">Noch keine Ereignisse</p>
                    <p className="text-xs">Ereignisse erscheinen hier nach der ersten n8n Synchronisation.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
