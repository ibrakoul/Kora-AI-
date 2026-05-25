import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')
  const country = searchParams.get('country')
  const limit = parseInt(searchParams.get('limit') ?? '20')

  const { data: ownProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!ownProfile) return NextResponse.json({ profiles: [] })

  const { data: connections } = await supabase
    .from('connections')
    .select('requester_id, receiver_id')
    .or(`requester_id.eq.${(ownProfile as { id: string }).id},receiver_id.eq.${(ownProfile as { id: string }).id}`)

  const excludeIds = new Set<string>([(ownProfile as { id: string }).id])
  for (const c of connections ?? []) {
    excludeIds.add((c as { requester_id: string; receiver_id: string }).requester_id)
    excludeIds.add((c as { requester_id: string; receiver_id: string }).receiver_id)
  }

  let query = supabase
    .from('profiles')
    .select('id, first_name, last_name, headline, avatar_url, location, country, is_verified')
    .not('id', 'in', `(${[...excludeIds].join(',')})`)
    .limit(limit)

  if (q) query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,headline.ilike.%${q}%`)
  if (country) query = query.eq('country', country)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ profiles: data ?? [] })
}
