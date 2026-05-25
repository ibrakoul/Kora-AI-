export async function fetchNotifications(unreadOnly = false) {
  const res = await fetch(`/api/notifications${unreadOnly ? '?unread=true' : ''}`)
  if (!res.ok) throw new Error('Erreur chargement notifications')
  return res.json()
}

export async function markNotificationsRead(ids?: string[]) {
  const body = ids ? { ids } : { mark_all: true }
  const res = await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) throw new Error('Erreur')
  return res.json()
}
