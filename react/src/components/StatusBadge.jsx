// Pastel pill for an order status or a payment status. Colors are in styles/theme.css (.badge--<status>).
export default function StatusBadge({ status }) {
  if (!status) return null
  const label = status.replace('_', ' ').toLowerCase()
  return <span className={`badge badge--${status.toLowerCase()}`}>{label}</span>
}
