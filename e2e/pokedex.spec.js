import { expect, test } from '@playwright/test'

const list = {
  count: 48,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
  ],
}

const pikachu = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: { other: { 'official-artwork': { front_default: null } } },
  types: [{ type: { name: 'electric' } }],
  stats: [{ base_stat: 90, stat: { name: 'speed' } }],
}

// page.route intercepta las peticiones del navegador: las pruebas son rápidas y estables.
test.beforeEach(async ({ page }) => {
  await page.route('https://pokeapi.co/api/v2/pokemon?**', (route) => route.fulfill({ json: list }))
  await page.route('https://pokeapi.co/api/v2/pokemon/pikachu', (route) =>
    route.fulfill({ json: pikachu }),
  )
  await page.route('https://raw.githubusercontent.com/**', (route) => route.abort())
})

test('lista Pokémon y abre el detalle al hacer clic', async ({ page }) => {
  await page.goto('./#/pokedex')
  await expect(page.getByText('Bulbasaur')).toBeVisible()

  await page.getByRole('link', { name: /pikachu/i }).click()
  await expect(page).toHaveURL(/#\/pokedex\/pikachu$/)
  await expect(page.getByRole('heading', { name: 'Pikachu' })).toBeVisible()
  await expect(page.getByText('Velocidad')).toBeVisible()
})

test('la paginación actualiza la URL', async ({ page }) => {
  await page.goto('./#/pokedex')
  await page.getByRole('button', { name: 'Siguiente →' }).click()
  await expect(page).toHaveURL(/page=2/)
  await expect(page.getByText('Página 2 de 2')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Siguiente →' })).toBeDisabled()
})

test('el buscador lleva al detalle', async ({ page }) => {
  await page.goto('./#/pokedex')
  await page.getByRole('searchbox').fill('pikachu')
  await page.getByRole('searchbox').press('Enter')
  await expect(page.getByRole('heading', { name: 'Pikachu' })).toBeVisible()
})
