// Confirmation modal for archiving / restoring a product (US-13).
import { useEffect } from 'react'

export default function ConfirmModal({
  title,
  message,
  confirmText = 'Confirm',
  variant = 'danger', // 'danger' (archive) | 'success' (restore)
  onConfirm,
  onCancel,
}) {
  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal modal--confirm" onClick={(e) => e.stopPropagation()}>
        <i
          className={`bi ${
            variant === 'danger'
              ? 'bi-exclamation-triangle-fill'
              : 'bi-arrow-counterclockwise'
          } modal__icon`}
        ></i>
        <h2 className="modal__title">{title}</h2>
        <p className="modal__message muted">{message}</p>
        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`btn ${variant === 'danger' ? 'btn--danger' : 'btn--success'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
