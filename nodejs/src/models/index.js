// One place to import every model: const { Product, Order } = require('../models');
const User = require('./User');
const Client = require('./Client');
const Agent = require('./Agent');
const Category = require('./Category');
const Product = require('./Product');
const Cart = require('./Cart');
const Order = require('./Order');
const Payment = require('./Payment');
const enums = require('./enums');

module.exports = { User, Client, Agent, Category, Product, Cart, Order, Payment, ...enums };
