import { Link } from 'react-router'
import { artworkUrl, capitalize, formatId, getIdFromUrl } from '../services/pokeapi.js'

export default function PokemonCard({ pokemon }) {
  const id = getIdFromUrl(pokemon.url)
  return (
    <Link to={`/pokedex/${pokemon.name}`} className="card pokemon-card">
      <img src={artworkUrl(id)} alt={pokemon.name} loading="lazy" width="120" height="120" />
      <span className="pokemon-card__id">{formatId(id)}</span>
      <span className="pokemon-card__name">{capitalize(pokemon.name)}</span>
    </Link>
  )
}
