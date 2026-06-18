import AdminShell from './_shell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell email="vladimir.m.f95@gmail.com">{children}</AdminShell>
}
