// All the pages of the app and who can see them.
import { Route, Routes } from 'react-router-dom'
import ClientLayout from './layouts/ClientLayout'
import AgentLayout from './layouts/AgentLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { ROLES } from './utils/constants'

import LoginPage from './pages/client/LoginPage'
import CatalogPage from './pages/client/CatalogPage'
import ProductPage from './pages/client/ProductPage'
import CartPage from './pages/client/CartPage'
import CheckoutPage from './pages/client/CheckoutPage'
import MyOrdersPage from './pages/client/MyOrdersPage'
import OrderDetailsPage from './pages/client/OrderDetailsPage'
import ProfilePage from './pages/client/ProfilePage'

import OrdersDashboardPage from './pages/agent/OrdersDashboardPage'
import AgentOrderDetailsPage from './pages/agent/AgentOrderDetailsPage'
import ProductsPage from './pages/agent/ProductsPage'
import CategoriesPage from './pages/agent/CategoriesPage'
import ClientsPage from './pages/agent/ClientsPage'
import CreateAgentPage from './pages/agent/CreateAgentPage'

import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      {/* Client side */}
      <Route element={<ClientLayout />}>
        {/* Public */}
        <Route path="/" element={<CatalogPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Logged-in clients */}
        <Route element={<ProtectedRoute roles={[ROLES.CLIENT]} />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
        </Route>

        {/* Any logged-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Agent back-office */}
      <Route element={<ProtectedRoute roles={[ROLES.AGENT]} />}>
        <Route path="/agent" element={<AgentLayout />}>
          <Route index element={<OrdersDashboardPage />} />
          <Route path="orders" element={<OrdersDashboardPage />} />
          <Route path="orders/:id" element={<AgentOrderDetailsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="agents/new" element={<CreateAgentPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
