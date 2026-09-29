import { Outlet } from 'react-router'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

// <Outlet /> es el "hueco" donde React Router dibuja la página de la ruta actual.
export default function Layout() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
