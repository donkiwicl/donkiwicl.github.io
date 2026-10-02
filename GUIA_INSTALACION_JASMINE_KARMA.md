# Guía paso a paso · DSY1104 (versión Jasmine + Karma)

## Portafolio DonKiwi + Pokédex con Vite, React, React Router, Jasmine, Karma y GitHub Pages

Esta guía es el **espejo** de [`GUIA_INSTALACION.md`](GUIA_INSTALACION.md): construye el mismo
proyecto desde una carpeta vacía hasta publicarlo, pero las pruebas usan **Jasmine** (framework de
pruebas) y **Karma** (ejecutor que corre las pruebas en un navegador real) en lugar de Vitest y
Playwright. Las Partes 1 a 5, 8.1 y 9 son iguales en ambas guías; lo que cambia está en las
Partes 0, 6, 7, 8.2 y 10.

> 💡 Si solo quieres **ejecutar** el proyecto ya terminado, ve directo a la [Parte 0](#parte-0--ejecutar-el-proyecto-terminado).

### ¿Qué reemplaza a qué?

| Vitest + Playwright | Jasmine + Karma | Comentario |
| --- | --- | --- |
| `vitest` (runner + `describe/it/expect`) | `jasmine-core` (API de pruebas) + `karma` (runner) | La API `describe / it / expect / beforeEach` es casi idéntica. |
| `jsdom` (DOM simulado en Node) | **Chrome real** (`karma-chrome-launcher`) | Karma abre Chrome (normalmente sin ventana, *headless*) y ejecuta las pruebas dentro. |
| Vite transforma JSX al probar | `karma-webpack` + `babel-loader` | Karma no entiende JSX ni `import`; webpack empaqueta las pruebas antes de enviarlas al navegador. |
| `@testing-library/jest-dom` | `@testing-library/jasmine-dom` | Mismos matchers: `toBeInTheDocument()`, `toHaveTextContent()`… |
| `vi.fn()`, `vi.stubGlobal()` | `jasmine.createSpy()`, `spyOn()` | Los `spyOn` se deshacen solos al terminar cada prueba. |
| `@vitest/coverage-v8` | `karma-coverage` + `babel-plugin-istanbul` | Mismo formato de informe (tabla, HTML y lcov) y mismos umbrales. |
| Playwright (E2E sobre el build) | Pruebas de **integración** con Karma (app completa + `HashRouter` en Chrome) | Ver la [Parte 7](#parte-7--pruebas-de-integración-en-navegador-real-con-karma): Karma **no** es una herramienta E2E. |
| Informe HTML de Playwright | Informe **JUnit** (`karma-junit-reporter`) | Evidencia de las pruebas que se sube como artefacto en CI. |

> ⚠️ **Estado de Karma.** Karma está **deprecado** desde 2023: el equipo ya no agrega funciones y
> solo publica correcciones críticas (Angular, su principal usuario, migró a otras herramientas).
> Funciona bien y sigue siendo muy común en proyectos existentes, por eso vale la pena conocerlo;
> para un proyecto **nuevo** con Vite, la opción recomendada es Vitest (la otra guía).

---

## Índice

0. [Ejecutar el proyecto terminado](#parte-0--ejecutar-el-proyecto-terminado)
1. [Requisitos previos](#parte-1--requisitos-previos)
2. [Crear el proyecto con Vite + React Compiler](#parte-2--crear-el-proyecto-con-vite--react-compiler)
3. [Entender lo que se generó](#parte-3--entender-lo-que-se-generó)
4. [Agregar React Router](#parte-4--agregar-react-router)
5. [Consumir APIs: GitHub y PokeAPI](#parte-5--consumir-apis-github-y-pokeapi)
6. [Pruebas unitarias con Jasmine y Karma](#parte-6--pruebas-unitarias-y-de-componentes-con-jasmine-y-karma) · [Cobertura](#66-cobertura-de-código-con-karma-coverage)
7. [Pruebas de integración en navegador real](#parte-7--pruebas-de-integración-en-navegador-real-con-karma)
8. [Preparar el proyecto para GitHub Pages](#parte-8--preparar-el-proyecto-para-github-pages)
9. [Subir a GitHub y desplegar](#parte-9--subir-a-github-y-desplegar)
10. [Problemas frecuentes](#parte-10--problemas-frecuentes)

---

## Parte 0 · Ejecutar el proyecto terminado

```bash
npm install         # 1. instala las dependencias listadas en package.json
npm run dev         # 2. abre http://localhost:5173
```

Karma usa el **Google Chrome instalado** en tu computador, así que no hay que descargar ningún
navegador aparte (ver [Parte 6.1](#61-instalar)).

Para verificar que todo funciona:

```bash
npm run lint           # revisa el estilo y errores comunes del código
npm run test:run       # todas las pruebas (unitarias, componentes e integración) en Chrome
npm run test:coverage  # las mismas pruebas + informe de cobertura (coverage/index.html)
npm run build          # genera la versión de producción en dist/
```

---

## Parte 1 · Requisitos previos

| Herramienta | Versión recomendada | Para qué sirve | Cómo comprobarla |
| --- | --- | --- | --- |
| **Node.js** | 22 LTS o superior (el proyecto se probó con 24) | Ejecuta JavaScript fuera del navegador. Vite, Karma y webpack corren sobre Node. | `node -v` |
| **npm** | viene con Node | Gestor de paquetes: descarga librerías desde el registro npm. | `npm -v` |
| **Git** | cualquiera reciente | Control de versiones; necesario para subir el código a GitHub. | `git --version` |
| **Google Chrome** | cualquiera reciente | Karma abre Chrome para ejecutar las pruebas. | Abrir Chrome → *Ayuda → Información* |
| **Cuenta de GitHub** | — | Para alojar el repositorio y publicar con GitHub Pages. | — |
| **VS Code** (opcional) | — | Editor. Extensiones útiles: *ESLint*, *Jasmine Test Explorer* (opcional). | — |

> 📥 Node.js se descarga desde <https://nodejs.org> (elige la versión **LTS**).
> Si un comando no se reconoce después de instalar, **cierra y vuelve a abrir la terminal**.

Configura tu identidad en Git (solo una vez por computador):

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@ejemplo.com"
```

**¿Por qué?** Cada *commit* queda firmado con este nombre y correo; GitHub los usa para asociar los
cambios a tu cuenta.

---

## Parte 2 · Crear el proyecto con Vite + React Compiler

### 2.1 Generar el proyecto

```bash
npm create vite@latest dsy1104-donkiwi
```

El asistente hace algunas preguntas. Responde así:

| Pregunta | Respuesta |
| --- | --- |
| *Select a framework* | **React** |
| *Select a variant* | **JavaScript + React Compiler** |
| *Use ESLint or Oxlint?* (según versión) | **ESLint** |
| *Install with npm and start now?* | **No** (lo haremos a mano para entender cada paso) |

> ⚡ Versión no interactiva (hace lo mismo en un solo comando):
> ```bash
> npm create vite@latest dsy1104-donkiwi -- --template react-compiler --eslint --no-interactive
> ```

**¿Qué es Vite?** Es la herramienta de *build*: un servidor de desarrollo muy rápido (recarga el
navegador al guardar) y un empaquetador que optimiza el código para producción.

**¿Qué es el React Compiler?** Un plugin que analiza tus componentes al compilar y los
**memoriza automáticamente**. Antes había que usar `useMemo`, `useCallback` y `React.memo` a mano
para evitar renders innecesarios; con el compilador escribimos código simple y él optimiza.

### 2.2 Entrar a la carpeta e instalar dependencias

```bash
cd dsy1104-donkiwi
npm install
```

**¿Qué pasa aquí?** npm lee `package.json`, descarga todas las librerías a la carpeta
`node_modules/` y crea `package-lock.json`, que "congela" las versiones exactas para que todos
los compañeros (y GitHub Actions) instalen lo mismo.

> ⚠️ `node_modules/` **nunca** se sube a GitHub (ya está en `.gitignore`). Se regenera con `npm install`.

### 2.3 Probar que funciona

```bash
npm run dev
```

Abre <http://localhost:5173>. Deberías ver la página de bienvenida de Vite + React.
Detén el servidor con **Ctrl + C**.

---

## Parte 3 · Entender lo que se generó

```
dsy1104-donkiwi/
├── index.html          ← la ÚNICA página HTML. React se monta en <div id="root">
├── package.json        ← nombre del proyecto, scripts y dependencias
├── vite.config.js      ← configuración de Vite (aquí se activa el React Compiler)
├── eslint.config.js    ← reglas de calidad de código
├── public/             ← archivos que se copian tal cual (favicon, imágenes fijas)
└── src/
    ├── main.jsx        ← punto de entrada: crea la raíz de React
    ├── App.jsx         ← componente principal
    └── index.css       ← estilos globales
```

Mira `vite.config.js`:

```js
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }), // ← esto activa el React Compiler
  ],
})
```

**Dependencias vs. dependencias de desarrollo** (en `package.json`):

- `dependencies`: se necesitan **en el navegador** (react, react-dom, react-router).
- `devDependencies`: solo se usan **mientras desarrollamos** (vite, eslint, karma, jasmine, webpack).
  Se instalan con `npm install -D`.

---

## Parte 4 · Agregar React Router

### 4.1 Instalar

```bash
npm install react-router
```

**¿Para qué?** Una app React es una sola página (SPA). React Router hace que distintas URLs
(`/portafolio`, `/pokedex`, …) muestren distintos componentes **sin recargar** la página.

### 4.2 Envolver la app con un Router — `src/main.jsx`

```jsx
import { HashRouter } from 'react-router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
```

**¿Por qué `HashRouter` y no `BrowserRouter`?** GitHub Pages es un servidor de archivos estáticos.
Con `BrowserRouter`, si alguien recarga `https://usuario.github.io/repo/pokedex`, el servidor busca
un archivo `pokedex` que no existe → **error 404**. Con `HashRouter` la URL queda
`https://usuario.github.io/repo/#/pokedex`: todo lo que va después de `#` **nunca se envía al
servidor**, así que siempre se carga `index.html` y React Router resuelve la ruta.

### 4.3 Definir las rutas — `src/App.jsx`

```jsx
<Routes>
  <Route element={<Layout />}>                         {/* ruta "layout": navbar + footer */}
    <Route index element={<Home />} />                 {/* /            */}
    <Route path="portafolio" element={<Portfolio />} />{/* /portafolio  */}
    <Route path="pokedex" element={<Pokedex />} />     {/* /pokedex     */}
    <Route path="pokedex/:name" element={<PokemonDetail />} /> {/* ruta dinámica */}
    <Route path="*" element={<NotFound />} />          {/* cualquier otra → 404 */}
  </Route>
</Routes>
```

Conceptos clave que usa el proyecto:

| API | Dónde | Para qué |
| --- | --- | --- |
| `<Outlet />` | `components/Layout.jsx` | Lugar donde se dibuja la página hija de la ruta actual. |
| `<NavLink>` | `components/Navbar.jsx` | Como `<Link>`, pero agrega la clase `active` al link de la página actual. |
| `<Link>` | tarjetas, botones | Navega sin recargar (nunca uses `<a href>` para rutas internas). |
| `useParams()` | `pages/PokemonDetail.jsx` | Lee `:name` de la URL (`/pokedex/pikachu` → `name = "pikachu"`). |
| `useSearchParams()` | `pages/Pokedex.jsx` | Lee/escribe `?page=2` en la URL; así la página se puede compartir y el botón "atrás" funciona. |
| `useNavigate()` | `pages/Pokedex.jsx` | Navega desde código (al enviar el buscador). |

---

## Parte 5 · Consumir APIs: GitHub y PokeAPI

### 5.1 Un hook reutilizable — `src/hooks/useFetch.js`

En lugar de repetir `fetch` + `useEffect` + `useState` en cada página, creamos un **custom hook**:

```jsx
const { data, error, loading } = useFetch('https://pokeapi.co/api/v2/pokemon/pikachu')
```

Detalles importantes del hook:

- Usa `AbortController` para **cancelar** la petición anterior si cambia la URL o se sale de la
  página (evita mostrar datos viejos).
- Revisa `res.ok`: `fetch` **no** lanza error ante un 404, hay que comprobarlo a mano.
- `loading` se **deriva** comparando la URL pedida con la URL de la última respuesta, en vez de
  hacer `setLoading(true)` dentro del efecto (la regla de ESLint de React Hooks lo desaconseja
  porque provoca renders extra).

### 5.2 Servicios — `src/services/`

Separamos las URLs y funciones de ayuda de los componentes:

- `github.js`: usuario `donkiwicl`, URL del perfil, del avatar y de la API
  `https://api.github.com/users/donkiwicl/repos`. `prepareRepos()` quita *forks* y ordena por estrellas.
- `pokeapi.js`: `https://pokeapi.co/api/v2/pokemon?limit=24&offset=…` para la lista y
  `/pokemon/{nombre}` para el detalle. La lista solo trae nombre y URL, así que `getIdFromUrl()`
  saca el número para construir la URL de la imagen.

**¿Por qué separar?** Las funciones puras (sin React) son **fáciles de probar** (Parte 6) y si la
API cambia, se modifica en un solo lugar.

### 5.3 Páginas

| Página | API | Qué practica |
| --- | --- | --- |
| `Home.jsx` | — | Componentes, JSX, listas con `key` |
| `Portfolio.jsx` | GitHub REST | `useFetch`, `useState` para el filtro por lenguaje, valores derivados |
| `Pokedex.jsx` | PokeAPI (lista) | Paginación con `useSearchParams`, formulario controlado, `useNavigate` |
| `PokemonDetail.jsx` | PokeAPI (detalle) | `useParams`, manejo de errores (Pokémon inexistente) |

> ℹ️ La API de GitHub sin autenticación permite **60 peticiones por hora por IP**. Si ves
> "Error 403", espera un rato. PokeAPI no tiene ese límite práctico.

---

## Parte 6 · Pruebas unitarias y de componentes con Jasmine y Karma

### 6.0 ¿Quién hace qué?

- **Jasmine** es el *framework* de pruebas: da `describe`, `it`, `expect`, `beforeEach`, `spyOn`…
  Por sí solo no sabe abrir un navegador.
- **Karma** es el *test runner*: levanta un pequeño servidor, **abre Chrome**, le envía las
  pruebas, recibe los resultados y los muestra en la terminal.
- **webpack** (vía `karma-webpack`) empaqueta los archivos de prueba antes de enviarlos, porque
  el navegador no entiende JSX ni los `import` de paquetes de npm.

```
 terminal ── karma start ──► servidor Karma ──► webpack + Babel (JSX → JS)
                                   │
                                   ▼
                         Chrome (headless) ejecuta Jasmine
                                   │
                    resultados ◄───┘ (progress, cobertura, JUnit)
```

**Ventaja frente a Vitest + jsdom:** las pruebas corren en un **navegador de verdad** (CSS, eventos
y APIs reales). **Desventaja:** más configuración y algo más lento al arrancar.

### 6.1 Instalar

```bash
npm install -D karma karma-jasmine jasmine-core karma-chrome-launcher karma-jasmine-html-reporter
npm install -D karma-webpack webpack babel-loader @babel/preset-react@7
npm install -D @testing-library/react @testing-library/user-event @testing-library/jasmine-dom
```

| Paquete | Rol |
| --- | --- |
| `karma` | El *test runner*: servidor + control de navegadores + reportes. |
| `jasmine-core` | La librería de pruebas Jasmine (`describe`, `it`, `expect`, `spyOn`…). |
| `karma-jasmine` | Adaptador que conecta Karma con Jasmine. |
| `karma-chrome-launcher` | Abre Chrome (con ventana o *headless*) desde Karma. |
| `karma-jasmine-html-reporter` | Muestra los resultados dentro de la ventana de Chrome (útil en modo *watch*). |
| `karma-webpack` + `webpack` | Empaquetan cada archivo de prueba con sus `import`. |
| `babel-loader` + `@babel/preset-react` | Convierten JSX a JavaScript. Se fija la **v7** porque el proyecto ya usa `@babel/core` 7 (la v8 del preset exige Babel 8). |
| `@testing-library/react` | Renderiza componentes y los busca **como lo haría un usuario** (por texto, rol, label). |
| `@testing-library/user-event` | Simula clics y escritura de forma realista. |
| `@testing-library/jasmine-dom` | Agrega a Jasmine matchers como `toBeInTheDocument()` o `toHaveAttribute()`. |

> ❌ **No** se instala `jsdom`: el DOM lo pone Chrome.

**Chrome.** `karma-chrome-launcher` busca Google Chrome en las rutas habituales de Windows, macOS
y Linux. Si no lo encuentra (o usas Chromium), indica la ruta con la variable `CHROME_BIN`:

```bash
# Linux / macOS
export CHROME_BIN=/usr/bin/chromium
# Windows (PowerShell)
$env:CHROME_BIN = "C:\Program Files\Google\Chrome\Application\chrome.exe"
```

#### Una sola versión de Jasmine — `overrides` en `package.json`

`karma-jasmine` 5 trae **su propia copia** de `jasmine-core` 4 escondida en
`node_modules/karma-jasmine/node_modules/`, y es esa la que termina corriendo las pruebas, aunque
hayamos instalado `jasmine-core` 7. Para que todo use la misma versión, agrega en `package.json`:

```json
"overrides": {
  "karma-jasmine": { "jasmine-core": "$jasmine-core" }
}
```

`"$jasmine-core"` significa "la misma versión que está en mis `devDependencies`". Después ejecuta
`npm install` y compruébalo:

```bash
npm ls jasmine-core   # todas las líneas deben mostrar la misma versión (ej: 7.0.2)
```

### 6.2 Configurar — `karma.conf.cjs`

Crea el archivo en la raíz del proyecto:

```js
// Configuración de Karma: abre un navegador real, carga las pruebas de Jasmine y muestra resultados.
// Es .cjs porque Karma lee su configuración con require() (CommonJS) y el proyecto es "type": "module".
module.exports = function (config) {
  // `karma start --coverage` activa la medición de cobertura (Parte 6.6).
  const coverage = process.argv.includes('--coverage')

  config.set({
    frameworks: ['jasmine', 'webpack'],
    files: [
      'src/test/setup.js',
      // Dos patrones en vez de '*.spec.{js,jsx}': Karma 6 falla con las llaves {…} en los globs.
      { pattern: 'src/**/*.spec.js', watched: false },
      { pattern: 'src/**/*.spec.jsx', watched: false },
    ],
    preprocessors: {
      'src/test/setup.js': ['webpack'],
      'src/**/*.spec.js': ['webpack'],
      'src/**/*.spec.jsx': ['webpack'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            // El proyecto es "type": "module"; sin esto webpack trata src/ como ESM estricto y el
            // `import X from` de paquetes CommonJS (como jasmine-dom) devuelve { default: X }.
            type: 'javascript/auto',
            use: {
              loader: 'babel-loader',
              options: {
                // configFile/babelrc en false: esta config de Babel es solo para las pruebas.
                babelrc: false,
                configFile: false,
                presets: [['@babel/preset-react', { runtime: 'automatic' }]],
                plugins: coverage
                  ? [['istanbul', { exclude: ['**/*.spec.{js,jsx}', 'src/test/**'] }]]
                  : [],
              },
            },
          },
        ],
      },
    },
    reporters: ['progress', 'kjhtml', 'junit', ...(coverage ? ['coverage'] : [])],
    // Informe JUnit (XML): lo entienden GitHub Actions, Jenkins, GitLab… Sirve como evidencia.
    junitReporter: { outputDir: 'test-results', useBrowserName: false, outputFile: 'junit.xml' },
    coverageReporter: {
      dir: 'coverage',
      subdir: '.',
      reporters: [{ type: 'text' }, { type: 'html' }, { type: 'lcovonly' }],
      check: {
        global: { statements: 80, branches: 80, functions: 80, lines: 80 },
      },
    },
    client: { jasmine: { random: true }, clearContext: false },
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadlessCI: { base: 'ChromeHeadless', flags: ['--no-sandbox'] },
    },
    restartOnFileChange: true,
  })
}
```

Puntos clave:

| Opción | Por qué |
| --- | --- |
| Extensión **`.cjs`** | El proyecto tiene `"type": "module"` en `package.json`, pero Karma carga su configuración con `require()`. `.cjs` le dice a Node "este archivo es CommonJS". |
| `frameworks` | `jasmine` carga Jasmine en el navegador; `webpack` prepara los paquetes. |
| `files` | Primero `setup.js` (agrega los matchers), luego todas las pruebas `*.spec.js` / `*.spec.jsx`. Convención de Jasmine: las pruebas terminan en **`.spec`** (en Vitest usábamos `.test`). |
| `preprocessors` | Cada archivo pasa por webpack antes de llegar al navegador. |
| `type: 'javascript/auto'` | Ver el comentario: sin esto `jasmine-dom` llega envuelto en `{ default: … }` y los matchers no existen. |
| `babel-loader` sin React Compiler | Las pruebas no necesitan la optimización del compilador (y, como en la guía de Vitest, ensuciaría la cobertura con ramas internas). `npm run dev` y `npm run build` lo siguen usando porque Vite no lee esta configuración. |
| `reporters` | `progress`: barra en la terminal · `kjhtml`: resultados en la ventana de Chrome · `junit`: XML para CI · `coverage`: solo con `--coverage`. |
| `client.jasmine.random` | Jasmine ejecuta las pruebas en **orden aleatorio** para detectar pruebas que dependen unas de otras. |
| `browsers: ['ChromeHeadless']` | Chrome sin ventana: más rápido y funciona en servidores de CI. |
| `ChromeHeadlessCI` | Variante con `--no-sandbox`, necesaria en contenedores de CI y en algunas versiones de Ubuntu (ver Parte 10). |

### 6.3 Archivo de setup — `src/test/setup.js`

```js
// Agrega matchers como toBeInTheDocument() a expect de Jasmine.
import JasmineDOM from '@testing-library/jasmine-dom'

beforeAll(() => {
  jasmine.addMatchers(JasmineDOM)
})
```

Testing Library **limpia el DOM automáticamente** después de cada prueba porque detecta el
`afterEach` global de Jasmine; no hay que llamar a `cleanup()` a mano.

### 6.4 Scripts en `package.json`

```json
"test": "karma start karma.conf.cjs",                              // modo watch
"test:run": "karma start karma.conf.cjs --single-run",             // una sola vez
"test:coverage": "karma start karma.conf.cjs --single-run --coverage"  // una vez + cobertura (CI)
```

Hay que pasar `karma.conf.cjs` explícitamente: Karma solo busca automáticamente `karma.conf.js`,
`.ts` o `.coffee`, **no** `.cjs`.

- `npm test` deja Karma abierto y **vuelve a ejecutar las pruebas al guardar** un archivo.
- Para **ver** las pruebas en Chrome con la interfaz de `kjhtml`, usa un Chrome con ventana:
  `npm test -- --browsers Chrome`. Desde esa ventana, el botón **DEBUG** abre una pestaña donde
  puedes usar las DevTools (F12) y poner *breakpoints* en tus pruebas.

### 6.5 Qué pruebas hay (y cómo se traducen desde Vitest)

- `src/services/*.spec.js` → **pruebas unitarias** de funciones puras (ej: `getIdFromUrl`).
- `src/App.spec.jsx` → **pruebas de componentes**: renderiza la app en una ruta con
  `MemoryRouter` (helper `src/test/renderWithRouter.jsx`, igual que en la otra guía) y comprueba
  navegación, Pokédex, detalle, error 404 y filtros del portafolio.

Las pruebas unitarias son **idénticas** a las de Vitest, solo que **sin** la línea
`import { describe, expect, it } from 'vitest'`: en Jasmine esas funciones son globales.

```js
import { capitalize, formatId, getIdFromUrl, pokemonListUrl } from './pokeapi.js'

describe('pokeapi helpers', () => {
  it('extrae el id desde la URL de PokeAPI', () => {
    expect(getIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25)
    expect(getIdFromUrl('no-es-una-url')).toBeNull()
  })
})
```

**Mocks con espías de Jasmine.** Las pruebas **no llaman a internet**. En `src/test/mocks.js`,
`mockFetch` usa `spyOn` sobre el `fetch` real del navegador:

```js
/** Reemplaza window.fetch por un espía que responde según la URL pedida. */
export function mockFetch(routes) {
  // spyOn se deshace solo al terminar cada prueba: no hace falta restaurarlo a mano.
  return spyOn(window, 'fetch').and.callFake(async (url) => {
    const entry = Object.entries(routes).find(([pattern]) => url.includes(pattern))
    if (!entry) return { ok: false, status: 404, json: async () => ({}) }
    return { ok: true, status: 200, json: async () => entry[1] }
  })
}
```

| Vitest | Jasmine |
| --- | --- |
| `vi.fn(impl)` | `jasmine.createSpy('nombre').and.callFake(impl)` |
| `vi.stubGlobal('fetch', fn)` + `vi.unstubAllGlobals()` | `spyOn(window, 'fetch').and.callFake(fn)` (se restaura solo) |
| `mock.mockReturnValue(x)` | `spy.and.returnValue(x)` |
| `expect(fn).toHaveBeenCalledWith(a)` | `expect(spy).toHaveBeenCalledWith(a)` (igual) |
| `expect(x).toBeInTheDocument()` (jest-dom) | `expect(x).toBeInTheDocument()` (jasmine-dom, igual) |

> ⚠️ **Diferencia importante con Vitest: los `beforeEach` sueltos son globales.**
> En Vitest cada archivo es independiente. En Jasmine (con Karma) **todos los archivos comparten
> una misma "suite raíz"**: un `beforeEach` escrito fuera de cualquier `describe` se ejecuta antes
> de **todas** las pruebas de **todos** los archivos. Por eso en `App.spec.jsx` todo va dentro de
> un `describe('App', …)`:
>
> ```jsx
> describe('App', () => {
>   beforeEach(() => {
>     mockFetch({ '/pokemon?limit': pokemonList, '/pokemon/pikachu': pikachu, '/users/donkiwicl/repos': repos })
>   })
>
>   describe('Navegación', () => {
>     it('muestra la portada con enlace a GitHub', () => { /* … */ })
>   })
> })
> ```
>
> Si lo dejas suelto, otro archivo que también llame a `mockFetch` falla con
> `Error: <spyOn> : fetch has already been spied upon`.

```bash
npm run test:run
```

Resultado esperado: `TOTAL: 15 SUCCESS` (12 unitarias/de componentes + 3 de integración de la Parte 7).

### 6.6 Cobertura de código con karma-coverage

**¿Qué es la cobertura?** Mide **qué partes del código se ejecutaron** mientras corrían las
pruebas. No dice si las pruebas son *buenas*, pero sí muestra qué código **nadie está probando**.

#### 6.6.1 Instalar

```bash
npm install -D karma-coverage babel-plugin-istanbul
```

| Paquete | Rol |
| --- | --- |
| `babel-plugin-istanbul` | **Instrumenta** el código: al compilarlo con Babel le agrega contadores ("¿se ejecutó esta línea/rama?"). |
| `karma-coverage` | Recoge esos contadores desde Chrome al terminar y genera los informes. |

> ℹ️ Vitest usaba la cobertura nativa del motor V8; aquí se usa **Istanbul**, que modifica el
> código antes de ejecutarlo. Los resultados son prácticamente los mismos.

#### 6.6.2 Configurar

Ya está incluido en el `karma.conf.cjs` de la Parte 6.2. Las piezas son:

```js
const coverage = process.argv.includes('--coverage')
// …
plugins: coverage
  ? [['istanbul', { exclude: ['**/*.spec.{js,jsx}', 'src/test/**'] }]]
  : [],
// …
reporters: ['progress', 'kjhtml', 'junit', ...(coverage ? ['coverage'] : [])],
coverageReporter: {
  dir: 'coverage',
  subdir: '.',
  reporters: [{ type: 'text' }, { type: 'html' }, { type: 'lcovonly' }],
  check: {
    global: { statements: 80, branches: 80, functions: 80, lines: 80 },
  },
},
```

| Opción | Por qué |
| --- | --- |
| `--coverage` (flag propio) | Instrumentar hace las pruebas más lentas y dificulta depurar, así que solo se activa cuando se pide. `process.argv` lee los argumentos del comando. |
| `exclude` del plugin | No tiene sentido medir las propias pruebas ni los mocks de `src/test/`. `main.jsx` no aparece porque ninguna prueba lo importa. |
| `reporters` | `text` imprime la tabla en la terminal; `html` genera `coverage/index.html`; `lcovonly` crea `coverage/lcov.info` para VS Code, SonarQube, Codecov, etc. |
| `subdir: '.'` | Por defecto karma-coverage crea una subcarpeta con el nombre del navegador (`coverage/Chrome Headless 153…/`); así queda directo en `coverage/`. |
| `check.global` | **Mínimos obligatorios**: si la cobertura baja del 80 %, Karma termina con error y el CI se detiene. |

> ⚠️ A diferencia de la opción `include` de Vitest, Istanbul **solo mide los archivos que alguna
> prueba importó**. Un archivo sin ninguna prueba no aparece (en lugar de aparecer con 0 %).
> Aquí no es problema porque las pruebas renderizan `App.jsx`, que importa todas las páginas.

#### 6.6.3 Ejecutar y leer el informe

```bash
npm run test:coverage
```

Al final aparece una tabla como esta (recortada):

```
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |   96.66 |    83.63 |   95.55 |    98.7 |
  Status.jsx       |     100 |        0 |     100 |     100 | 2
  useFetch.js      |   93.75 |    83.33 |     100 |     100 | 14,24
  Pokedex.jsx      |   94.11 |    83.33 |   85.71 |   93.33 | 61
  github.js        |    92.3 |       50 |   85.71 |     100 | 17
```

A diferencia de Vitest, karma-coverage muestra **todos** los archivos, también los que están al 100 %.

| Columna | Qué mide |
| --- | --- |
| **Stmts** (sentencias) | Instrucciones ejecutadas al menos una vez. |
| **Branch** (ramas) | Cada camino de un `if`, `? :`, `&&`, `||`, valores por defecto… ¿se probaron todos? |
| **Funcs** (funciones) | Funciones que se llamaron al menos una vez. |
| **Lines** (líneas) | Líneas ejecutadas. |
| **Uncovered Line #s** | Líneas exactas que ninguna prueba ejecutó: **por ahí empezar a escribir tests**. |

Para verlo con colores, abre `coverage/index.html` en el navegador: las líneas en **rojo** no se
ejecutaron y las marcadas en **amarillo** tienen ramas sin probar.

La carpeta `coverage/` se regenera en cada ejecución: agrégala a `.gitignore` y a los
`globalIgnores` de `eslint.config.js` (si no, ESLint revisaría los `.js` del informe). Lo mismo
con `test-results/` (informe JUnit).

> 🎯 **100 % no es la meta.** Un 80–90 % con pruebas que verifican comportamiento real vale más
> que un 100 % logrado con tests que solo "pasan por" el código sin comprobar nada.

---

## Parte 7 · Pruebas de integración en navegador real con Karma

### 7.1 ¿Por qué no hay "E2E" en esta versión?

En la otra guía, Playwright **compila la app**, la sirve con `vite preview` y la recorre como un
usuario (incluido el título de la pestaña, el `index.html` y las rutas del build). Karma **no
hace eso**: carga *nuestras pruebas* en una página propia y las ejecuta ahí. No visita la app
publicada ni puede pasar de una página a otra.

Lo más cercano que se puede hacer con Jasmine + Karma es una **prueba de integración**: montar la
**app completa** con el **mismo router que en producción** (`HashRouter`, no `MemoryRouter`) en un
Chrome real, y comprobar la URL (`window.location.hash`) igual que lo hacía Playwright.

| | Playwright (E2E) | Karma (integración) |
| --- | --- | --- |
| Qué se prueba | El build real (`dist/`) servido por HTTP | El código fuente empaquetado por webpack |
| Navegador | Chromium, Firefox, WebKit | Chrome (u otros con su *launcher*) |
| Detecta errores de build / `base: './'` / `index.html` | ✅ | ❌ (lo cubre `npm run build` en CI) |
| Clics, formularios, URL con `#/` | ✅ | ✅ |
| Interceptar red | `page.route()` | `spyOn(window, 'fetch')` |
| Capturas y video | ✅ | ❌ |

> 🕰️ Históricamente, el compañero E2E de Jasmine + Karma era **Protractor** (también basado en
> Jasmine), que fue **descontinuado en 2023**. Hoy se usa Playwright o Cypress para E2E aunque las
> pruebas unitarias sigan en Jasmine.

### 7.2 Pruebas — `src/integration/pokedex.spec.jsx`

Como el archivo termina en `.spec.jsx`, Karma lo encuentra solo (no hay configuración extra).

```jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HashRouter } from 'react-router'
import App from '../App.jsx'
import { mockFetch, pikachu, pokemonList } from '../test/mocks.js'

// Pruebas de integración: la app completa con el MISMO router que en producción (HashRouter),
// en un navegador real. Revisamos la URL (window.location.hash) como lo haría un usuario.
function renderApp(hash = '#/') {
  window.location.hash = hash
  return render(
    <HashRouter>
      <App />
    </HashRouter>,
  )
}

describe('Pokédex (integración)', () => {
  beforeEach(() => {
    mockFetch({ '/pokemon?limit': pokemonList, '/pokemon/pikachu': pikachu })
  })

  afterEach(() => {
    window.location.hash = '' // cada prueba parte desde una URL limpia
  })

  it('lista Pokémon y abre el detalle al hacer clic', async () => {
    const user = userEvent.setup()
    renderApp('#/pokedex')
    await user.click(await screen.findByRole('link', { name: /pikachu/i }))
    expect(window.location.hash).toBe('#/pokedex/pikachu')
    expect(await screen.findByRole('heading', { name: 'Pikachu' })).toBeVisible()
  })

  it('la paginación actualiza la URL', async () => {
    const user = userEvent.setup()
    renderApp('#/pokedex')
    await user.click(await screen.findByRole('button', { name: 'Siguiente →' }))
    expect(window.location.hash).toContain('page=2')
    expect(await screen.findByText('Página 2 de 2')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Siguiente →' })).toBeDisabled()
  })

  it('una ruta inexistente muestra 404', () => {
    renderApp('#/esta-ruta-no-existe')
    expect(screen.getByRole('heading', { name: '404' })).toBeVisible()
  })
})
```

Detalles:

- `toBeVisible()` sí tiene sentido aquí: en Chrome real se calcula el CSS de verdad (en jsdom
  casi todo "es visible").
- Las pruebas de integración también suman a la **cobertura** (por eso sube a ~96 % de sentencias).

### 7.3 ESLint para Jasmine y Karma — `eslint.config.js`

`describe`, `it`, `expect`, `spyOn`, `jasmine`… son **globales** en Jasmine, y `karma.conf.cjs`
usa `module.exports` y `process`. Agrega estos bloques al `eslint.config.js` que generó Vite:

```js
globalIgnores(['dist', 'coverage', 'test-results']),
// …
{
  // Archivos de configuración que se ejecutan en Node.
  files: ['*.config.js'],
  languageOptions: { globals: globals.node },
},
{
  // karma.conf.cjs es CommonJS (module.exports / require).
  files: ['*.cjs'],
  languageOptions: { globals: globals.node, sourceType: 'commonjs' },
},
{
  // Pruebas de Jasmine: describe, it, expect, spyOn, jasmine… son globales.
  files: ['**/*.spec.{js,jsx}', 'src/test/**'],
  languageOptions: { globals: globals.jasmine },
  rules: { 'react-refresh/only-export-components': 'off' },
},
```

---

## Parte 8 · Preparar el proyecto para GitHub Pages

### 8.1 Rutas relativas — `vite.config.js`

```js
base: './',
```

**¿Por qué?** GitHub Pages publica el sitio en `https://<usuario>.github.io/<nombre-repo>/`
(una subcarpeta). Por defecto Vite genera rutas absolutas como `/assets/index.js`, que apuntarían
a `https://<usuario>.github.io/assets/…` → **pantalla en blanco**. Con `base: './'` las rutas son
relativas y funcionan **sin importar cómo se llame el repositorio**. Esto es posible porque usamos
`HashRouter` (Parte 4.2).

### 8.2 Workflow de GitHub Actions — `.github/workflows/deploy.yml`

GitHub Actions es un servicio de **CI/CD**: ejecuta comandos en una máquina de GitHub cada vez que
haces `git push`. Los runners `ubuntu-latest` **ya traen Google Chrome instalado**, así que Karma
lo encuentra sin pasos extra.

```yaml
name: CI y despliegue a GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  test-y-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm

      - name: Instalar dependencias
        run: npm ci

      - name: Lint (ESLint)
        run: npm run lint

      - name: Pruebas y cobertura (Jasmine + Karma en Chrome headless)
        run: npm run test:coverage -- --browsers ChromeHeadlessCI

      # Evidencia: informe de cobertura + resultados JUnit (se suben aunque fallen las pruebas).
      - name: Subir informe de cobertura
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v7
        with:
          name: coverage
          path: coverage/
          if-no-files-found: ignore
          retention-days: 30

      - name: Subir resultados de pruebas (JUnit)
        if: ${{ !cancelled() }}
        uses: actions/upload-artifact@v7
        with:
          name: test-results
          path: test-results/
          if-no-files-found: ignore
          retention-days: 30

      - name: Build de producción
        run: npm run build

      - name: Subir carpeta dist como artefacto de Pages
        if: github.ref == 'refs/heads/main'
        uses: actions/upload-pages-artifact@v5
        with:
          path: dist

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test-y-build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Publicar en GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

Resumen de los pasos:

1. `npm ci` → instala dependencias exactamente como dice `package-lock.json` (incluido el `overrides`).
2. `npm run lint` → si hay errores de código, se detiene.
3. `npm run test:coverage -- --browsers ChromeHeadlessCI` → todas las pruebas en Chrome headless
   + cobertura (falla si baja de los mínimos). `--no-sandbox` es necesario en las máquinas de CI.
4. Sube los artefactos `coverage` y `test-results`.
5. `npm run build` → genera `dist/`. Como no hay Playwright, **este paso es el que detecta un
   build roto**.
6. Sube `dist/` y lo **publica en GitHub Pages**.

Si **cualquier** paso falla, el sitio **no** se actualiza: nunca se publica código roto.

**Evidencia de las pruebas (artefactos).** Cada ejecución guarda dos artefactos que se descargan
desde la página del run (pestaña **Actions** → el run → sección **Artifacts**):

| Artefacto | Contenido | Cómo verlo |
| --- | --- | --- |
| `coverage` | Informe de cobertura de Istanbul (HTML + `lcov.info`) | Descomprime y abre `index.html`. |
| `test-results` | `junit.xml`: cada prueba con su nombre, duración y error (si falló) | Se abre con cualquier editor; herramientas como Jenkins, GitLab o extensiones de GitHub Actions lo muestran como tabla. |

Se suben **aunque las pruebas fallen** (`if: ${{ !cancelled() }}`), justamente para poder
investigar el error, y se conservan **30 días** (`retention-days: 30`); después GitHub los borra.

### 8.3 Probar el build localmente (recomendado antes de subir)

```bash
npm run build
npm run preview
```

Abre la URL que aparece (normalmente <http://localhost:4173>) y navega por todas las páginas.

---

## Parte 9 · Subir a GitHub y desplegar

### 9.1 Crear el repositorio en GitHub

1. Entra a <https://github.com/new>.
2. **Repository name:** por ejemplo `dsy1104-donkiwi`.
3. Visibilidad **Public** (GitHub Pages gratis requiere repositorio público).
4. **No** marques "Add a README" ni `.gitignore` (ya los tenemos).
5. Clic en **Create repository**.

### 9.2 Inicializar Git y hacer el primer commit

Desde la carpeta del proyecto:

```bash
git init                         # crea el repositorio local (carpeta oculta .git)
git branch -M main               # nombra la rama principal "main"
git add .                        # prepara todos los archivos (respeta .gitignore)
git commit -m "Proyecto inicial DSY1104: portafolio + pokédex"
```

### 9.3 Conectar con GitHub y subir

```bash
git remote add origin https://github.com/<tu-usuario>/dsy1104-donkiwi.git
git push -u origin main
```

- `remote add origin` guarda la dirección del repositorio remoto con el nombre `origin`.
- `push -u` sube la rama `main` y la deja "vinculada", así después basta con `git push`.

> 🔐 Si pide contraseña: GitHub ya **no acepta** la contraseña de la cuenta. Usa un
> *Personal Access Token* (Settings → Developer settings → Tokens) o inicia sesión con
> `gh auth login` / GitHub Desktop / VS Code.

### 9.4 Activar GitHub Pages (una sola vez)

1. En el repositorio: **Settings → Pages**.
2. En **Build and deployment → Source**, elige **GitHub Actions**.

### 9.5 Ver el despliegue

1. Pestaña **Actions** del repositorio: verás el workflow "CI y despliegue a GitHub Pages".
   (Si se ejecutó antes de activar Pages y falló, entra al run y presiona **Re-run all jobs**.)
2. Cuando termine en verde ✅, el sitio queda en:

```
https://<tu-usuario>.github.io/dsy1104-donkiwi/
```

Desde ahora, **cada `git push` a `main` vuelve a probar y publicar automáticamente**:

```bash
git add .
git commit -m "Describe tu cambio"
git push
```

### 9.6 Alternativa manual: paquete `gh-pages`

Si no quieres usar Actions, el proyecto también incluye el script `deploy`:

```bash
npm run deploy     # ejecuta "predeploy" (build) y sube dist/ a la rama gh-pages
```

Luego en **Settings → Pages → Source** elige **Deploy from a branch**, rama **gh-pages**, carpeta
**/ (root)**. Desventaja: no ejecuta las pruebas antes de publicar.

---

## Parte 10 · Problemas frecuentes

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `'npm' no se reconoce como comando` | Node no instalado o terminal abierta antes de instalar | Instala Node LTS y abre una terminal nueva. |
| Pantalla en blanco en GitHub Pages | Rutas absolutas en el build | Verifica `base: './'` en `vite.config.js`. |
| 404 al recargar una página publicada | Uso de `BrowserRouter` | Usa `HashRouter` (URLs con `#/`). |
| Workflow falla en "Deploy" con error de permisos | Pages no configurado | Settings → Pages → Source: **GitHub Actions** y re-ejecuta el workflow. |
| `npm ci` falla en Actions | `package-lock.json` no se subió o está desactualizado | Ejecuta `npm install`, haz commit del lock y vuelve a subir. |
| `npm run test:run` se queda en `Karma server started` sin hacer nada; con `--log-level debug` dice `No config file specified` | Karma no detecta `karma.conf.cjs` por su cuenta | Pasa el archivo en el script: `karma start karma.conf.cjs`. |
| `No binary for ChromeHeadless browser on your platform` | Karma no encuentra Chrome | Instala Google Chrome o define `CHROME_BIN` con la ruta del ejecutable (Parte 6.1). |
| `ChromeHeadless failed 2 times (cannot start)` con `No usable sandbox!` | Ubuntu 23.10+ bloquea el *sandbox* de navegadores que no vienen del sistema (o estás en Docker/CI) | Usa el lanzador sin sandbox: `npm run test:run -- --browsers ChromeHeadlessCI`. |
| `TypeError: Cannot read properties of undefined (reading 'mtime')` | Patrón con llaves (`*.spec.{js,jsx}`) en `files` de Karma | Usa dos patrones: `src/**/*.spec.js` y `src/**/*.spec.jsx`. |
| `expect(...).toBeInTheDocument is not a function` | Los matchers de jasmine-dom no se registraron | Revisa que `src/test/setup.js` esté primero en `files` y que la regla de webpack tenga `type: 'javascript/auto'`. |
| `Error: <spyOn> : fetch has already been spied upon` | Un `beforeEach` fuera de `describe` se aplica a **todos** los archivos | Mete el `beforeEach` dentro de un `describe` (Parte 6.5). |
| Las pruebas pasan a veces y fallan otras | Orden aleatorio de Jasmine: una prueba depende de otra | Haz que cada prueba prepare su propio estado; para reproducir un orden, fija la semilla: `client: { jasmine: { random: true, seed: '12345' } }`. |
| `npm ls jasmine-core` muestra dos versiones distintas | `karma-jasmine` trae su propio `jasmine-core` 4 | Agrega el bloque `overrides` (Parte 6.1) y ejecuta `npm install`. |
| `Coverage for branches (…%) does not meet global threshold (80%)` | La cobertura bajó del mínimo configurado | Agrega pruebas para las líneas de *Uncovered Line #s* (o revisa `coverage/index.html`). |
| `npm error ERESOLVE unable to resolve dependency tree` … `Found: @babel/core@7…` al instalar `@babel/preset-react` | La última versión del preset (v8) exige Babel 8 y el proyecto usa Babel 7 | `npm install -D @babel/preset-react@7` |
| Portafolio muestra "Error 403" | Límite de 60 peticiones/hora de la API de GitHub | Espera ~1 hora o prueba desde otra red. |
| ESLint: `'describe' is not defined` / `'module' is not defined` | Faltan los globals de Jasmine o de CommonJS | Revisa los bloques `globals.jasmine` y `*.cjs` en `eslint.config.js` (Parte 7.3). |

---

### Resumen de comandos usados para crear este proyecto

```bash
npm create vite@latest dsy1104-donkiwi -- --template react-compiler --eslint --no-interactive
cd dsy1104-donkiwi
npm install
npm install react-router
npm install -D karma karma-jasmine jasmine-core karma-chrome-launcher karma-jasmine-html-reporter
npm install -D karma-webpack webpack babel-loader @babel/preset-react@7
npm install -D @testing-library/react @testing-library/user-event @testing-library/jasmine-dom
npm install -D karma-coverage babel-plugin-istanbul karma-junit-reporter
npm install -D gh-pages
# + agregar "overrides" en package.json (Parte 6.1) y volver a ejecutar:
npm install
```

¡Éxito en DSY1104! 🥝
