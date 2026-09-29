// Mensajes de carga y error reutilizables. role="status"/"alert" ayuda a lectores de pantalla (y a las pruebas).
export function Loading({ text = 'Cargando…' }) {
  return (
    <p className="status" role="status">
      <span className="spinner" aria-hidden="true" /> {text}
    </p>
  )
}

export function ErrorMessage({ error }) {
  return (
    <p className="status status--error" role="alert">
      Ups, algo salió mal: {error.message}
    </p>
  )
}
