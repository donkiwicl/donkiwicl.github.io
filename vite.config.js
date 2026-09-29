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
    babel({ presets: [reactCompilerPreset()] }),
  ],
  // Configuración de Vitest (pruebas unitarias / de componentes).
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    include: ['src/**/*.test.{js,jsx}'],
    css: false,
  },
})
