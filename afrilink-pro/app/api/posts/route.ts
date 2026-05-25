import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const offset = (page - 1) * limit
  const userId = searchParams.get('user_id')

  let query = supabase
    .from('posts')
    .select(`*, author:user_id(id, first_name, last_name, headline, avatar_url, is_verified, premium_tier)`, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (userId) {
    query = query.eq('user_id', userId)
  } else {
    query = query.eq('visibility', 'public')
  }

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let likedIds: string[] = []
  if (user && data) {
    const { data: likes } = await supabase
      .from('post_engagements')
      .select('post_id')
      .eq('user_id', user.id)
      .eq('engagement_type', 'like')
      .in('post_id', data.map(p => p.id))
    likedIds = likes?.map(l => l.post_id) ?? []
  }

  const posts = data?.map(p => ({ ...p, is_liked: likedIds.includes(p.id) })) ?? []

  return NextResponse.json({ posts, total: count, page, limit })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { content, post_type = 'text', media_urls = [], visibility = 'public' } = await request.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Contenu requis' }, { status: 400 })

  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: user.id, content: content.trim(), post_type, media_urls, visibility })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json(data, { status: 201 })
}
