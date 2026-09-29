import { Link, useParams } from 'react-router'
import { ErrorMessage, Loading } from '../components/Status.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { STAT_LABELS, artworkUrl, capitalize, formatId, pokemonUrl } from '../services/pokeapi.js'

const MAX_STAT = 255

export default function PokemonDetail() {
  // useParams lee el segmento dinámico ":name" definido en App.jsx
  const { name } = useParams()
  const { data: pokemon, error, loading } = useFetch(pokemonUrl(name))

  return (
    <section>
      <Link to="/pokedex" className="back-link">← Volver a la Pokédex</Link>

      {loading && <Loading text={`Buscando a ${name}…`} />}
      {error && (
        <ErrorMessage error={new Error(`no encontramos a "${name}" (${error.message})`)} />
      )}

      {pokemon && (
        <article className="card detail">
          <img
            className="detail__img"
            src={pokemon.sprites.other?.['official-artwork']?.front_default ?? artworkUrl(pokemon.id)}
            alt={pokemon.name}
            width="280"
            height="280"
          />
          <div className="detail__info">
            <p className="pokemon-card__id">{formatId(pokemon.id)}</p>
            <h1>{capitalize(pokemon.name)}</h1>
            <ul className="chips" aria-label="Tipos">
              {pokemon.types.map(({ type }) => (
                <li key={type.name} className={`tag type type--${type.name}`}>{type.name}</li>
              ))}
            </ul>
            <dl className="detail__facts">
              <div>
                <dt>Altura</dt>
                <dd>{pokemon.height / 10} m</dd>
              </div>
              <div>
                <dt>Peso</dt>
                <dd>{pokemon.weight / 10} kg</dd>
              </div>
            </dl>
            <h2>Estadísticas base</h2>
            <ul className="stats">
              {pokemon.stats.map(({ stat, base_stat }) => (
                <li key={stat.name}>
                  <span className="stats__label">{STAT_LABELS[stat.name] ?? stat.name}</span>
                  <span className="stats__value">{base_stat}</span>
                  <span className="stats__bar">
                    <span style={{ width: `${(base_stat / MAX_STAT) * 100}%` }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      )}
    </section>
  )
}
