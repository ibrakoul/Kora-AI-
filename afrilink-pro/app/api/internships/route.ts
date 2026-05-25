import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const sector = searchParams.get('sector')
  const country = searchParams.get('country')
  const paid = searchParams.get('paid')
  const search = searchParams.get('q')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const offset = (page - 1) * limit

  let query = supabase
    .from('internships')
    .select('*', { count: 'exact' })
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (sector) query = query.eq('sector', sector)
  if (country) query = query.eq('country', country)
  if (paid === 'true') query = query.eq('is_paid', true)
  if (search) query = query.ilike('title', `%${search}%`)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ internships: data, total: count, page, limit })
}
