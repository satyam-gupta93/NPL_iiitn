# IIIT Nagpur Premier League (NPL) Auction System

Full-stack MERN auction app with React, Tailwind CSS, Node.js, Express, MongoDB Atlas, and Socket.io.

## Project Structure

```txt
backend/
  src/
    config/
    controllers/
    data/
    middleware/
    models/
    routes/
    seed/
    socket/
    utils/
frontend/
  src/
    api/
    components/
    context/
    pages/
    utils/
```

## Setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Create `backend/.env` from `backend/.env.example` and add your MongoDB Atlas URI.

3. Seed players, teams, and auction state:

```bash
npm run seed
```

4. Start backend:

```bash
npm run dev
```

5. Install and start frontend:

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`; backend runs at `http://localhost:5000`.

## API

Players:
- `GET /players`
- `GET /players/available`

Auction:
- `GET /auction`
- `POST /auction/start`
- `POST /auction/bid`
- `POST /auction/accept`
- `POST /auction/reject`

Teams:
- `GET /teams`
- `GET /teams/:id`

Auctioneer-only endpoints require `{ "role": "auctioneer" }` in the request body.

## Included Features

- Preloaded Indian cricketer data.
- Four team managers with a purse of Rs. 1 crore each.
- Live Socket.io bid updates and highest-bidder highlight.
- Validations for sold players, purse limits, duplicate consecutive bids, and auctioneer controls.
- Dashboard, Auction Room, and Team pages.
- Countdown timer and auction history log.
- Strict four-color UI palette:
  - `#1E3A8A`
  - `#F59E0B`
  - `#F8FAFC`
  - `#10B981`
