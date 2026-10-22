import type { Instrumentation } from 'next'

/**
 * Structured server-error logging. Vercel captures stdout/stderr, so this is
 * enough to search failures by route without shipping a third-party SDK.
 * Swap the console call for Sentry/Datadog here if long retention is needed.
 */
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  const message = error instanceof Error ? error.message : String(error)
  const digest =
    typeof error === 'object' && error !== null && 'digest' in error
      ? String(error.digest)
      : undefined

  console.error(
    JSON.stringify({
      type: 'request_error',
      message,
      digest,
      path: request.path,
      method: request.method,
      routerKind: context.routerKind,
      routePath: context.routePath,
      routeType: context.routeType,
      renderSource: context.renderSource,
      timestamp: new Date().toISOString(),
    })
  )
}
