import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('voedingsapp_profile_v1', JSON.stringify({ conditions: ['jicht', 'nierstenen'] }))
    localStorage.setItem('voedingsapp_disclaimer_v1', 'true')
  })
})

test('bronnen pagina laadt met alle vier aandoeningen', async ({ page }) => {
  await page.goto('/bronnen')
  await expect(page.getByText('Bronnen & methodologie')).toBeVisible()

  for (const label of ['Jicht', 'Migraine', 'Nierstenen', 'Histamine']) {
    await expect(page.getByText(label).first()).toBeVisible()
  }
})

test('bronnen toont database statistieken', async ({ page }) => {
  await page.goto('/bronnen')
  await expect(page.getByText(/Database: \d+ items/)).toBeVisible()
})

test('bronnen bevat klikbare bronlinks', async ({ page }) => {
  await page.goto('/bronnen')
  const links = page.locator('a[href^="https://"]')
  await expect(links.first()).toBeVisible()
  const count = await links.count()
  expect(count).toBeGreaterThan(3)
})

test('bronnenexport: pagina bevat volledige methodologie voor print', async ({ page }) => {
  await page.goto('/bronnen')
  // Verify alle ruggengraat-bronnen aanwezig zijn (CLAUDE.md §5)
  await expect(page.getByText('USDA Purine Database')).toBeVisible()
  await expect(page.getByText('Harvard Oxalate Table')).toBeVisible()
  await expect(page.getByText('SIGHI Food Compatibility List')).toBeVisible()
  await expect(page.getByText('Hindiyeh')).toBeVisible()
})
