import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockFetch, pikachu, pokemonList, repos } from './test/mocks.js'
import { renderAt } from './test/renderWithRouter.jsx'

// Pruebas de componentes: renderizamos la app en jsdom y la usamos como lo haría un usuario.
beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    mockFetch({
      '/pokemon?limit': pokemonList,
      '/pokemon/pikachu': pikachu,
      '/users/donkiwicl/repos': repos,
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Navegación', () => {
  it('muestra la portada con enlace a GitHub', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('DonKiwi')
    const githubLinks = screen.getAllByRole('link', { name: /github/i })
    expect(githubLinks[0]).toHaveAttribute('href', 'https://github.com/donkiwicl')
  })

  it('navega a la Pokédex desde el menú', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await user.click(screen.getByRole('link', { name: 'Pokédex' }))
    expect(await screen.findByRole('heading', { name: 'Pokédex' })).toBeInTheDocument()
  })

  it('muestra 404 en rutas desconocidas', () => {
    renderAt('/no-existe')
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
  })
})

describe('Pokédex', () => {
  it('lista los Pokémon obtenidos de la API', async () => {
    renderAt('/pokedex')
    expect(screen.getByRole('status')).toHaveTextContent(/cargando/i)
    expect(await screen.findByText('Pikachu')).toBeInTheDocument()
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument()
    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument()
  })

  it('busca un Pokémon y muestra su detalle', async () => {
    const user = userEvent.setup()
    renderAt('/pokedex')
    await user.type(screen.getByRole('searchbox'), 'Pikachu')
    await user.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(await screen.findByRole('heading', { name: 'Pikachu' })).toBeInTheDocument()
    expect(screen.getByText('electric')).toBeInTheDocument()
    expect(screen.getByText('0.4 m')).toBeInTheDocument()
    expect(screen.getByText('Velocidad')).toBeInTheDocument()
  })

  it('muestra un error si el Pokémon no existe', async () => {
    renderAt('/pokedex/missingno')
    expect(await screen.findByRole('alert')).toHaveTextContent('missingno')
  })
})

describe('Portafolio', () => {
  it('muestra repos sin forks y filtra por lenguaje', async () => {
    const user = userEvent.setup()
    renderAt('/portafolio')

    expect(await screen.findByText('fs2_tareafonda')).toBeInTheDocument()
    expect(screen.queryByText('repo-forkeado')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Java' }))
    expect(screen.queryByText('fs2_tareafonda')).not.toBeInTheDocument()
    expect(screen.getByText('poo_tareafonda')).toBeInTheDocument()
  })
})
