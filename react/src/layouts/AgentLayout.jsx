// Layout of the agent back-office: lavender sidebar + page.
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AgentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="agent-layout">
      <aside className="sidebar">
        <div className="logo"><i className="bi bi-cake2-fill"></i> Frost &amp; Flour</div>
        <nav>
          <NavLink to="/agent/orders">Orders</NavLink>
          <NavLink to="/agent/products">Products</NavLink>
          <NavLink to="/agent/categories">Categories</NavLink>
          <NavLink to="/agent/clients">Clients</NavLink>
          <NavLink to="/agent/agents/new">New agent</NavLink>
        </nav>
        <button className="btn btn--ghost" onClick={handleLogout}>Log out</button>
      </aside>

      <main className="agent-main">
        <p className="muted">Logged in as {user?.firstName}</p>
        <Outlet />
      </main>
    </div>
  )
}
