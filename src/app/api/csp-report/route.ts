/**
 * Collects Content-Security-Policy violation reports while the policy runs in
 * report-only mode. Reports are logged for triage and otherwise discarded.
 */
export async function POST(request: Request) {
  const body = await request.text().catch(() => '')
  if (body.length > 0 && body.length <= 10_000) {
    try {
      const report = JSON.parse(body)
      const violation = report?.['csp-report'] ?? report
      console.warn(
        JSON.stringify({
          type: 'csp_violation',
          documentUri: violation?.['document-uri'],
          directive: violation?.['violated-directive'] ?? violation?.effectiveDirective,
          blockedUri: violation?.['blocked-uri'] ?? violation?.blockedURL,
          sourceFile: violation?.['source-file'],
          lineNumber: violation?.['line-number'],
        })
      )
    } catch {
      // Malformed reports are ignored.
    }
  }

  return new Response(null, { status: 204 })
}
