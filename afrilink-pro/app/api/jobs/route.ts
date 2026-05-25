import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category')
  const country = searchParams.get('country')
  const jobType = searchParams.get('type')
  const remote = searchParams.get('remote')
  const search = searchParams.get('q')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '20')
  const offset = (page - 1) * limit

  let query = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) query = query.eq('category', category)
  if (country) query = query.eq('country', country)
  if (jobType) query = query.eq('job_type', jobType)
  if (remote) query = query.eq('remote_status', remote)
  if (search) query = query.or(`title.ilike.%${search}%,company_name.ilike.%${search}%,description.ilike.%${search}%`)

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ jobs: data, total: count, page, limit })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json()
  const { data, error } = await supabase
    .from('jobs')
    .insert({ ...body, created_by: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json(data, { status: 201 })
}
