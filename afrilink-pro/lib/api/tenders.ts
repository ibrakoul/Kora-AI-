import type { TenderRow } from '@/types/database'

export async function fetchTenders(params: Record<string, string> = {}): Promise<TenderRow[]> {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`/api/tenders${qs ? `?${qs}` : ''}`)
  const data = await res.json()
  return data.tenders ?? []
}
