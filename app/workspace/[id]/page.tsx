'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/browser';

interface Business {
  id: string;
  name: string;
  sector?: string;
  canton?: string;
  vendor_id?: string;
  status: string;
}

type NavSection = 'overview' | 'documents' | 'checklist' | 'communication' | 'due-diligence' | 'experts';

const NAV_ITEMS: { key: NavSection; label: string; icon: string }[] = [
  { key: 'overview', label: 'Übersicht', icon: '📊' },
  { key: 'documents', label: 'Dokumente', icon: '📁' },
  { key: 'checklist', label: 'Checkliste', icon: '✅' },
  { key: 'communication', label: 'Kommunikation', icon: '💬' },
  { key: 'due-diligence', label: 'Due Diligence', icon: '🔍' },
  { key: 'experts', label: 'Experten', icon: '👥' },
];

const STAGES = [
  { label: 'Erstkontakt', done: true },
  { label: 'NDA unterzeichnet', done: true },
  { label: 'Finanzdaten geprüft', done: false },
  { label: 'Letter of Intent', done: false },
  { label: 'Due Diligence', done: false },
  { label: 'Kaufvertrag', done: false },
  { label: 'Übergabe', done: false },
];

const DOCUMENTS = [
  { name: 'NDA-Vereinbarung', phase: 1, available: true },
  { name: 'Finanzbericht (3 Jahre)', phase: 2, available: false },
  { name: 'Betriebshandbuch', phase: 2, available: false },
  { name: 'Bewertungsgutachten', phase: 3, available: false },
  { name: 'Kaufvertragsentwurf', phase: 4, available: false },
  { name: 'Übergabeprotokoll', phase: 4, available: false },
];

interface ChecklistItem {
  id: number;
  phase: string;
  title: string;
  description: string;
  responsible: string;
  done: boolean;
}

const CHECKLIST: ChecklistItem[] = [
  { id: 1, phase: 'Vorbereitung', title: 'NDA unterzeichnen', description: 'Vertraulichkeitsvereinbarung von beiden Parteien', responsible: 'Beide', done: true },
  { id: 2, phase: 'Vorbereitung', title: 'Profil vervollständigen', description: 'Alle Pflichtfelder im Profil ausfüllen', responsible: 'Käufer', done: true },
  { id: 3, phase: 'Vorbereitung', title: 'Finanzdaten bereitstellen', description: 'Jahresabschlüsse der letzten 3 Jahre', responsible: 'Verkäufer', done: false },
  { id: 4, phase: 'Verhandlung', title: 'Erstgespräch führen', description: 'Video-Call oder persönliches Treffen vereinbaren', responsible: 'Beide', done: false },
  { id: 5, phase: 'Verhandlung', title: 'Letter of Intent', description: 'Unverbindliche Absichtserklärung aufsetzen', responsible: 'Käufer', done: false },
  { id: 6, phase: 'Verhandlung', title: 'Preisverhandlung', description: 'Kaufpreis und Konditionen verhandeln', responsible: 'Beide', done: false },
  { id: 7, phase: 'Abschluss', title: 'Due Diligence', description: 'Umfassende Prüfung aller Unterlagen', responsible: 'Käufer', done: false },
  { id: 8, phase: 'Abschluss', title: 'Kaufvertrag prüfen', description: 'Rechtliche Prüfung durch Anwalt', responsible: 'Beide', done: false },
  { id: 9, phase: 'Übergabe', title: 'Kaufvertrag unterzeichnen', description: 'Notarielle Beurkundung', responsible: 'Beide', done: false },
  { id: 10, phase: 'Übergabe', title: 'Betriebsübergabe', description: 'Schlüsselübergabe und Einarbeitung', responsible: 'Verkäufer', done: false },
];

function Skeleton({ h = 20, w = '100%', r = 8 }: { h?: number; w?: string | number; r?: number }) {
  return <div style={{ height: h, width: w, borderRadius: r, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />;
}

export default function WorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(CHECKLIST);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/login'); return; }
      setUserId(session.user.id);

      const { data: biz } = await supabase.from('businesses').select('*').eq('id', id).maybeSingle();
      setBusiness(biz ?? null);
      setLoading(false);
    }
    load();
  }, [id]);

  function toggleChecklist(itemId: number) {
    setChecklist(prev => prev.map(item => item.id === itemId ? { ...item, done: !item.done } : item));
  }

  const phases = [...new Set(CHECKLIST.map(i => i.phase))];
  const completedCount = checklist.filter(i => i.done).length;

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @media(max-width:900px){.ws-layout{flex-direction:column!important} .ws-sidebar{width:auto!important;border-right:none!important;border-bottom:1px solid rgba(255,255,255,0.06)!important;flex-direction:row!important;overflow-x:auto!important;flex-shrink:0!important}}`}</style>

      {/* Security banner */}
      <div style={{ background: 'rgba(16,185,129,0.08)', borderBottom: '1px solid rgba(16,185,129,0.2)', padding: '8px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: 13, color: '#10b981' }}>🔒 Dieser Arbeitsbereich ist durch Ende-zu-Ende-Verschlüsselung geschützt</span>
      </div>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: '#fff', textDecoration: 'none' }}>
            Succedix<span style={{ color: '#10b981' }}>.</span>
          </Link>
          <span style={{ color: '#374151' }}>/</span>
          <span style={{ fontSize: 14, color: '#6b7280' }}>Arbeitsbereich</span>
          <span style={{ color: '#374151' }}>/</span>
          <span style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{loading ? '…' : (business?.name ?? 'Unbekannt')}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 12, background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: 999, padding: '3px 12px', fontWeight: 600 }}>Aktiv</span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="ws-layout" style={{ flex: 1, display: 'flex', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        {/* Sidebar */}
        <div className="ws-sidebar" style={{ width: 260, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '24px 0', display: 'flex', flexDirection: 'column', flexShrink: 0, background: 'rgba(255,255,255,0.01)' }}>
          {/* Business name in sidebar */}
          <div style={{ padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 8 }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Skeleton h={16} w="80%" r={6} /><Skeleton h={12} w="50%" r={5} />
              </div>
            ) : (
              <>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#fff' }}>{business?.name ?? 'Unternehmen'}</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b7280' }}>{business?.canton ?? '—'} • Aktive Transaktion</p>
              </>
            )}
          </div>
          {NAV_ITEMS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px',
                background: activeSection === key ? 'rgba(16,185,129,0.08)' : 'transparent',
                borderLeft: activeSection === key ? '3px solid #10b981' : '3px solid transparent',
                border: 'none', color: activeSection === key ? '#10b981' : '#9ca3af',
                fontSize: 14, fontWeight: activeSection === key ? 600 : 400,
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}>
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Main area */}
        <div style={{ flex: 1, minWidth: 0, padding: 32, overflowY: 'auto' }}>
          {/* Overview */}
          {activeSection === 'overview' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 0, marginBottom: 24 }}>Übersicht</h1>

              {/* Transaction summary */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
                <h2 style={{ fontSize: 12, fontWeight: 700, marginTop: 0, marginBottom: 20, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>Transaktionszusammenfassung</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
                  {[
                    { label: 'Unternehmen', value: loading ? null : (business?.name ?? '—') },
                    { label: 'Käufer', value: 'Anonym' },
                    { label: 'Verkäufer', value: 'Verifiziert' },
                    { label: 'Phase', value: 'Vorbereitung' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p style={{ color: '#6b7280', fontSize: 12, margin: '0 0 4px' }}>{label}</p>
                      {loading && label === 'Unternehmen' ? <Skeleton h={16} w="80%" r={4} /> : (
                        <p style={{ fontWeight: 700, fontSize: 15, margin: 0, color: '#fff' }}>{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 24 }}>Transaktionsphasen</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {STAGES.map((stage, i) => (
                    <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: i < STAGES.length - 1 ? 24 : 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: stage.done ? '#10b981' : 'rgba(255,255,255,0.08)', border: `2px solid ${stage.done ? '#10b981' : 'rgba(255,255,255,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: stage.done ? '#fff' : '#4b5563', fontWeight: 700 }}>
                          {stage.done ? '✓' : i + 1}
                        </div>
                        {i < STAGES.length - 1 && <div style={{ width: 2, flex: 1, background: stage.done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)', marginTop: 4 }} />}
                      </div>
                      <div style={{ paddingTop: 4, paddingBottom: i < STAGES.length - 1 ? 0 : 0 }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: stage.done ? '#fff' : '#6b7280' }}>{stage.label}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: stage.done ? '#10b981' : '#4b5563' }}>{stage.done ? 'Abgeschlossen' : 'Ausstehend'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          {activeSection === 'documents' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 0, marginBottom: 8 }}>Sichere Dokumente</h1>
              <p style={{ color: '#6b7280', marginBottom: 24 }}>Dokumente werden phasenweise freigegeben</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {DOCUMENTS.map((doc) => (
                  <div key={doc.name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${doc.available ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14 }}>
                    <span style={{ fontSize: 24, flexShrink: 0 }}>{doc.available ? '📄' : '🔒'}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: doc.available ? '#fff' : '#6b7280' }}>{doc.name}</p>
                      <p style={{ margin: '3px 0 0', fontSize: 12, color: doc.available ? '#10b981' : '#4b5563' }}>
                        {doc.available ? '✓ Verfügbar' : `Verfügbar in Phase ${doc.phase}`}
                      </p>
                    </div>
                    {doc.available ? (
                      <button style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        Anzeigen
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: '#4b5563', background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '5px 12px' }}>
                        Gesperrt
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Checklist */}
          {activeSection === 'checklist' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 0, marginBottom: 0 }}>Checkliste</h1>
                <span style={{ fontSize: 14, color: '#10b981', fontWeight: 700 }}>{completedCount}/{checklist.length} erledigt</span>
              </div>
              {/* Progress bar */}
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, marginBottom: 32, overflow: 'hidden' }}>
                <div style={{ width: `${(completedCount / checklist.length) * 100}%`, background: '#10b981', height: '100%', borderRadius: 4, transition: 'width 0.3s ease' }} />
              </div>

              {phases.map(phase => (
                <div key={phase} style={{ marginBottom: 32 }}>
                  <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#6b7280', marginTop: 0, marginBottom: 16 }}>{phase}</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {checklist.filter(i => i.phase === phase).map(item => (
                      <div
                        key={item.id}
                        onClick={() => toggleChecklist(item.id)}
                        style={{ display: 'flex', gap: 14, padding: '14px 18px', background: item.done ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${item.done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, cursor: 'pointer', alignItems: 'flex-start' }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${item.done ? '#10b981' : 'rgba(255,255,255,0.15)'}`, background: item.done ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.2s' }}>
                          {item.done && <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: item.done ? '#6b7280' : '#fff', textDecoration: item.done ? 'line-through' : 'none' }}>{item.title}</p>
                          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>{item.description}</p>
                        </div>
                        <span style={{ fontSize: 11, flexShrink: 0, background: 'rgba(255,255,255,0.06)', color: '#6b7280', borderRadius: 999, padding: '2px 8px', marginTop: 2 }}>{item.responsible}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Communication */}
          {activeSection === 'communication' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 0, marginBottom: 8 }}>Kommunikation</h1>
              <p style={{ color: '#6b7280', marginBottom: 32 }}>Sicher verschlüsselte Kommunikation</p>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 48, textAlign: 'center' }}>
                <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🔐</span>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Sicher verschlüsselte Kommunikation</h2>
                <p style={{ color: '#6b7280', marginBottom: 4 }}>Ende-zu-Ende verschlüsselte Nachrichten zwischen Käufer und Verkäufer</p>
                <p style={{ color: '#4b5563', fontSize: 14 }}>— coming soon —</p>
                <div style={{ marginTop: 24, padding: 16, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12, display: 'inline-block' }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#10b981' }}>In Entwicklung — verfügbar in Q3 2026</p>
                </div>
              </div>
              {/* Placeholder message UI */}
              <div style={{ marginTop: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24, opacity: 0.4, pointerEvents: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[{ align: 'left', color: 'rgba(255,255,255,0.08)' }, { align: 'right', color: 'rgba(16,185,129,0.1)' }, { align: 'left', color: 'rgba(255,255,255,0.08)' }].map((msg, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: msg.align === 'right' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ background: msg.color, borderRadius: 12, padding: '10px 16px', maxWidth: '70%' }}>
                        <Skeleton h={12} w={120 + i * 40} r={4} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} />
                  <div style={{ width: 80, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.15)' }} />
                </div>
              </div>
            </div>
          )}

          {/* Due Diligence */}
          {activeSection === 'due-diligence' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 0, marginBottom: 8 }}>Due Diligence</h1>
              <p style={{ color: '#6b7280', marginBottom: 32 }}>Umfassende Prüfung des Unternehmens</p>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 48, textAlign: 'center' }}>
                <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🔍</span>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Due Diligence Modul</h2>
                <p style={{ color: '#6b7280' }}>Strukturierte Prüfung aller relevanten Unternehmensbereiche</p>
                <div style={{ marginTop: 24, padding: 16, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 12, display: 'inline-block' }}>
                  <p style={{ margin: 0, fontSize: 13, color: '#f59e0b' }}>Freigabe nach Phase 3 (Letter of Intent)</p>
                </div>
              </div>
            </div>
          )}

          {/* Experts */}
          {activeSection === 'experts' && (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 0, marginBottom: 8 }}>Experten</h1>
              <p style={{ color: '#6b7280', marginBottom: 32 }}>Geprüfte Spezialisten für Ihre Transaktion</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                {[
                  { role: 'Rechtsanwalt', desc: 'Vertragsrecht & M&A', icon: '⚖️' },
                  { role: 'Steuerberater', desc: 'Steueroptimierung', icon: '📊' },
                  { role: 'Unternehmensberater', desc: 'Bewertung & Strategie', icon: '🎯' },
                  { role: 'Notar', desc: 'Beurkundung', icon: '📜' },
                ].map(({ role, desc, icon }) => (
                  <div key={role} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                    <span style={{ fontSize: 36, display: 'block', marginBottom: 12 }}>{icon}</span>
                    <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 4px' }}>{role}</p>
                    <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 16px' }}>{desc}</p>
                    <button style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                      Anfragen
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
