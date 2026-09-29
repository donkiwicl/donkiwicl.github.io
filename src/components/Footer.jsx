import { GITHUB_PROFILE_URL } from '../services/github.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          Hecho con React + Vite para <strong>DSY1104</strong> ·{' '}
          <a href={GITHUB_PROFILE_URL} target="_blank" rel="noreferrer">
            github.com/donkiwicl
          </a>{' '}
          · Datos de Pokémon desde{' '}
          <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">
            PokeAPI
          </a>
        </p>
      </div>
    </footer>
  )
}
