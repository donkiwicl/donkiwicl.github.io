import { useEffect, useState } from 'react'

/**
 * Hook reutilizable para pedir JSON a una API.
 * Devuelve { data, error, loading } y se vuelve a ejecutar cuando cambia la URL.
 *
 * Guardamos junto a la respuesta la URL que la produjo: si no coincide con la URL
 * actual, significa que la nueva petición todavía está en curso (loading = true).
 */
export function useFetch(url) {
  const [result, setResult] = useState({ url: null, data: null, error: null })

  useEffect(() => {
    if (!url) return
    const controller = new AbortController()

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status} al consultar la API`)
        return res.json()
      })
      .then((data) => setResult({ url, data, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setResult({ url, data: null, error })
      })

    // Si el componente se desmonta o cambia la URL, cancelamos la petición anterior.
    return () => controller.abort()
  }, [url])

  const isCurrent = result.url === url
  return {
    data: isCurrent ? result.data : null,
    error: isCurrent ? result.error : null,
    loading: Boolean(url) && !isCurrent,
  }
}
