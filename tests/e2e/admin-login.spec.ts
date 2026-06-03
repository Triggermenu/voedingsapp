import { test, expect } from '@playwright/test'

test.describe('Admin login pagina', () => {
  test('toont het loginformulier op /admin/login', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible()
    await expect(page.getByLabel('E-mailadres')).toBeVisible()
    await expect(page.getByLabel('Wachtwoord')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Inloggen' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Wachtwoord vergeten?' })).toBeVisible()
  })

  test('toont foutmelding bij onjuiste creds', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel('E-mailadres').fill('fout@voorbeeld.nl')
    await page.getByLabel('Wachtwoord').fill('foutWachtwoord123')
    await page.getByRole('button', { name: 'Inloggen' }).click()
    // Verwacht foutmelding — bij ontbrekende Supabase-env (CI) geeft network error
    // dezelfde melding als ongeldige creds (beide zetten authError).
    await expect(page.getByText('E-mail of wachtwoord onjuist.')).toBeVisible({ timeout: 10000 })
  })

  test('toont de wachtwoord-vergeten pagina', async ({ page }) => {
    await page.goto('/admin/wachtwoord-vergeten')
    await expect(page.getByRole('heading', { name: 'Wachtwoord vergeten' })).toBeVisible()
    await expect(page.getByLabel('E-mailadres')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Herstelmail sturen' })).toBeVisible()
  })

  test('/admin redirect naar login als niet ingelogd', async ({ page }) => {
    await page.goto('/admin')
    // Auth-gate actief: redirect naar /admin/login
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 8000 })
    await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible()
  })
})
