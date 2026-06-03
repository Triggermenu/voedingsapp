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
    await expect(page.getByText('E-mail of wachtwoord onjuist.')).toBeVisible({ timeout: 8000 })
  })

  test('toont de wachtwoord-vergeten pagina', async ({ page }) => {
    await page.goto('/admin/wachtwoord-vergeten')
    await expect(page.getByRole('heading', { name: 'Wachtwoord vergeten' })).toBeVisible()
    await expect(page.getByLabel('E-mailadres')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Herstelmail sturen' })).toBeVisible()
  })

  test('/admin is bereikbaar zonder inloggen (nog geen auth-gate)', async ({ page }) => {
    await page.goto('/admin')
    // De pagina laadt zonder redirect naar /admin/login
    await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible()
    // De live-data secties tonen "Log in"-prompt
    await expect(page.getByRole('link', { name: 'Inloggen →' }).first()).toBeVisible()
  })
})
