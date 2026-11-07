// Layout of the client side: top navbar + page + footer.
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ClientLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="client-layout">
      <header className="navbar">
        <Link to="/" className="logo">🧁 Frost &amp; Flour</Link>
        <nav className="navbar__links">
          <NavLink to="/">Catalog</NavLink>
          {user && <NavLink to="/orders">My orders</NavLink>}
        </nav>
        <div className="navbar__actions">
          {user ? (
            <>
              <NavLink to="/cart" aria-label="Cart">🛒</NavLink>
              <NavLink to="/profile">{user.firstName}</NavLink>
              <button className="btn btn--ghost" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <NavLink to="/login" className="btn">Log in</NavLink>
          )}
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>

      <footer className="footer">Frost &amp; Flour — freshly baked happiness</footer>
    </div>
  )
}
