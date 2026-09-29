import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import PokemonCard from '../components/PokemonCard.jsx'
import { ErrorMessage, Loading } from '../components/Status.jsx'
import { useFetch } from '../hooks/useFetch.js'
import { PAGE_SIZE, pokemonListUrl } from '../services/pokeapi.js'

export default function Pokedex() {
  // La página actual vive en la URL (?page=2): se puede compartir el link y el botón "atrás" funciona.
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const { data, error, loading } = useFetch(pokemonListUrl(page))

  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 1
  const goToPage = (newPage) => setSearchParams({ page: String(newPage) })

  function handleSubmit(event) {
    event.preventDefault()
    const name = search.trim().toLowerCase()
    if (name) navigate(`/pokedex/${name}`)
  }

  return (
    <section>
      <header className="page-header">
        <h1>Pokédex</h1>
        <p className="lead">
          Datos obtenidos desde <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokeAPI</a>.
          Haz clic en un Pokémon para ver su detalle.
        </p>
      </header>

      <form className="search" onSubmit={handleSubmit} role="search">
        <label htmlFor="search" className="sr-only">Nombre o número del Pokémon</label>
        <input
          id="search"
          type="search"
          placeholder="Buscar por nombre o número (ej: pikachu, 25)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn--primary">Buscar</button>
      </form>

      {loading && <Loading text="Cargando Pokémon…" />}
      {error && <ErrorMessage error={error} />}

      {data && (
        <>
          <ul className="grid grid--pokemon">
            {data.results.map((pokemon) => (
              <li key={pokemon.name}>
                <PokemonCard pokemon={pokemon} />
              </li>
            ))}
          </ul>
          <nav className="pagination" aria-label="Paginación">
            <button type="button" className="btn" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
              ← Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button type="button" className="btn" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>
              Siguiente →
            </button>
          </nav>
        </>
      )}
    </section>
  )
}
