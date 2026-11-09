// Product form modal for creating (US-12) and editing (US-13) products.
// Sends FormData to the parent's onSubmit — the parent calls productApi.create / update.
import { useState, useRef, useEffect } from 'react'

export default function ProductForm({ product, categories, onSubmit, onClose }) {
  const isEditing = !!product

  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price != null ? String(product.price) : '')
  const [category, setCategory] = useState(product?.category?._id || product?.category || '')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(product?.image || null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  function validate() {
    const errs = {}
    if (!name.trim()) errs.name = 'Product name is required'
    if (!price || isNaN(Number(price))) errs.price = 'A valid price is required'
    else if (Number(price) < 0) errs.price = 'Price must be a positive number'
    if (!category) errs.category = 'Please select a category'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // Revoke blob URL on unmount
  useEffect(() => {
    return () => {
      if (imageFile && imagePreview?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imageFile, imagePreview])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    const formData = new FormData()
    formData.append('name', name.trim())
    formData.append('description', description.trim())
    formData.append('price', price)
    formData.append('category', category)
    // Only append the image if a new file was selected — preserves the old one on edit.
    if (imageFile) formData.append('image', imageFile)

    try {
      await onSubmit(formData)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal--form" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal__header">
          <h2 className="modal__title">
            <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-plus-square'}`}></i>
            {isEditing ? ' Edit Product' : ' Add New Product'}
          </h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {/* Name */}
          <div className="form-group">
            <label htmlFor="pf-name">Product Name *</label>
            <input
              id="pf-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Strawberry Cheesecake"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="pf-desc">Description</label>
            <textarea
              id="pf-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your delicious creation..."
              rows={3}
            />
          </div>

          {/* Price + Category */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pf-price">Price (TND) *</label>
              <input
                id="pf-price"
                type="number"
                step="0.001"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.000"
                className={errors.price ? 'input-error' : ''}
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="pf-cat">Category *</label>
              <select
                id="pf-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={errors.category ? 'input-error' : ''}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>
          </div>

          {/* Image upload */}
          <div className="form-group">
            <label>Product Image</label>
            <div
              className="image-upload"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <div className="image-upload__preview">
                  <img src={imagePreview} alt="Preview" />
                  <div className="image-upload__overlay">
                    <span>Click to change</span>
                  </div>
                </div>
              ) : (
                <div className="image-upload__placeholder">
                  <i className="bi bi-camera"></i>
                  <p>Click to upload an image</p>
                  <span className="image-upload__hint">JPG, PNG or WEBP — max 2 MB</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                hidden
              />
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
