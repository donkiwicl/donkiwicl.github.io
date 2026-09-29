import { vi } from 'vitest'

// Datos falsos (mocks) para no depender de internet en las pruebas.
export const pokemonList = {
  count: 48,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
  ],
}

export const pikachu = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: { other: { 'official-artwork': { front_default: 'https://example.com/pikachu.png' } } },
  types: [{ type: { name: 'electric' } }],
  stats: [
    { base_stat: 35, stat: { name: 'hp' } },
    { base_stat: 55, stat: { name: 'attack' } },
    { base_stat: 90, stat: { name: 'speed' } },
  ],
}

export const repos = [
  { id: 1, name: 'fs2_tareafonda', description: 'App React', language: 'JavaScript', stargazers_count: 5, updated_at: '2026-09-01T00:00:00Z', fork: false, html_url: 'https://github.com/donkiwicl/fs2_tareafonda' },
  { id: 2, name: 'poo_tareafonda', description: null, language: 'Java', stargazers_count: 3, updated_at: '2026-08-01T00:00:00Z', fork: false, html_url: 'https://github.com/donkiwicl/poo_tareafonda' },
  { id: 3, name: 'repo-forkeado', description: 'Un fork', language: 'Python', stargazers_count: 99, updated_at: '2026-07-01T00:00:00Z', fork: true, html_url: 'https://github.com/donkiwicl/repo-forkeado' },
]

/** Reemplaza fetch global por uno que responde según la URL pedida. */
export function mockFetch(routes) {
  return vi.fn(async (url) => {
    const entry = Object.entries(routes).find(([pattern]) => url.includes(pattern))
    if (!entry) return { ok: false, status: 404, json: async () => ({}) }
    return { ok: true, status: 200, json: async () => entry[1] }
  })
}
