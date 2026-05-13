import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('voedingsapp_profile_v1', JSON.stringify({ conditions: ['jicht', 'histamine'] }))
    localStorage.setItem('voedingsapp_disclaimer_v1', 'true')
  })
})

test('profielwissel: aandoening toevoegen en opslaan', async ({ page }) => {
  await page.goto('/instellingen')

  // Migraine staat initieel uit — klik om aan te zetten
  await page.getByRole('button', { name: 'Migraine' }).click()

  await page.getByRole('button', { name: 'Opslaan' }).click()
  await expect(page.getByRole('button', { name: '✓ Opgeslagen' })).toBeVisible()
})

test('profielwissel: aandoening verwijderen en opslaan', async ({ page }) => {
  await page.goto('/instellingen')

  // Histamine staat aan (initieel profiel) — klik om uit te zetten
  await page.getByRole('button', { name: 'Histamine' }).click()

  await page.getByRole('button', { name: 'Opslaan' }).click()
  await expect(page.getByRole('button', { name: '✓ Opgeslagen' })).toBeVisible()
})

test('profielwissel: opslaan geblokkeerd zonder aandoening', async ({ page }) => {
  await page.goto('/instellingen')

  // Zet alle aandoeningen uit
  await page.getByRole('button', { name: 'Jicht' }).click()
  await page.getByRole('button', { name: 'Histamine' }).click()

  await expect(page.getByRole('button', { name: 'Opslaan' })).toBeDisabled()
})

test('profiel wissen navigeert naar onboarding', async ({ page }) => {
  await page.goto('/instellingen')

  page.on('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Profiel wissen' }).click()

  await expect(page).toHaveURL(/\/onboarding/)
})
