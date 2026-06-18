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
  { label: 'NDAs', href: '/admin/ndas', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { label: 'Transitions', href: '/admin/transitions', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> },
  { label: 'Sync', href: '/admin/sync', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 17 21 12 16 7"/><path d="M21 12H9"/></svg> },
]

// Bottom nav shows first 5 most used items on mobile
const bottomNav = navItems.slice(0, 5)

export default function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (href: string) => href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <div className="min-h-screen flex" style={{ background: '#080808', color: '#ffffff' }}>

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-full flex-col z-40 transition-all duration-200"
        style={{ width: collapsed ? '64px' : '256px', background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2 px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: '64px' }}>
          {!collapsed && <span className="font-serif text-lg font-semibold">Succedix<span style={{ color: '#10b981' }}>.</span></span>}
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto p-1.5 rounded-lg hover:opacity-70" style={{ background: 'rgba(255,255,255,0.04)', color: '#6b7280' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {collapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 mx-2 mb-0.5 rounded-xl transition-all"
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

      {/* ── Mobile top bar ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14" style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
        <span className="font-serif text-base font-semibold">Succedix<span style={{ color: '#10b981' }}>.</span> <span className="text-xs font-sans font-normal" style={{ color: '#6b7280' }}>Admin</span></span>
        <button onClick={() => setMobileMenuOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </header>

      {/* ── Mobile drawer overlay ── */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)' }} />
          <nav className="absolute top-0 left-0 bottom-0 w-72 flex flex-col" style={{ background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 h-14" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="font-serif text-base font-semibold">Succedix<span style={{ color: '#10b981' }}>.</span></span>
              <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-3">
              {navItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 mx-2 mb-0.5 rounded-xl transition-all"
                    style={{ padding: '12px 14px', background: active ? 'rgba(16,185,129,0.1)' : 'transparent', borderLeft: active ? '3px solid #10b981' : '3px solid transparent', color: active ? '#ffffff' : '#9ca3af' }}
                  >
                    <span style={{ flexShrink: 0 }}>{item.icon}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>{email[0].toUpperCase()}</div>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{email}</p>
                  <p className="text-xs" style={{ color: '#4b5563' }}>Administrator</p>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* ── Main content ── */}
      <main
        className="flex-1 transition-all duration-200"
        style={{ marginLeft: 0, paddingBottom: '72px' }}
      >
        {/* desktop margin */}
        <div className="hidden md:block" style={{ marginLeft: collapsed ? '64px' : '256px' }}>
          <div className="pt-0">{children}</div>
        </div>
        {/* mobile: top bar + content */}
        <div className="md:hidden pt-14">{children}</div>
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 h-16" style={{ background: 'rgba(10,10,10,0.97)', borderTop: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
        {bottomNav.map((item) => {
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href}
              className="flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-all"
              style={{ color: active ? '#10b981' : '#6b7280' }}
            >
              <span>{item.icon}</span>
              <span className="text-[10px] font-medium truncate max-w-[52px] text-center leading-tight">{item.label}</span>
            </Link>
          )
        })}
        {/* More button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 flex-1 py-2 rounded-xl"
          style={{ color: '#6b7280' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>
    </div>
  )
}
