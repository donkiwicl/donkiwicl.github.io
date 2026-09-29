import { Link, NavLink } from 'react-router'
import { GITHUB_PROFILE_URL } from '../services/github.js'

// NavLink agrega la clase "active" automáticamente al link de la página actual.
export default function Navbar() {
  return (
    <header className="navbar">
      <nav className="container navbar__inner" aria-label="Principal">
        <Link to="/" className="brand">
          <span className="brand__kiwi" aria-hidden="true" />
          DonKiwi
        </Link>
        <ul className="navbar__links">
          <li>
            <NavLink to="/" end>Inicio</NavLink>
          </li>
          <li>
            <NavLink to="/portafolio">Portafolio</NavLink>
          </li>
          <li>
            <NavLink to="/pokedex">Pokédex</NavLink>
          </li>
          <li>
            <a href={GITHUB_PROFILE_URL} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
