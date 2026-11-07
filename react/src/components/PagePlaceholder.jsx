// Temporary content for pages that are not built yet. Replace it page by page.
export default function PagePlaceholder({ title, stories, children }) {
  return (
    <section className="page">
      <h1>{title}</h1>
      {stories && <p className="muted">User stories: {stories}</p>}
      <div className="card placeholder">{children || 'To do'}</div>
    </section>
  )
}
