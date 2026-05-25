import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  const { data, error } = await supabase
    .from('connections')
    .select(`
      *,
      requester:requester_id(id, first_name, last_name, headline, avatar_url, is_verified),
      receiver:receiver_id(id, first_name, last_name, headline, avatar_url, is_verified)
    `)
    .or(`requester_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
    .eq('status', 'accepted')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { receiver_id } = await request.json()
  const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  const { data, error } = await supabase
    .from('connections')
    .insert({ requester_id: profile.id, receiver_id, status: 'pending' })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'Demande déjà envoyée.' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data, { status: 201 })
}
