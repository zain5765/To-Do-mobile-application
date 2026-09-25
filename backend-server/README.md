# Todoo Backend Server

Express API with MongoDB (Mongoose), organized in **MVC** architecture.  
Serves the **Expo mobile app** only.

## MVC Structure

```
backend-server/
├── src/
│   ├── server.js           # App entry point
│   ├── app.js              # Express setup & middleware
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── models/             # M — Data layer (Mongoose schemas)
│   │   ├── User.js
│   │   └── Todo.js
│   ├── views/              # V — Response formatting (JSON)
│   │   ├── userView.js
│   │   └── todoView.js
│   ├── controllers/        # C — HTTP request handlers
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   └── todoController.js
│   ├── services/           # Business logic
│   │   ├── authService.js
│   │   ├── profileService.js
│   │   └── todoService.js
│   ├── routes/             # Route definitions → controllers
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   └── todoRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   └── utils/
│       ├── asyncHandler.js
│       └── password.js
```

### Request flow

```
Route → Controller → Service → Model (MongoDB)
                    ↓
                  View → JSON response
```

## Setup

```bash
cd backend-server
npm install
cp .env.example .env
```

## Run API

```bash
npm run dev          # → http://localhost:3000
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default `3000`) |
| `MONGODB_URI` | MongoDB Atlas or local connection string |
| `JWT_SECRET` | Secret for signing auth tokens |

## API endpoints

- `GET /health`
- `POST /api/auth/register` · `POST /api/auth/login` · `GET /api/auth/me`
- `PATCH /api/profile` · `PATCH /api/profile/password`
- `GET/POST /api/todos` · `PATCH/DELETE /api/todos/:id`

Mobile app connects via `EXPO_PUBLIC_API_URL` in the project root `.env`.
