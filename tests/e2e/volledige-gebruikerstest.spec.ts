import { test, expect, type Page } from '@playwright/test'

/**
 * Volledige gebruikerstest voor Triggermenu.
 *
 * Loopt de complete gebruikersreis door: onboarding → zoeken & filteren →
 * itemdetail → profielwissel → bronnen, plus de menukaart-scan (incl. de
 * AVG-toestemming uit A-7, met gemockte AI) en de desktop drie-koloms layout.
 *
 * Bedoeld om in Chrome te draaien zodat je de reis live kunt volgen:
 *   npm run test:e2e:chrome
 *   (= playwright test volledige-gebruikerstest --project=chromium --headed)
 */

const MOBILE = { width: 390, height: 844 }
const DESKTOP = { width: 1440, height: 900 }

// Profiel + disclaimer vooraf zetten (slaat onboarding over voor losse tests).
async function seedProfile(page: Page, conditions: string[]) {
  await page.addInitScript((conds) => {
    localStorage.setItem('voedingsapp_profile_v1', JSON.stringify({ conditions: conds }))
    localStorage.setItem('voedingsapp_disclaimer_v1', 'true')
  }, conditions)
}

// Echt PNG-asset uit de repo als upload-fixture — gegarandeerd decodeerbaar door
// createImageBitmap (een hand-getypte mini-base64 wordt door headless Chrome geweigerd).
const MENU_FIXTURE = 'public/pwa-64x64.png'

test('volledige gebruikersreis — onboarding tot bronnen', async ({ page }) => {
  // Verse Playwright-context = lege localStorage, dus geen profiel → onboarding.
  // (Géén addInitScript-clear: die zou bij élke page.goto opnieuw wissen.)
  await page.setViewportSize(MOBILE)

  await test.step('Onboarding: aandoeningen kiezen + disclaimer', async () => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/onboarding/)
    await page.getByRole('button', { name: 'Beginnen' }).click()

    // Meerdere aandoeningen — overlap-patiënt
    await page.getByRole('button', { name: 'Jicht' }).click()
    await page.getByRole('button', { name: 'Migraine' }).click()
    await page.getByRole('button', { name: 'Histamine' }).click()
    await page.getByRole('button', { name: /Doorgaan/ }).click()

    await expect(page.getByText('geen medisch advies')).toBeVisible()
    await page.getByText('Ik begrijp dat Triggermenu').click()
    await page.getByRole('button', { name: 'Aan de slag' }).click()

    await expect(page).toHaveURL(/\/zoeken/)
    await expect(page.getByRole('searchbox')).toBeVisible()
  })

  await test.step('Zoeken: query + achterhaalde-aanname-check (koffie)', async () => {
    await page.getByRole('searchbox').fill('koffie')
    // Regressie zichtbaar voor de gebruiker: koffie staat erin (en is niet rood bij jicht)
    await expect(page.getByText('Koffie (zwart, gezet)', { exact: true })).toBeVisible()

    await page.getByRole('searchbox').fill('spinazie')
    await expect(page.getByText('Spinazie (rauw)', { exact: true })).toBeVisible()
  })

  await test.step('Itemdetail: scores, evidence-badge, bron, terug', async () => {
    await page.getByText('Spinazie (rauw)', { exact: true }).click()
    await expect(page).toHaveURL(/\/item\/168463/)

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Spinazie')
    await expect(page.getByText('Jicht', { exact: true })).toBeVisible()
    await expect(page.getByText(/^(Veilig|Matig|Voorzichtig|Vermijden)$/).first()).toBeVisible()
    await expect(page.getByText(/EV·[ABC]/).first()).toBeVisible()

    await page.getByRole('button', { name: 'Terug' }).click()
    await expect(page).toHaveURL(/\/zoeken/)
  })

  await test.step('Profielwissel: aandoening toevoegen via Instellingen', async () => {
    await page.goto('/instellingen', { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: 'Nierstenen' }).click()
    await page.getByRole('button', { name: 'Opslaan' }).click()
    await expect(page.getByText('✓ Opgeslagen')).toBeVisible()

    // Terug op zoeken weerspiegelt het nieuwe profiel
    await page.goto('/zoeken', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText(/profiel:.*Nierstenen/)).toBeVisible()
  })

  await test.step('Bronnen: methodologie-overzicht', async () => {
    await page.goto('/bronnen', { waitUntil: 'domcontentloaded' })
    await expect(page.getByText('De wetenschap achter elke score.')).toBeVisible()
    await expect(page.getByText('USDA Purine Database, Release 2.0')).toBeVisible()
    await expect(page.getByText('SIGHI Histamine Food Compatibility List')).toBeVisible()
  })
})

test('menukaart-scan: AVG-toestemming + gemockte AI-analyse', async ({ page }) => {
  await seedProfile(page, ['jicht', 'migraine'])
  await page.setViewportSize(MOBILE)

  // Mock de /api/menuscan-proxy (fase 1 = scores, fase 2 = uitleg) — geen echte AI-call.
  await page.route(/\/api\/menuscan/, async (route) => {
    const body = route.request().postDataJSON() as { phase?: number } | null
    const phase1 = {
      results: [
        { dish: 'Spaghetti carbonara', scores: { jicht: { score: 2, note: 'Spek + kaas.' }, migraine: { score: 2, note: 'Gerijpte kaas.' } }, overallNote: 'Met mate.' },
        { dish: 'Caprese salade', scores: { jicht: { score: 0, note: 'Laag purine.' }, migraine: { score: 1, note: 'Verse tomaat.' } }, overallNote: 'Prima keuze.' },
      ],
    }
    const phase2 = {
      details: [
        { dish: 'Spaghetti carbonara', explanation: 'Bevat gerookt spek (nitriet) en Parmezaan (tyramine).', waiterQuestions: ['Is het spek ongerookt?'] },
        { dish: 'Caprese salade', explanation: 'Verse tomaat (liberator) en mozzarella.', waiterQuestions: ['Hoe vers is de mozzarella?'] },
      ],
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body?.phase === 2 ? phase2 : phase1),
    })
  })

  await page.goto('/scan', { waitUntil: 'domcontentloaded' })

  await test.step('Toestemming vereist vóór scannen (A-7)', async () => {
    await expect(page.getByRole('button', { name: /Ik geef toestemming/ })).toBeVisible()
    // De upload is nog niet beschikbaar zonder toestemming
    await expect(page.getByText('Foto maken of kiezen')).toHaveCount(0)
    await page.getByRole('button', { name: /Ik geef toestemming/ }).click()
  })

  await test.step('Foto uploaden + analyseren', async () => {
    await expect(page.getByText('Foto maken of kiezen')).toBeVisible()
    await page.setInputFiles('input[type="file"]', MENU_FIXTURE)
    await page.getByRole('button', { name: 'Menu analyseren' }).click()

    await expect(page.getByText('Spaghetti carbonara')).toBeVisible()
    await expect(page.getByText('Caprese salade')).toBeVisible()
    await expect(page.getByText(/gerechten beoordeeld/)).toBeVisible()
  })
})

test('desktop drie-koloms layout: lijst → detail in dezelfde view', async ({ page }) => {
  await seedProfile(page, ['jicht', 'migraine', 'histamine'])
  await page.setViewportSize(DESKTOP)
  await page.goto('/zoeken', { waitUntil: 'domcontentloaded' })

  // Zoek in de linker kolom en selecteer een item
  await page.getByRole('searchbox').fill('spinazie')
  await page.getByRole('button', { name: /Spinazie/ }).first().click()

  // Detail verschijnt in de middenkolom — zonder navigatie naar /item
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Spinazie')
  await expect(page).toHaveURL(/\/zoeken/)
})
