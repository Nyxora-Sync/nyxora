type JsonLdData = Record<string, unknown> | Array<Record<string, unknown>>

/**
 * Renders schema.org JSON-LD. Escape `<` so a string in the data cannot close
 * the script element and inject markup.
 */
export function JsonLd({ data }: { data: JsonLdData }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
