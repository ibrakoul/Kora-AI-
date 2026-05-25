import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: job, error } = await supabase.from('jobs').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: 'Offre introuvable' }, { status: 404 })

  let isSaved = false
  if (user) {
    const { data } = await supabase.from('saved_jobs').select('id').eq('job_id', id).eq('user_id', user.id).single()
    isSaved = !!data
  }

  return NextResponse.json({ ...job, is_saved: isSaved })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { error } = await supabase.from('jobs').delete().eq('id', id).eq('created_by', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}
