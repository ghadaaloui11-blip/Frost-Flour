// Enumerations from the class diagram (Documentation/class+state diagrams.png).

const ROLES = Object.freeze({
  CLIENT: 'Client',
  AGENT: 'Agent',
});

// Order state diagram:
// PENDING -> CONFIRMED -> IN_PREPARATION -> COMPLETED
// PENDING -> REJECTED  (by an agent, US-30)
// PENDING -> CANCELLED (by the client, US-27)
const ORDER_STATUS = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PREPARATION: 'IN_PREPARATION',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
});

const PAYMENT_STATUS = Object.freeze({
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
});

module.exports = { ROLES, ORDER_STATUS, PAYMENT_STATUS };
