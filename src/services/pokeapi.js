// Funciones de ayuda para trabajar con https://pokeapi.co
const API = 'https://pokeapi.co/api/v2'
export const PAGE_SIZE = 24

export const pokemonListUrl = (page) =>
  `${API}/pokemon?limit=${PAGE_SIZE}&offset=${(page - 1) * PAGE_SIZE}`

export const pokemonUrl = (name) => `${API}/pokemon/${encodeURIComponent(name.toLowerCase())}`

/** La lista de PokeAPI solo trae nombre y URL; el id viene al final de la URL. */
export function getIdFromUrl(url) {
  const match = url.match(/\/pokemon\/(\d+)\/?$/)
  return match ? Number(match[1]) : null
}

export const artworkUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

export const formatId = (id) => `#${String(id).padStart(4, '0')}`

export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

// Nombres en español para las estadísticas base.
export const STAT_LABELS = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Especial',
  'special-defense': 'Def. Especial',
  speed: 'Velocidad',
}
