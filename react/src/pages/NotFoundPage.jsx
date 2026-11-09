import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="page page--center">
      <h1>Oops, this page melted <i className="bi bi-emoji-frown"></i></h1>
      <Link to="/" className="btn">Back to the catalog</Link>
    </section>
  )
}
