import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Set up a completed profile before navigating
  await page.addInitScript(() => {
    localStorage.setItem('voedingsapp_profile_v1', JSON.stringify({ conditions: ['jicht', 'histamine'] }))
    localStorage.setItem('voedingsapp_disclaimer_v1', 'true')
  })
})

test('search returns results', async ({ page }) => {
  await page.goto('/zoeken')
  await expect(page.getByRole('searchbox')).toBeVisible()

  // Without a query, grouped items are shown as row buttons
  const items = page.getByRole('button').filter({ hasText: /\w/ })
  await expect(items.first()).toBeVisible()
})

test('search filters by query', async ({ page }) => {
  await page.goto('/zoeken')
  await page.getByRole('searchbox').fill('spinazie')
  await expect(page.getByText('Spinazie (rauw)', { exact: true })).toBeVisible()
})

test('item card navigates to /item/:id on click', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/zoeken')
  await page.getByRole('searchbox').fill('spinazie')

  // Click the Spinazie row — navigates to detail page (mobile viewport)
  await page.getByText('Spinazie (rauw)', { exact: true }).click()

  await expect(page).toHaveURL(/\/item\/168463/)
})

test('navigation tabs work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/zoeken')

  // Bronnen is now accessible via the "Meer" tab, not a direct NavBar tab
  await page.goto('/bronnen')
  await expect(page).toHaveURL(/\/bronnen/)
  await expect(page.getByText('De wetenschap achter elke score.')).toBeVisible()

  // Tab is labelled "Meer" in the NavBar (was "Instellingen")
  await page.getByRole('link', { name: 'Meer' }).click()
  await expect(page).toHaveURL(/\/instellingen/)
})

test('koffie is visible in search results', async ({ page }) => {
  await page.goto('/zoeken')
  await page.getByRole('searchbox').fill('koffie')

  await expect(page.getByText('Koffie (zwart, gezet)', { exact: true })).toBeVisible()
})
