import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: existing } = await supabase.from('saved_jobs').select('id').eq('job_id', id).eq('user_id', user.id).single()

  if (existing) {
    await supabase.from('saved_jobs').delete().eq('id', existing.id)
    return NextResponse.json({ saved: false })
  }

  await supabase.from('saved_jobs').insert({ job_id: id, user_id: user.id })
  return NextResponse.json({ saved: true })
}
