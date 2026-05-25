import type { InternshipRow } from '@/types/database'

export async function fetchInternships(params: Record<string, string> = {}): Promise<InternshipRow[]> {
  const qs = new URLSearchParams(params).toString()
  const res = await fetch(`/api/internships${qs ? `?${qs}` : ''}`)
  const data = await res.json()
  return data.internships ?? []
}
