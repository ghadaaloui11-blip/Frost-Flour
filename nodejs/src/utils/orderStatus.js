// The order state diagram as code: which status can follow which.
const { ORDER_STATUS: S } = require('../models/enums');

const TRANSITIONS = {
  [S.PENDING]: [S.CONFIRMED, S.REJECTED, S.CANCELLED],
  [S.CONFIRMED]: [S.IN_PREPARATION],
  [S.IN_PREPARATION]: [S.COMPLETED],
  [S.COMPLETED]: [],
  [S.CANCELLED]: [],
  [S.REJECTED]: [],
};

function canTransition(from, to) {
  return (TRANSITIONS[from] || []).includes(to);
}

function nextStatuses(from) {
  return TRANSITIONS[from] || [];
}

module.exports = { TRANSITIONS, canTransition, nextStatuses };
