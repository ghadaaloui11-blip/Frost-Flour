// Node's `events` module: controllers emit an event, listeners react to it.
// Example (in a controller):  orderEvents.emit('order:statusChanged', order, oldStatus);
// Later you can add listeners here (send an email, write a history log...) without touching controllers.
const { EventEmitter } = require('node:events');

const orderEvents = new EventEmitter();

orderEvents.on('order:created', (order) => {
  console.log(`[order] #${order._id} created, total ${order.total}`);
});

orderEvents.on('order:statusChanged', (order, oldStatus) => {
  console.log(`[order] #${order._id} ${oldStatus} -> ${order.status}`);
});

orderEvents.on('payment:updated', (payment) => {
  console.log(`[payment] order #${payment.order} is ${payment.paymentStatus}`);
});

module.exports = orderEvents;
