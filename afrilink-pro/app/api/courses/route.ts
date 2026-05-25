import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category')
  const level = searchParams.get('level')
  const search = searchParams.get('q')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const offset = (page - 1) * limit

  let query = supabase
    .from('courses')
    .select('*', { count: 'exact' })
    .order('is_bestseller', { ascending: false })
    .order('rating', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) query = query.eq('category', category)
  if (level) query = query.eq('level', level)
  if (search) query = query.ilike('title', `%${search}%`)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ courses: data, total: count, page, limit })
}
