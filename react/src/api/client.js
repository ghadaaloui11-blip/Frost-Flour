// One function to call the Express API. The login cookie is sent automatically (credentials: 'include').
// Usage: const products = await api('/products?category=123')
//        await api('/categories', { method: 'POST', body: { name: 'Cakes' } })
//        await api('/products', { method: 'POST', body: formData })   // FormData for file uploads

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function api(path, { method = 'GET', body } = {}) {
  const isForm = body instanceof FormData
  const res = await fetch(BASE_URL + path, {
    method,
    credentials: 'include',
    headers: body && !isForm ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  })

  if (res.status === 204) return null
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const error = new Error(data?.message || `Request failed (${res.status})`)
    error.status = res.status
    error.details = data?.details
    throw error
  }
  return data
}
