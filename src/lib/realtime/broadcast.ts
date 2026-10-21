/**
 * Server-Sent Events (SSE) broadcast system for real-time notifications.
 * Works in Vercel serverless by maintaining connections per function instance.
 */

interface SSEClient {
  userId: string
  controller: ReadableStreamDefaultController<string>
  lastActivity: number
}

// Global map of userId -> Set of SSE controllers
// In serverless, this lives per function instance
const clients = new Map<string, Set<SSEClient>>()

/** Add a new SSE connection for a user */
export function addSSEClient(userId: string, controller: ReadableStreamDefaultController<string>): void {
  if (!clients.has(userId)) {
    clients.set(userId, new Set())
  }
  const client: SSEClient = {
    userId,
    controller,
    lastActivity: Date.now(),
  }
  clients.get(userId)!.add(client)
  
  // Send initial connection confirmation
  const message = formatSSE({ type: 'connected', userId })
  controller.enqueue(message)
}

/** Remove an SSE connection */
export function removeSSEClient(userId: string, controller: ReadableStreamDefaultController<string>): void {
  const userClients = clients.get(userId)
  if (userClients) {
    // Find the client with this controller
    for (const client of userClients) {
      if (client.controller === controller) {
        userClients.delete(client)
        break
      }
    }
    if (userClients.size === 0) {
      clients.delete(userId)
    }
  }
}

/** Get count of active connections for a user */
export function getConnectionCount(userId: string): number {
  return clients.get(userId)?.size ?? 0
}

/** Get total active connections across all users */
export function getTotalConnections(): number {
  let total = 0
  for (const set of clients.values()) {
    total += set.size
  }
  return total
}

/** Send a notification to all connections for a specific user */
export function broadcastToUser(userId: string, event: unknown): number {
  const userClients = clients.get(userId)
  if (!userClients || userClients.size === 0) {
    return 0
  }

  const message = formatSSE(event)
  let sent = 0
  
  for (const client of userClients) {
    try {
      client.controller.enqueue(message)
      client.lastActivity = Date.now()
      sent++
    } catch {
      // Client disconnected, will be cleaned up on next broadcast
      userClients.delete(client)
    }
  }
  
  if (userClients.size === 0) {
    clients.delete(userId)
  }
  
  return sent
}

/** Broadcast to multiple users at once */
export function broadcastToUsers(userIds: string[], event: unknown): Map<string, number> {
  const results = new Map<string, number>()
  for (const userId of userIds) {
    results.set(userId, broadcastToUser(userId, event))
  }
  return results
}

/** Format event as SSE message */
function formatSSE(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`
}

/** Send a raw message to a single controller */
function sendToController(controller: ReadableStreamDefaultController<string>, data: unknown): void {
  controller.enqueue(formatSSE(data))
}

/** Send a heartbeat to keep connections alive */
export function sendHeartbeat(): void {
  const heartbeat = formatSSE({ type: 'heartbeat', timestamp: Date.now() })
  const now = Date.now()
  
  for (const [userId, userClients] of clients.entries()) {
    for (const client of userClients) {
      // Remove stale connections (no activity for 5 minutes)
      if (now - client.lastActivity > 5 * 60 * 1000) {
        userClients.delete(client)
        continue
      }
      try {
        client.controller.enqueue(heartbeat)
      } catch {
        userClients.delete(client)
      }
    }
    if (userClients.size === 0) {
      clients.delete(userId)
    }
  }
}

/** Clean up all connections for a user (e.g., on logout) */
export function closeAllUserConnections(userId: string): void {
  const userClients = clients.get(userId)
  if (userClients) {
    for (const client of userClients) {
      try {
        client.controller.close()
      } catch {
        // Ignore
      }
    }
    clients.delete(userId)
  }
}
