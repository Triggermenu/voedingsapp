import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Clear localStorage before each test
  await page.addInitScript(() => localStorage.clear())
})

test('onboarding flow completes and redirects to zoeken', async ({ page }) => {
  await page.goto('/')

  // Should redirect to onboarding
  await expect(page).toHaveURL(/\/onboarding/)

  // Step 0: Welcome — brand name "Triggermenu" visible in header/body, no heading role
  await expect(page.getByText('Triggermenu').first()).toBeVisible()

  // Proceed to step 1 (condition selection)
  await page.getByRole('button', { name: 'Beginnen' }).click()

  // Step 1: Choose condition via card buttons (not a dropdown)
  await expect(page.getByText('aandoening')).toBeVisible()
  // Cards are <button> elements with the condition label text
  await page.getByRole('button', { name: 'Jicht' }).click()
  // After selecting, button text changes to include count
  await page.getByRole('button', { name: /Doorgaan/ }).click()

  // Step 2: Disclaimer screen
  await expect(page.getByText('kompas', { exact: false })).toBeVisible()
  await expect(page.getByText('geen medisch advies')).toBeVisible()
  // Custom checkbox wrapped in a <label> — click the label to toggle
  await page.getByText('Ik begrijp dat Triggermenu').click()
  await page.getByRole('button', { name: 'Aan de slag' }).click()

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

  // Go to step 1 (condition selection)
  await page.getByRole('button', { name: 'Beginnen' }).click()

  // Try to proceed without selecting any condition
  await page.getByRole('button', { name: /Doorgaan/ }).click()

  // Should show validation error
  await expect(page.getByText('Kies minstens één aandoening')).toBeVisible()
})
