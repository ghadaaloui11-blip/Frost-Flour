// Seed script: creates the first Agent and some sample categories.
// Run with:  npm run seed
// Without it nobody could create Agents (US-09 needs an existing Agent).
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { Agent, Category } = require('../models');

const AGENT = {
  firstName: 'Admin',
  lastName: 'Agent',
  email: process.env.SEED_AGENT_EMAIL || 'agent@frostflour.tn',
  password: process.env.SEED_AGENT_PASSWORD || 'agent123',
  phone: '+216 00 000 000',
};

const CATEGORIES = [
  { name: 'Cakes', description: 'Whole cakes for every occasion' },
  { name: 'Cupcakes', description: 'Small frosted cakes' },
  { name: 'Macarons', description: 'Colourful French macarons' },
  { name: 'Cookies', description: 'Crunchy and soft cookies' },
  { name: 'Viennoiseries', description: 'Croissants, pains au chocolat and more' },
];

async function seed() {
  await connectDB();

  if (await Agent.exists({ email: AGENT.email })) {
    console.log(`Agent ${AGENT.email} already exists`);
  } else {
    await Agent.create(AGENT); // password is hashed by the User model
    console.log(`Agent created: ${AGENT.email} / ${AGENT.password}`);
  }

  for (const cat of CATEGORIES) {
    await Category.updateOne({ name: cat.name }, { $setOnInsert: cat }, { upsert: true });
  }
  console.log(`${CATEGORIES.length} categories ready`);
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
