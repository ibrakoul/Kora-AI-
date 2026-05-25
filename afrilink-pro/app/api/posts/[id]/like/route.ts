import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: existing } = await supabase
    .from('post_engagements')
    .select('id')
    .eq('post_id', id)
    .eq('user_id', user.id)
    .eq('engagement_type', 'like')
    .single()

  if (existing) {
    await supabase.from('post_engagements').delete().eq('id', existing.id)

    const { data: post } = await supabase.from('posts').select('likes_count').eq('id', id).single()
    await supabase.from('posts').update({ likes_count: Math.max(0, (post?.likes_count ?? 1) - 1) }).eq('id', id)

    return NextResponse.json({ liked: false })
  }

  await supabase.from('post_engagements').insert({
    post_id: id,
    user_id: user.id,
    engagement_type: 'like' as const,
  })

  const { data: post } = await supabase.from('posts').select('likes_count').eq('id', id).single()
  await supabase.from('posts').update({ likes_count: (post?.likes_count ?? 0) + 1 }).eq('id', id)

  return NextResponse.json({ liked: true })
}
