import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: Request) {
  const { query } = await req.json() as { query: string }

  if (!query || query.trim().length < 2) {
    return new Response('Query trop courte', { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    const fallback = `⚠️ **ANTHROPIC_API_KEY manquante** — Ajoutez votre clé dans \`.env.local\` pour activer l'analyse IA.\n\nCréez le fichier \`.env.local\` avec:\n\`\`\`\nANTHROPIC_API_KEY=sk-ant-...\n\`\`\``
    return new Response(fallback, { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: `Tu es un expert senior du marché du travail tech en France (La French Tech, Paris, Silicon Sentier).
Analyse la recherche d'emploi suivante : "${query}"

Réponds avec exactement cette structure markdown (concis, data-driven) :

**📊 Tendance marché**
[1 phrase percutante sur la demande actuelle en France, avec chiffre si possible]

**💰 Fourchettes salariales**
• Junior (0-3 ans) : XX-YYk€/an
• Confirmé (3-6 ans) : XX-YYk€/an
• Senior (6+ ans) : XX-YYk€/an

**🔥 Compétences les plus recherchées**
[3-5 skills sous forme de liste inline séparée par · ]

**💡 Conseil carrière**
[1 conseil actionnable très spécifique et utile, max 2 phrases]

Style : professionnel, concis, 120 mots max au total.`
            }
          ]
        })

        for await (const event of anthropicStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erreur inconnue'
        controller.enqueue(encoder.encode(`\n\n⚠️ Erreur API: ${msg}`))
      } finally {
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    }
  })
}
