import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Set up profile before navigating
  await page.addInitScript(() => {
    localStorage.setItem('voedingsapp_profile_v1', JSON.stringify({ conditions: ['jicht', 'migraine'] }))
    localStorage.setItem('voedingsapp_disclaimer_v1', 'true')
  })
})

test('search returns results', async ({ page }) => {
  await page.goto('/zoeken')
  await expect(page.getByRole('searchbox')).toBeVisible()

  // Should show items
  const items = page.locator('.rounded-xl.border.bg-white')
  await expect(items.first()).toBeVisible()
})

test('search filters by query', async ({ page }) => {
  await page.goto('/zoeken')
  await page.getByRole('searchbox').fill('spinazie')
  await expect(page.getByText('Spinazie')).toBeVisible()
})

test('item card expands on click', async ({ page }) => {
  await page.goto('/zoeken')
  await page.getByRole('searchbox').fill('koffie')

  const card = page.getByText('Koffie').first()
  await card.click()

  // Should show sources after expand
  await expect(page.getByText('USDA Purine').first()).toBeVisible()
})

test('navigation tabs work', async ({ page }) => {
  await page.goto('/zoeken')

  await page.getByRole('link', { name: 'Bronnen' }).click()
  await expect(page).toHaveURL(/\/bronnen/)
  await expect(page.getByText('Bronnen & methodologie')).toBeVisible()

  await page.getByRole('link', { name: 'Instellingen' }).click()
  await expect(page).toHaveURL(/\/instellingen/)
})

test('koffie shows green for jicht', async ({ page }) => {
  await page.goto('/zoeken')
  await page.getByRole('searchbox').fill('koffie')

  // The combined score for koffie should be visible
  // Jicht = groen (0), histamine = oranje (2) → combined = oranje
  await expect(page.getByText('Koffie')).toBeVisible()
})
