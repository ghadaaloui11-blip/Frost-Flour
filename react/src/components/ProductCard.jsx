// One product in the catalog grid (US-14).
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/constants'

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="card product-card">
      <Link to={`/products/${product._id}`}>
        <img src={product.image || '/favicon.svg'} alt={product.name} className="product-card__img" />
      </Link>
      <div className="product-card__body">
        <h3>{product.name}</h3>
        <p className="muted">{product.description}</p>
        <div className="product-card__footer">
          <strong className="price">{formatPrice(product.price)}</strong>
          {onAdd && (
            <button className="btn btn--round" onClick={() => onAdd(product)} aria-label="Add to cart">
              +
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
