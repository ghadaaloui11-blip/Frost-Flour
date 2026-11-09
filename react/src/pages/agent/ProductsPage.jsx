// Products management page (US-12, US-13).
// Agent can add, edit, archive and restore products.
import { useState, useEffect, useCallback } from 'react'
import { productApi, categoryApi } from '../../api'
import { formatPrice } from '../../utils/constants'
import ProductForm from '../../components/ProductForm'
import ConfirmModal from '../../components/ConfirmModal'
import Toast from '../../components/Toast'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  // Modals
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [archiveTarget, setArchiveTarget] = useState(null)

  // Toast
  const [toast, setToast] = useState(null)
  const notify = useCallback((message, type = 'success') => setToast({ message, type }), [])

  // ---- Data fetching ----

  // Manual refresh after create / update / archive.
  const refreshProducts = useCallback(
    async (searchVal, categoryVal) => {
      try {
        const params = { includeArchived: 'true' }
        if (searchVal) params.search = searchVal
        if (categoryVal) params.category = categoryVal
        const data = await productApi.list(params)
        setProducts(data)
      } catch (err) {
        notify(err.message, 'error')
      }
    },
    [notify]
  )

  // Fetch products whenever filters change.
  useEffect(() => {
    let active = true
    const params = { includeArchived: 'true' }
    if (search) params.search = search
    if (filterCategory) params.category = filterCategory
    productApi
      .list(params)
      .then((data) => {
        if (active) setProducts(data)
      })
      .catch((err) => {
        if (active) notify(err.message, 'error')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [search, filterCategory, notify])

  // Fetch categories once.
  useEffect(() => {
    let active = true
    categoryApi
      .list()
      .then((data) => {
        if (active) setCategories(data)
      })
      .catch((err) => {
        if (active) notify(err.message, 'error')
      })
    return () => {
      active = false
    }
  }, [notify])

  // ---- Handlers ----

  const handleAdd = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await productApi.update(editingProduct._id, formData)
        notify('Product updated successfully!')
      } else {
        await productApi.create(formData)
        notify('Product created successfully!')
      }
      setShowForm(false)
      setEditingProduct(null)
      refreshProducts(search, filterCategory)
    } catch (err) {
      // Keep the form open so the agent can fix the issue.
      notify(err.message || 'Something went wrong', 'error')
    }
  }

  const handleConfirmArchive = async () => {
    try {
      const updated = await productApi.archive(
        archiveTarget._id,
        !archiveTarget.isArchived
      )
      notify(
        updated.isArchived
          ? 'Product archived successfully!'
          : 'Product restored successfully!'
      )
      setArchiveTarget(null)
      refreshProducts(search, filterCategory)
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  // ---- Render ----

  return (
    <section className="pm-page">
      {/* Header */}
      <div className="pm-header">
        <h1>Products</h1>
        <button className="btn" onClick={handleAdd}>
          <i className="bi bi-plus-lg"></i> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="pm-toolbar">
        <div className="pm-search">
          <i className="bi bi-search pm-search__icon"></i>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pm-search__input"
          />
          {search && (
            <button className="pm-search__clear" onClick={() => setSearch('')}>
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="pm-filter"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="pm-loading">
          <div className="spinner" />
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="pm-empty card">
          <i className="bi bi-cake2 pm-empty__icon"></i>
          <h2>No products found</h2>
          <p className="muted">
            {search || filterCategory
              ? 'Try adjusting your filters.'
              : 'Start by adding your first delicious creation!'}
          </p>
          {!search && !filterCategory && (
            <button className="btn" onClick={handleAdd}>
              <i className="bi bi-plus-lg"></i> Add Product
            </button>
          )}
        </div>
      ) : (
        <div className="pm-grid">
          {products.map((p) => (
            <div
              key={p._id}
              className={`pm-card card ${p.isArchived ? 'pm-card--archived' : ''}`}
            >
              {/* Image */}
              <div className="pm-card__image">
                {p.image ? (
                  <img src={p.image} alt={p.name} />
                ) : (
                  <div className="pm-card__placeholder">
                    <i className="bi bi-cake2"></i>
                  </div>
                )}
                <span
                  className={`pm-status ${
                    p.isArchived ? 'pm-status--archived' : 'pm-status--active'
                  }`}
                >
                  {p.isArchived ? 'Archived' : 'Active'}
                </span>
              </div>

              {/* Info */}
              <div className="pm-card__body">
                <h3 className="pm-card__name">{p.name}</h3>
                <span className="pm-card__category">
                  {p.category?.name || 'Uncategorized'}
                </span>
                <p className="pm-card__price">{formatPrice(p.price)}</p>
              </div>

              {/* Actions */}
              <div className="pm-card__actions">
                <button className="btn btn--ghost btn--sm" onClick={() => handleEdit(p)}>
                  <i className="bi bi-pencil"></i> Edit
                </button>
                <button
                  className={`btn btn--sm ${p.isArchived ? 'btn--success' : 'btn--danger'}`}
                  onClick={() => setArchiveTarget(p)}
                >
                  <i
                    className={`bi ${
                      p.isArchived ? 'bi-arrow-counterclockwise' : 'bi-archive'
                    }`}
                  ></i>
                  {p.isArchived ? ' Restore' : ' Archive'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
        />
      )}

      {archiveTarget && (
        <ConfirmModal
          title={archiveTarget.isArchived ? 'Restore Product' : 'Archive Product'}
          message={
            archiveTarget.isArchived
              ? `Restore "${archiveTarget.name}"? It will appear in the client catalog again.`
              : `Archive "${archiveTarget.name}"? It will no longer appear in the client catalog.`
          }
          confirmText={archiveTarget.isArchived ? 'Restore' : 'Archive'}
          variant={archiveTarget.isArchived ? 'success' : 'danger'}
          onConfirm={handleConfirmArchive}
          onCancel={() => setArchiveTarget(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </section>
  )
}
