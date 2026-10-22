import { expect, test } from '@playwright/test'

test('homepage renders the primary navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Nyxora Sync/i)
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()
  const menuToggle = page.getByRole('button', { name: 'Toggle menu' })
  if (await menuToggle.isVisible()) await menuToggle.click()
  await expect(page.getByRole('link', { name: 'Learn', exact: true }).last()).toBeVisible()
})

test('badge collection lists the catalog', async ({ page }) => {
  await page.goto('/badges')
  await expect(page.getByRole('heading', { name: /All Badges/i })).toBeVisible()
  await expect(page.getByText(/Browse all 79 badges/i)).toBeVisible()
})

test('sign-in page is reachable', async ({ page }) => {
  await page.goto('/auth/signin')
  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()
})

test('health endpoint reports readiness', async ({ request }) => {
  const response = await request.get('/api/health')
  expect([200, 503]).toContain(response.status())
  const payload = await response.json()
  expect(payload.checks.database).toMatch(/^(ok|error)$/)
  if (response.status() === 200) expect(payload.status).toBe('ok')
})

test('certificates require sign-in', async ({ page }) => {
  await page.goto('/certificates')
  await expect(page).toHaveURL(/\/auth\/signin/)
})

test('key pages do not overflow horizontally at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 })

  for (const path of [
    '/',
    '/learn',
    '/badges',
    '/community/showcase',
    '/roadmap',
    '/learn/beginner',
    '/resources',
    '/categories',
  ]) {
    await page.goto(path)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    )
    expect(overflow, `${path} should not scroll horizontally`).toBeLessThanOrEqual(1)
  }
})


test('PWA manifest and offline fallback are available', async ({ page, context, request }) => {
  const manifestResponse = await request.get('/site.webmanifest')
  expect(manifestResponse.status()).toBe(200)
  const manifest = await manifestResponse.json()
  expect(manifest.name).toBe('Nyxora Sync')
  expect(manifest.start_url).toBe('/learn')

  await page.goto('/learn')
  await page.waitForFunction(
    () => Boolean(navigator.serviceWorker?.controller),
    undefined,
    { timeout: 20_000 }
  )

  await context.setOffline(true)
  try {
    await page.goto('/qa-offline-fallback')
    await expect(page.getByRole('heading', { name: /offline/i })).toBeVisible()
  } finally {
    await context.setOffline(false)
  }
})
