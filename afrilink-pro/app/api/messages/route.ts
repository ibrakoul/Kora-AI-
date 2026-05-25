import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participant_1:participant_1_id(id, first_name, last_name, avatar_url, headline),
      participant_2:participant_2_id(id, first_name, last_name, avatar_url, headline)
    `)
    .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { other_user_id } = await request.json()

  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .or(`and(participant_1_id.eq.${user.id},participant_2_id.eq.${other_user_id}),and(participant_1_id.eq.${other_user_id},participant_2_id.eq.${user.id})`)
    .single()

  if (existing) return NextResponse.json(existing)

  const { data, error } = await supabase
    .from('conversations')
    .insert({ participant_1_id: user.id, participant_2_id: other_user_id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json(data, { status: 201 })
}
