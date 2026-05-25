import type { Job, JobWithSaved } from '@/types/database'

const BASE = '/api/jobs'

export async function fetchJobs(params: {
  category?: string
  country?: string
  type?: string
  remote?: string
  q?: string
  page?: number
}): Promise<{ jobs: JobWithSaved[]; total: number }> {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => v !== undefined && query.set(k, String(v)))
  const res = await fetch(`${BASE}?${query}`)
  if (!res.ok) throw new Error('Erreur lors du chargement des offres')
  return res.json()
}

export async function fetchJob(id: string): Promise<JobWithSaved> {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error('Offre introuvable')
  return res.json()
}

export async function applyToJob(id: string, data: { resume_url?: string; cover_letter?: string }) {
  const res = await fetch(`${BASE}/${id}/apply`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error)
  }
  return res.json()
}

export async function toggleSaveJob(id: string): Promise<{ saved: boolean }> {
  const res = await fetch(`${BASE}/${id}/save`, { method: 'POST' })
  if (!res.ok) throw new Error('Erreur')
  return res.json()
}

export async function createJob(data: Partial<Job>) {
  const res = await fetch(BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error)
  }
  return res.json()
}
