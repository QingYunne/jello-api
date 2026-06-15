# 🟡 Jello API

Backend REST API for **Jello** — a Trello-inspired project management app. Built with Node.js and Express.js, following a clean layered architecture.

> Frontend repo: _[https://github.com/QingYunne/jello-web]_

---

## ✨ Features

- **Board, Column & Card management** — full CRUD with drag-and-drop support
- **Authentication** — JWT-based login/logout with access & refresh token rotation
- **Email verification** — account activation via email (MailerSend)
- **Real-time collaboration** — invite users to boards via WebSocket (Socket.IO)
- **File uploads** — avatar and card cover image upload via Cloudinary (Multer)
- **Input validation** — request validation on every route before hitting controllers

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| Auth | JWT (access + refresh token) |
| Real-time | Socket.IO |
| File Storage | Cloudinary |
| Email | MailerSend |
| Upload | Multer |
| Build | Babel (ESM → CJS) |
| Linting | ESLint + Prettier |

---

## 📁 Project Structure

```
src/
├── config/         # Environment, CORS, MongoDB connection, upload config
├── controllers/    # Route handlers (thin layer, delegates to services)
├── services/       # Business logic
├── models/         # MongoDB schemas
├── routes/
│   └── v1/         # Versioned API routes
├── middlewares/    # Auth, error handling, Multer
├── validations/    # Request validation per resource
├── providers/      # Third-party integrations (JWT, Cloudinary, email)
├── helpers/        # asyncHandler, auth utilities
├── sockets/        # Socket.IO event handlers
└── utils/          # Constants, error classes, formatters, sorts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18
- MongoDB instance (local or Atlas)
- Cloudinary account
- MailerSend account

### Installation

```bash
git clone https://github.com/QingYunne/jello-api.git
cd jello-api
yarn install
```

### Environment Variables

Create a `.env` file at the root:

```env
MONGODB_URI=
DATABASE_NAME='clone-jello'

APP_HOST='localhost'
APP_PORT=8017
WEBSITE_DOMAIN_DEVELOPMENT=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRES_IN='1h'
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES_IN='14d'

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

MAILERSEND_API_KEY=
MAILERSEND_EMAIL_FROM=
MAILERSEND_NAME_FROM=

BUILD_MODE=dev

```

### Run

```bash
# Development
yarn dev

# Production build
yarn build
yarn start
```

---

## 📡 API Overview

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/v1/users/register` | Register new account |
| PUT | `/v1/users/verify` | Verify email |
| POST | `/v1/users/login` | Login |
| POST | `/v1/users/logout` | Logout |
| GET | `/v1/users/refresh_token` | Refresh access token |
| PATCH | `/v1/users` | Update profile / avatar |

### Boards
| Method | Endpoint | Description |
|---|---|---|
| GET | `/v1/boards` | Get all boards |
| POST | `/v1/boards` | Create board |
| GET | `/v1/boards/:id` | Get board detail |
| PATCH | `/v1/boards/:id` | Update board |

### Columns
| Method | Endpoint | Description |
|---|---|---|
| POST | `/v1/columns` | Create column |
| PATCH | `/v1/columns/:id` | Update column |
| DELETE | `/v1/columns/:id` | Delete column |

### Cards
| Method | Endpoint | Description |
|---|---|---|
| POST | `/v1/cards` | Create card |
| PATCH | `/v1/cards/:id` | Update card |
| PUT | `/v1/cards/:id/cover` | Upload card cover |
| PATCH | `/v1/cards/:id/member` | Update card members |
| PATCH | `/v1/cards/:id/comment` | Add comment |
| PATCH | `/v1/cards/:id/move` | Move card to different column |

### Invitations
| Method | Endpoint | Description |
|---|---|---|
| POST | `/v1/invitations` | Invite user to board |

---

## 🤝 Real-time

Board invitations are delivered in real-time via **Socket.IO**. When a user is invited to a board, they receive an instant notification without needing to refresh.

## 🙋 Author

Made by **[QingYunne](https://github.com/QingYunne)**
