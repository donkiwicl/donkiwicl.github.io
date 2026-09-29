import { expect, test } from '@playwright/test'

test('la portada carga y enlaza a GitHub', async ({ page }) => {
  await page.goto('./')
  await expect(page).toHaveTitle(/DonKiwi/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('DonKiwi')
  await expect(page.getByRole('link', { name: 'GitHub ↗' })).toHaveAttribute(
    'href',
    'https://github.com/donkiwicl',
  )
})

test('el menú navega entre páginas', async ({ page }) => {
  // Respondemos a GitHub con datos falsos para que la prueba no dependa de la red.
  await page.route('https://api.github.com/**', (route) => route.fulfill({ json: [] }))

  await page.goto('./')
  await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Portafolio' }).click()
  await expect(page).toHaveURL(/#\/portafolio$/)
  await expect(page.getByRole('heading', { name: 'Portafolio' })).toBeVisible()

  await page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: 'Inicio' }).click()
  await expect(page).toHaveURL(/#\/$/)
})

test('una ruta inexistente muestra 404', async ({ page }) => {
  await page.goto('./#/esta-ruta-no-existe')
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
})
