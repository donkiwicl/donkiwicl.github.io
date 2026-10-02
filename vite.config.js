import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // base: './' genera rutas relativas en el build, así el sitio funciona en
  // https://<usuario>.github.io/<nombre-del-repo>/ sin importar cómo se llame el repo.
  base: './',
  plugins: [
    react(),
    // React Compiler: memoriza componentes automáticamente (sin useMemo/useCallback manuales).
    // En las pruebas (process.env.VITEST) se desactiva: el compilador agrega ramas internas de
    // caché que ensucian el informe de cobertura y no son código escrito por nosotros.
    !process.env.VITEST && babel({ presets: [reactCompilerPreset()] }),
  ],
  // Configuración de Vitest (pruebas unitarias / de componentes).
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx}'],
    css: false,
    // Cobertura de código: qué porcentaje del código ejecutan las pruebas.
    // Se genera con `npm run test:coverage` y queda en la carpeta coverage/.
    coverage: {
      provider: 'v8',
      // text: tabla en la terminal · html: informe navegable (coverage/index.html)
      // lcov: formato estándar que leen VS Code, SonarQube, Codecov, etc.
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/test/**', 'src/main.jsx'],
      // Si la cobertura baja de estos mínimos, el comando falla (y también el CI).
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
})
