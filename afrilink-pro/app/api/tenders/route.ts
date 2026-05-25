import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const sector = searchParams.get('sector')
  const country = searchParams.get('country')
  const status = searchParams.get('status')
  const clientType = searchParams.get('client_type')
  const search = searchParams.get('q')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const offset = (page - 1) * limit

  let query = supabase
    .from('tenders')
    .select('*', { count: 'exact' })
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (sector) query = query.eq('sector', sector)
  if (country) query = query.eq('country', country)
  if (status) query = query.eq('status', status)
  if (clientType) query = query.eq('client_type', clientType)
  if (search) query = query.or(`title.ilike.%${search}%,client_name.ilike.%${search}%`)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await Promise.all((data ?? []).map(t =>
    supabase.from('tenders').update({ views_count: t.views_count + 1 }).eq('id', t.id)
  ))

  return NextResponse.json({ tenders: data, total: count, page, limit })
}
