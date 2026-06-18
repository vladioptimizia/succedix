import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminShell from './_shell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')
  if (session.user.email !== 'vladimir.m.f95@gmail.com') redirect('/')

  return <AdminShell email={session.user.email!}>{children}</AdminShell>
}
