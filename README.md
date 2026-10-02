# DonKiwi · Portafolio + Pokédex (DSY1104)

Proyecto de ejemplo para **DSY1104 – Desarrollo Fullstack**: un sitio en React que muestra
el portafolio de [github.com/donkiwicl](https://github.com/donkiwicl) y una Pokédex que consume
[PokeAPI](https://pokeapi.co/).

**Stack:** Vite · React 19 · JavaScript · React Compiler · React Router · Vitest + Testing Library · Playwright · GitHub Pages

👉 **Paso a paso completo (instalación explicada desde cero): [GUIA_INSTALACION.md](./GUIA_INSTALACION.md)**

## Uso rápido

```bash
npm install                        # instala dependencias
npx playwright install chromium    # descarga el navegador de pruebas (una vez)
npm run dev                        # servidor de desarrollo → http://localhost:5173
```

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Genera el sitio optimizado en `dist/` |
| `npm run preview` | Sirve `dist/` localmente para revisarlo |
| `npm run lint` | Revisa el código con ESLint |
| `npm test` | Vitest en modo *watch* |
| `npm run test:run` | Vitest una sola vez |
| `npm run test:coverage` | Vitest + informe de cobertura en `coverage/` (lo usa CI) |
| `npm run test:e2e` | Pruebas end-to-end con Playwright |
| `npm run test:e2e:ui` | Playwright con interfaz visual |
| `npm run deploy` | Publica `dist/` en la rama `gh-pages` (alternativa manual) |

## Rutas

| URL | Página |
| --- | --- |
| `/#/` | Inicio |
| `/#/portafolio` | Repos de donkiwicl (API de GitHub, filtro por lenguaje) |
| `/#/pokedex?page=N` | Listado paginado + buscador |
| `/#/pokedex/:name` | Detalle de un Pokémon |
| cualquier otra | 404 |

## Estructura

```
├── .github/workflows/deploy.yml   # CI: lint + tests + build + deploy a Pages
├── e2e/                           # pruebas Playwright (navegador real)
├── public/                        # archivos estáticos (favicon)
├── src/
│   ├── components/                # Layout, Navbar, Footer, tarjetas, estados
│   ├── hooks/useFetch.js          # hook reutilizable para consumir APIs
│   ├── pages/                     # una página por ruta
│   ├── services/                  # URLs y funciones de GitHub y PokeAPI (+ tests)
│   ├── test/                      # setup de Vitest, mocks y helpers
│   ├── App.jsx                    # definición de rutas
│   ├── App.test.jsx               # pruebas de componentes
│   └── main.jsx                   # punto de entrada (HashRouter)
├── playwright.config.js
└── vite.config.js                 # Vite + React Compiler + config de Vitest
```
