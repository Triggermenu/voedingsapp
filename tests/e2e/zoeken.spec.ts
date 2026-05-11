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
  await page.goto('/zoeken')
  await page.getByRole('searchbox').fill('spinazie')

  // Click the Spinazie row — navigates to detail page
  await page.getByText('Spinazie (rauw)', { exact: true }).click()

  await expect(page).toHaveURL(/\/item\/168463/)
})

test('navigation tabs work', async ({ page }) => {
  await page.goto('/zoeken')

  await page.getByRole('link', { name: 'Bronnen' }).click()
  await expect(page).toHaveURL(/\/bronnen/)
  await expect(page.getByText('Bronnen & methodologie')).toBeVisible()

  // Tab is labelled "Profiel" in the NavBar (not "Instellingen")
  await page.getByRole('link', { name: 'Profiel' }).click()
  await expect(page).toHaveURL(/\/instellingen/)
})

test('koffie is visible in search results', async ({ page }) => {
  await page.goto('/zoeken')
  await page.getByRole('searchbox').fill('koffie')

  await expect(page.getByText('Koffie (zwart, gezet)', { exact: true })).toBeVisible()
})
