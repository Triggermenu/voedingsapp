import { test, expect } from '@playwright/test'

// Spinazie (rauw) — id 168463, present in groente.json
const SPINAZIE_ID = '168463'

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    localStorage.setItem('voedingsapp_profile_v1', JSON.stringify({ conditions: ['jicht', 'histamine'] }))
    localStorage.setItem('voedingsapp_disclaimer_v1', 'true')
  })
})

test('ItemDetail toont de naam van het item', async ({ page }) => {
  await page.goto(`/item/${SPINAZIE_ID}`)

  // The h1 contains the display name
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Spinazie')
})

test('ItemDetail toont per-conditie score-blokken', async ({ page }) => {
  await page.goto(`/item/${SPINAZIE_ID}`)

  // Each active condition has a section heading with the condition label
  await expect(page.getByText('Jicht', { exact: true })).toBeVisible()
  await expect(page.getByText('Histamine', { exact: true })).toBeVisible()

  // Each block contains a score pill (Veilig / Met mate / Spaarzaam / Vermijden)
  const pills = page.getByText(/^(Veilig|Met mate|Spaarzaam|Vermijden)$/)
  await expect(pills.first()).toBeVisible()
})

test('ItemDetail Terug-knop navigeert terug naar zoeken', async ({ page }) => {
  // Navigate from zoeken to the detail page so browser history is set
  await page.goto('/zoeken')
  await page.getByRole('searchbox').fill('spinazie')
  await page.getByText('Spinazie').first().click()
  await expect(page).toHaveURL(/\/item\//)

  // Click the Terug button
  await page.getByRole('button', { name: 'Terug' }).click()

  // Should be back on the zoeken page
  await expect(page).toHaveURL(/\/zoeken/)
})

test('onbekend item toont foutmelding', async ({ page }) => {
  await page.goto('/item/bestaat-niet')

  await expect(page.getByText('Item niet gevonden')).toBeVisible()
  // Terug link is still present on the not-found view
  await expect(page.getByText('← Terug')).toBeVisible()
})
