'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { label: 'Overview', href: '/admin', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'Import Queue', href: '/admin/import-queue', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg> },
  { label: 'Opportunities', href: '/admin/opportunities', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label: 'Sellers', href: '/admin/sellers', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { label: 'Buyers', href: '/admin/buyers', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { label: 'Matches', href: '/admin/matches', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> },
  { label: 'NDAs', href: '/admin/ndas', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
  { label: 'Transitions', href: '/admin/transitions', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> },
  { label: 'Sync', href: '/admin/sync', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 17 21 12 16 7"/><path d="M21 12H9"/><path d="M3 12a9 9 0 009 9"/><path d="M3 12a9 9 0 019-9"/></svg> },
]

export default function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string) => href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <div className="min-h-screen flex" style={{ background: '#080808', color: '#ffffff' }}>
      <aside
        className="fixed left-0 top-0 h-full flex flex-col z-40 transition-all duration-200"
        style={{ width: collapsed ? '64px' : '256px', background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2 px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: '64px' }}>
          {!collapsed && <span className="font-serif text-lg font-semibold">Succedix<span style={{ color: '#10b981' }}>.</span></span>}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto p-1.5 rounded-lg transition-all hover:opacity-70" style={{ background: 'rgba(255,255,255,0.04)', color: '#6b7280' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {collapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 mx-2 mb-0.5 rounded-xl transition-all"
                style={{ padding: collapsed ? '10px 13px' : '10px 14px', background: active ? 'rgba(16,185,129,0.1)' : 'transparent', borderLeft: active ? '3px solid #10b981' : '3px solid transparent', color: active ? '#ffffff' : '#6b7280' }}
                title={collapsed ? item.label : undefined}
              >
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
              {email[0].toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-medium truncate">{email}</p>
                <p className="text-xs" style={{ color: '#4b5563' }}>Administrator</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 transition-all duration-200" style={{ marginLeft: collapsed ? '64px' : '256px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
