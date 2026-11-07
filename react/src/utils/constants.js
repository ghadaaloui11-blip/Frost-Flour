// Same values as nodejs/src/models/enums.js

export const ROLES = { CLIENT: 'Client', AGENT: 'Agent' }

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PREPARATION: 'IN_PREPARATION',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
}

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
}

// 18.5 -> "18.500 TND"
export function formatPrice(value) {
  return `${Number(value || 0).toFixed(3)} TND`
}
