import { describe, expect, it } from 'vitest'
import { capitalize, formatId, getIdFromUrl, pokemonListUrl } from './pokeapi.js'

// Pruebas unitarias: funciones puras, sin React ni red.
describe('pokeapi helpers', () => {
  it('extrae el id desde la URL de PokeAPI', () => {
    expect(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
    expect(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/1')).toBe(1)
    expect(getIdFromUrl('no-es-una-url')).toBeNull()
  })

  it('calcula el offset según la página', () => {
    expect(pokemonListUrl(1)).toContain('offset=0')
    expect(pokemonListUrl(3)).toContain('offset=48')
  })

  it('formatea id y nombre', () => {
    expect(formatId(7)).toBe('#0007')
    expect(capitalize('pikachu')).toBe('Pikachu')
  })
})
