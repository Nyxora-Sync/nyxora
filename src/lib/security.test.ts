import { describe, expect, it } from 'vitest'
import { getRequestIp, hashIp } from '@/lib/security'

describe('request security helpers', () => {
  it('takes the first forwarded address', () => {
    const request = new Request('https://example.com', {
      headers: { 'x-forwarded-for': '203.0.113.9, 10.0.0.1' },
    })
    expect(getRequestIp(request)).toBe('203.0.113.9')
  })

  it('falls back to Cloudflare and real-IP headers', () => {
    expect(
      getRequestIp(
        new Request('https://example.com', {
          headers: { 'cf-connecting-ip': '198.51.100.4' },
        })
      )
    ).toBe('198.51.100.4')
  })

  it('hashes IPs deterministically without keeping the raw value', () => {
    const first = hashIp('203.0.113.9')
    const second = hashIp('203.0.113.9')
    expect(first).toBe(second)
    expect(first).not.toContain('203.0.113.9')
    expect(first).toHaveLength(64)
  })
})
