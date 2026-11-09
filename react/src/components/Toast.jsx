// Toast notification for success/error feedback (US-12, US-13).
import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast toast--${type}`}>
      <i className={`bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={onClose}>
        <i className="bi bi-x-lg"></i>
      </button>
    </div>
  )
}
