import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import App from '../App.jsx'

/** Renderiza la app completa en una ruta concreta usando MemoryRouter (no necesita navegador). */
export function renderAt(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}
