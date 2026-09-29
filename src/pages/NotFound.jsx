import { Link } from 'react-router'

export default function NotFound() {
  return (
    <section className="not-found">
      <h1>404</h1>
      <p className="lead">Esta página no existe… ¡ni siquiera en la hierba alta!</p>
      <Link to="/" className="btn btn--primary">Volver al inicio</Link>
    </section>
  )
}
