# Frost & Flour

Online pastry shop: clients browse the catalog, order and pay online; agents manage categories, products and orders.

- `nodejs/` — REST API: Node.js + Express 5 + MongoDB (Mongoose)
- `react/` — front end: React + Vite + React Router
- `Documentation/` — backlog (`Frost_and_Flour_Backlog_Main.xlsx`), class and state diagrams, mockup prompt

## Getting started (first time)

**Install once on your PC:** Git, Node.js 20+ (LTS), VS Code, Docker Desktop.
You do NOT install MongoDB itself: Docker runs it. (Optional: MongoDB Compass to look at the data.)

```bash
git clone <repo-url>
cd Frost-Flour

# 1. Database (Docker Desktop must be open)
docker compose up -d                 # MongoDB on localhost:27017

# 2. API — terminal 1
cd nodejs
npm install                          # installs the back-end packages (node_modules)
cp .env.example .env                 # Windows CMD: copy .env.example .env
npm run seed                         # first Agent + sample categories
npm run dev                          # http://localhost:5000/api/health

# 3. Front end — terminal 2
cd react
npm install                          # installs the front-end packages
npm run dev                          # http://localhost:5173
```

Open the repo root folder in **one** VS Code window and use two terminals (one in `nodejs`, one in `react`).
Vite forwards `/api` and `/uploads` to the API (see `react/vite.config.js`).

Test agent: `agent@frostflour.tn` / `agent123` (from `.env`).

## Every day

```bash
git pull
docker compose up -d                 # if MongoDB is not running
cd nodejs && npm install && npm run dev
cd react  && npm install && npm run dev   # (other terminal)
```
Run `npm install` again only when `package.json` changed after a pull.

## Rules

- Never commit `.env` or `node_modules` (already in `.gitignore`).
- New setting? Add it to `.env.example` (with a fake value) and tell the team.
- Each person has their own local database: data does not sync through Git.
  To share one database, use MongoDB Atlas and put its URL in `MONGODB_URI`.
- Stop the database: `docker compose stop`. Reset it completely: `docker compose down -v` then `npm run seed`.

## API structure (`nodejs/src`)

| Folder | Role |
|---|---|
| `config/` | `.env` values and the MongoDB connection |
| `models/` | Mongoose classes from the class diagram (User → Client / Agent, Category, Product, Cart + CartItem, Order + OrderItem, Payment, enums) |
| `middlewares/` | logger (morgan → console + `logs/access.log`), auth (JWT from cookie or Bearer header), authorize (roles), validate, upload (multer), rateLimiter, notFound, errorHandler |
| `routes/` | URL → middlewares → controller |
| `controllers/` | the logic of each user story (`category.controller.js` is complete and is the example to follow) |
| `utils/` | password hashing (`crypto.scrypt`), JWT + cookie helpers, order state machine, ApiError |
| `events/` | `EventEmitter` for order and payment events |
| `seed/` | `npm run seed` |

Global middlewares in `app.js`, in order: morgan, helmet, cors, compression, cookie-parser, express.json, express.urlencoded, express.static.

## Endpoints

| Method | URL | Who | Story |
|---|---|---|---|
| POST | /api/auth/register · /login · /logout | public / logged in | US-01, 02, 03 |
| GET | /api/auth/me | logged in | |
| PATCH | /api/users/me · /me/password | logged in | US-05, 06 |
| GET | /api/users/clients · /clients/:id | Agent | US-07 |
| POST | /api/users/agents | Agent | US-09 |
| GET / POST / PATCH / DELETE | /api/categories | public / Agent | US-10, 11 |
| GET | /api/products?category=&search= · /api/products/:id | public | US-14, 15, 16 |
| POST / PATCH | /api/products · /:id · /:id/archive | Agent | US-12, 13 |
| GET / DELETE · POST / PATCH / DELETE | /api/cart · /api/cart/items/:productId | Client | US-18 to 22 |
| POST · GET /mine · PATCH /:id · PATCH /:id/cancel | /api/orders | Client | US-24, 25, 44, 27 |
| GET /:id | /api/orders | Client (own) / Agent | US-26, 42 |
| GET · PATCH /:id/status · PATCH /:id/reject | /api/orders | Agent | US-28, 29, 30 |
| POST /:orderId/pay · GET /:orderId · POST /webhook | /api/payments | Client / provider | US-32, 33, 34 |

Controllers that are not written yet answer `501 Not implemented yet (US-xx)`.
