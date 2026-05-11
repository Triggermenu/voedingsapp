import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Clear localStorage before each test
  await page.addInitScript(() => localStorage.clear())
})

test('onboarding flow completes and redirects to zoeken', async ({ page }) => {
  await page.goto('/')

  // Should redirect to onboarding
  await expect(page).toHaveURL(/\/onboarding/)
  await expect(page.getByText('Voedingsapp')).toBeVisible()

  // Step 1: Welcome
  await page.getByRole('button', { name: 'Volgende' }).click()

  // Step 2: Choose condition
  await expect(page.getByText('Kies je aandoening')).toBeVisible()
  await page.getByRole('button', { name: 'Jicht' }).click()
  await page.getByRole('button', { name: 'Volgende' }).click()

  // Step 3: Disclaimer
  await expect(page.getByText('Disclaimer')).toBeVisible()
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'App openen' }).click()

  // Should redirect to zoeken
  await expect(page).toHaveURL(/\/zoeken/)
  await expect(page.getByRole('searchbox')).toBeVisible()
})

test('cannot proceed to zoeken without completing onboarding', async ({ page }) => {
  await page.goto('/zoeken')
  await expect(page).toHaveURL(/\/onboarding/)
})

test('cannot proceed without selecting a condition', async ({ page }) => {
  await page.goto('/onboarding')
  await page.getByRole('button', { name: 'Volgende' }).click()

  // Skip condition selection
  await page.getByRole('button', { name: 'Volgende' }).click()

  // Should show error
  await expect(page.getByText('Kies minstens één aandoening')).toBeVisible()
})
