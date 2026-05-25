export async function fetchPosts(params: { page?: number; user_id?: string } = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => v !== undefined && query.set(k, String(v)))
  const res = await fetch(`/api/posts?${query}`)
  if (!res.ok) throw new Error('Erreur chargement posts')
  return res.json()
}

export async function createPost(data: { content: string; post_type?: string; media_urls?: string[]; visibility?: string }) {
  const res = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error)
  }
  return res.json()
}

export async function likePost(id: string): Promise<{ liked: boolean }> {
  const res = await fetch(`/api/posts/${id}/like`, { method: 'POST' })
  if (!res.ok) throw new Error('Erreur')
  return res.json()
}
