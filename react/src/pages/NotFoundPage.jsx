import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="page page--center">
      <h1>Oops, this page melted 🍦</h1>
      <Link to="/" className="btn">Back to the catalog</Link>
    </section>
  )
}
