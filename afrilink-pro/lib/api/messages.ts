export async function fetchConversations() {
  const res = await fetch('/api/messages')
  if (!res.ok) throw new Error('Erreur chargement conversations')
  return res.json()
}

export async function fetchMessages(conversationId: string) {
  const res = await fetch(`/api/messages/${conversationId}`)
  if (!res.ok) throw new Error('Conversation introuvable')
  return res.json()
}

export async function sendMessage(conversationId: string, content: string, message_type = 'text') {
  const res = await fetch(`/api/messages/${conversationId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, message_type }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error)
  }
  return res.json()
}

export async function createConversation(other_user_id: string) {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ other_user_id }),
  })
  if (!res.ok) throw new Error('Erreur création conversation')
  return res.json()
}
