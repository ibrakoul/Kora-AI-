import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(`*, experiences(*), educations(*), skills(*), certifications(*), languages(*)`)
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  await supabase.from('profiles').update({ profile_views: data.profile_views + 1 }).eq('id', id)

  return NextResponse.json(data)
}
