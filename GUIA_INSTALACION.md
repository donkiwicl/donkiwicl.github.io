# Guía paso a paso · DSY1104

## Portafolio DonKiwi + Pokédex con Vite, React, React Router, Vitest, Playwright y GitHub Pages

Esta guía construye el proyecto **desde una carpeta vacía** hasta tenerlo publicado en internet.
En cada paso se explica **qué hacemos** y **por qué lo hacemos**. Todos los comandos se escriben en la
terminal (en Windows puedes usar PowerShell o la terminal integrada de VS Code).

> 💡 Si solo quieres **ejecutar** el proyecto ya terminado, ve directo a la [Parte 0](#parte-0--ejecutar-el-proyecto-terminado).

---

## Índice

0. [Ejecutar el proyecto terminado](#parte-0--ejecutar-el-proyecto-terminado)
1. [Requisitos previos](#parte-1--requisitos-previos)
2. [Crear el proyecto con Vite + React Compiler](#parte-2--crear-el-proyecto-con-vite--react-compiler)
3. [Entender lo que se generó](#parte-3--entender-lo-que-se-generó)
4. [Agregar React Router](#parte-4--agregar-react-router)
5. [Consumir APIs: GitHub y PokeAPI](#parte-5--consumir-apis-github-y-pokeapi)
6. [Pruebas unitarias con Vitest](#parte-6--pruebas-unitarias-y-de-componentes-con-vitest)
7. [Pruebas end-to-end con Playwright](#parte-7--pruebas-end-to-end-con-playwright)
8. [Preparar el proyecto para GitHub Pages](#parte-8--preparar-el-proyecto-para-github-pages)
9. [Subir a GitHub y desplegar](#parte-9--subir-a-github-y-desplegar)
10. [Problemas frecuentes](#parte-10--problemas-frecuentes)

---

## Parte 0 · Ejecutar el proyecto terminado

```bash
npm install                       # 1. instala las dependencias listadas en package.json
npx playwright install chromium   # 2. descarga el navegador que usa Playwright (solo la primera vez)
npm run dev                       # 3. abre http://localhost:5173
```

Para verificar que todo funciona:

```bash
npm run lint        # revisa el estilo y errores comunes del código
npm run test:run    # pruebas unitarias y de componentes (Vitest)
npm run test:e2e    # pruebas en navegador real (Playwright)
npm run build       # genera la versión de producción en dist/
```

---

## Parte 1 · Requisitos previos

| Herramienta | Versión recomendada | Para qué sirve | Cómo comprobarla |
| --- | --- | --- | --- |
| **Node.js** | 22 LTS o superior (el proyecto se probó con 24) | Ejecuta JavaScript fuera del navegador. Vite, Vitest y Playwright corren sobre Node. | `node -v` |
| **npm** | viene con Node | Gestor de paquetes: descarga librerías desde el registro npm. | `npm -v` |
| **Git** | cualquiera reciente | Control de versiones; necesario para subir el código a GitHub. | `git --version` |
| **Cuenta de GitHub** | — | Para alojar el repositorio y publicar con GitHub Pages. | — |
| **VS Code** (opcional) | — | Editor. Extensiones útiles: *ESLint*, *Playwright Test for VSCode*, *Vitest*. | — |

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
- `devDependencies`: solo se usan **mientras desarrollamos** (vite, eslint, vitest, playwright).
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

## Parte 6 · Pruebas unitarias y de componentes con Vitest

### 6.1 Instalar

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

| Paquete | Rol |
| --- | --- |
| `vitest` | *Test runner* nativo de Vite (misma configuración, muy rápido). API compatible con Jest. |
| `jsdom` | Simula un navegador (DOM) dentro de Node, para renderizar componentes sin abrir Chrome. |
| `@testing-library/react` | Renderiza componentes y los busca **como lo haría un usuario** (por texto, rol, label). |
| `@testing-library/jest-dom` | Agrega verificaciones como `toBeInTheDocument()` o `toHaveAttribute()`. |
| `@testing-library/user-event` | Simula clics y escritura de forma realista. |

### 6.2 Configurar — `vite.config.js`

```js
export default defineConfig({
  // ...plugins
  test: {
    environment: 'jsdom',            // usar el DOM simulado
    globals: true,                   // describe/it/expect disponibles sin importar
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx}'],
  },
})
```

`src/test/setup.js` contiene una línea: `import '@testing-library/jest-dom/vitest'`.

### 6.3 Scripts en `package.json`

```json
"test": "vitest",          // modo watch: re-ejecuta al guardar
"test:run": "vitest run"   // una sola vez (para CI)
```

### 6.4 Qué pruebas hay

- `src/services/*.test.js` → **pruebas unitarias** de funciones puras (ej: `getIdFromUrl`).
- `src/App.test.jsx` → **pruebas de componentes**: renderiza la app en una ruta con
  `MemoryRouter` (un router que vive en memoria, ideal para tests) y comprueba navegación,
  Pokédex, detalle, error 404 y filtros del portafolio.

**Mocks:** las pruebas **no llaman a internet**. `src/test/mocks.js` reemplaza `fetch` con
`vi.stubGlobal('fetch', …)` y devuelve datos falsos. Así las pruebas son rápidas, repetibles y no
fallan si la API está caída.

```bash
npm run test:run
```

Resultado esperado: `Tests  12 passed (12)`.

---

## Parte 7 · Pruebas end-to-end con Playwright

### 7.1 Instalar

```bash
npm install -D @playwright/test
npx playwright install chromium
```

**¿Qué es E2E?** *End-to-end*: Playwright abre un **navegador real**, visita la app compilada y
hace clic/escribe como un usuario. Detecta problemas que jsdom no ve (build roto, rutas mal
configuradas para producción, CSS que oculta botones, etc.).

El segundo comando descarga Chromium (~150 MB) en una carpeta de caché del sistema, no en el proyecto.

> 🐧 En Linux, si falla por librerías faltantes: `npx playwright install --with-deps chromium`.

### 7.2 Configurar — `playwright.config.js`

Puntos clave:

```js
testDir: './e2e',
use: { baseURL: 'http://localhost:4173' },
webServer: {
  // Playwright compila y levanta la app antes de probar, tal como quedará en GitHub Pages
  command: 'npm run build && npm run preview -- --port 4173 --strictPort',
  url: 'http://localhost:4173',
},
```

### 7.3 Pruebas — carpeta `e2e/`

- `navegacion.spec.js`: título, link a GitHub, menú, página 404.
- `pokedex.spec.js`: lista → clic → detalle, paginación y buscador.

Se usa `page.route()` para **interceptar** las peticiones a PokeAPI/GitHub y responder con datos
falsos (misma idea que los mocks de Vitest).

```bash
npm run test:e2e        # modo consola
npm run test:e2e:ui     # interfaz visual: ves el navegador paso a paso (¡muy útil para aprender!)
```

Resultado esperado: `6 passed`.

> **Vitest vs. Playwright:** Vitest prueba piezas (funciones, componentes) en milisegundos;
> Playwright prueba la app completa en un navegador real, más lento pero más cercano al usuario.
> Se complementan.

### 7.4 ESLint y archivos de Node

`playwright.config.js` usa `process.env`, que existe en Node pero no en el navegador. En
`eslint.config.js` agregamos un bloque para que ESLint lo sepa:

```js
{
  files: ['*.config.js', 'e2e/**/*.js'],
  languageOptions: { globals: globals.node },
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
haces `git push`. Nuestro workflow:

1. `npm ci` → instala dependencias exactamente como dice `package-lock.json`.
2. `npm run lint` → si hay errores de código, se detiene.
3. `npm run test:run` → pruebas Vitest.
4. `npx playwright install --with-deps chromium` y `npm run test:e2e` → pruebas E2E.
5. `npm run build` → genera `dist/`.
6. Sube `dist/` y lo **publica en GitHub Pages**.

Si **cualquier** paso falla, el sitio **no** se actualiza: nunca se publica código roto.

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
| Playwright: `Executable doesn't exist` | Falta el navegador | `npx playwright install chromium` |
| Playwright: `port 4173 is already in use` | Quedó un `npm run preview` abierto | Ciérralo con Ctrl + C o reinicia la terminal. |
| Portafolio muestra "Error 403" | Límite de 60 peticiones/hora de la API de GitHub | Espera ~1 hora o prueba desde otra red. |
| ESLint: `'process' is not defined` | Archivo de Node revisado con globals de navegador | Revisa el bloque `globals.node` en `eslint.config.js`. |

---

### Resumen de comandos usados para crear este proyecto

```bash
npm create vite@latest dsy1104-donkiwi -- --template react-compiler --eslint --no-interactive
cd dsy1104-donkiwi
npm install
npm install react-router
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test gh-pages
npx playwright install chromium
```

¡Éxito en DSY1104! 🥝
