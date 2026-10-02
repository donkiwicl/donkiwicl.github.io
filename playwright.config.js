import { defineConfig, devices } from '@playwright/test'

// Pruebas end-to-end (E2E): Playwright abre un navegador real y usa la app como un usuario.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Además del reporte en consola, se genera un informe HTML en playwright-report/
  // (en CI se sube como artefacto de GitHub Actions como evidencia de las pruebas).
  reporter: [[process.env.CI ? 'github' : 'list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    // Evidencia: captura al final de cada prueba y video solo cuando una falla.
    screenshot: 'on',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Playwright compila la app y levanta `vite preview` antes de correr las pruebas.
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
