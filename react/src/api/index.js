// All API calls of the app, grouped by resource. They match the routes in nodejs/src/routes.
import { api } from './client'

export const authApi = {
  register: (data) => api('/auth/register', { method: 'POST', body: data }), // US-01
  login: (email, password) => api('/auth/login', { method: 'POST', body: { email, password } }), // US-02
  logout: () => api('/auth/logout', { method: 'POST' }), // US-03
  me: () => api('/auth/me'),
}

export const userApi = {
  updateProfile: (data) => api('/users/me', { method: 'PATCH', body: data }), // US-05
  changePassword: (oldPassword, newPassword) =>
    api('/users/me/password', { method: 'PATCH', body: { oldPassword, newPassword } }), // US-06
  listClients: () => api('/users/clients'), // US-07
  getClient: (id) => api(`/users/clients/${id}`), // US-07
  createAgent: (data) => api('/users/agents', { method: 'POST', body: data }), // US-09
}

export const categoryApi = {
  list: () => api('/categories'),
  create: (data) => api('/categories', { method: 'POST', body: data }), // US-10
  update: (id, data) => api(`/categories/${id}`, { method: 'PATCH', body: data }), // US-10
  remove: (id) => api(`/categories/${id}`, { method: 'DELETE' }), // US-11
}

export const productApi = {
  // params: { category, search } — US-14, US-15
  list: (params = {}) => api(`/products?${new URLSearchParams(params)}`),
  get: (id) => api(`/products/${id}`), // US-16
  create: (formData) => api('/products', { method: 'POST', body: formData }), // US-12 (with "image" file)
  update: (id, formData) => api(`/products/${id}`, { method: 'PATCH', body: formData }), // US-13
  archive: (id, isArchived = true) => api(`/products/${id}/archive`, { method: 'PATCH', body: { isArchived } }), // US-13
}

export const cartApi = {
  get: () => api('/cart'), // US-19
  addItem: (productId, quantity = 1) => api('/cart/items', { method: 'POST', body: { productId, quantity } }), // US-18
  updateQuantity: (productId, quantity) =>
    api(`/cart/items/${productId}`, { method: 'PATCH', body: { quantity } }), // US-20
  removeItem: (productId) => api(`/cart/items/${productId}`, { method: 'DELETE' }), // US-21
  clear: () => api('/cart', { method: 'DELETE' }), // US-21
}

export const orderApi = {
  create: () => api('/orders', { method: 'POST' }), // US-24
  mine: () => api('/orders/mine'), // US-25
  get: (id) => api(`/orders/${id}`), // US-26, US-42
  modify: (id, items) => api(`/orders/${id}`, { method: 'PATCH', body: { items } }), // US-44
  cancel: (id) => api(`/orders/${id}/cancel`, { method: 'PATCH' }), // US-27
  listAll: (status) => api(`/orders${status ? `?status=${status}` : ''}`), // US-28
  updateStatus: (id, status) => api(`/orders/${id}/status`, { method: 'PATCH', body: { status } }), // US-29
  reject: (id) => api(`/orders/${id}/reject`, { method: 'PATCH' }), // US-30
}

export const paymentApi = {
  pay: (orderId) => api(`/payments/${orderId}/pay`, { method: 'POST' }), // US-32
  status: (orderId) => api(`/payments/${orderId}`), // US-34
}
