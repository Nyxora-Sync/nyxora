import { auth } from '@/lib/auth/auth'
import {
  addSSEClient,
  removeSSEClient,
  sendHeartbeat,
} from '@/lib/realtime/broadcast'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const encoder = new TextEncoder()
  let heartbeatInterval: ReturnType<typeof setInterval>

  const stream = new ReadableStream<string>({
    start(controller) {
      // Register this connection
      addSSEClient(userId, controller)

      // Send initial connection message
      controller.enqueue(
        `data: ${JSON.stringify({ type: 'connected', userId })}\n\n`
      )

      // Heartbeat every 30 seconds
      heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`)
        } catch {
          // Connection closed
        }
      }, 30_000)
    },
    cancel() {
      clearInterval(heartbeatInterval)
      // Note: removeSSEClient is called from the client side via a separate request
      // or we could track it here, but it's tricky with ReadableStream
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  })
}
