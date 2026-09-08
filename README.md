# 📣 ConnectHub — Mini Social Post Application

A TaskPlanet-style social feed built for the **3W Full Stack Internship Assignment**.
Users can create accounts, post text and/or images, browse a public feed, like, and comment —
with instant UI updates and efficient cursor-based pagination.

![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node%20%2B%20MongoDB-6366f1)

---

## ✨ Features

- **Account creation** — signup/login with email + password (bcrypt hashed, JWT auth)
- **Create post** — text-only, image-only, or both (Cloudinary hosted images)
- **Public feed** — all posts from all users, newest first, infinite scroll
- **Likes & comments** — toggle likes, add comments, both update instantly in the UI
- **Username tracking** — likedByMe state per user; comments store the commenter's profile
- **Dark / light mode** — persisted preference
- **Responsive layout** — mobile-first, works across devices
- **Cursor-based pagination** — no page duplicates, efficient indexed queries

---

## 🧱 Project Structure

```
social-media-app/
├── backend/                # Node.js + Express + MongoDB (Mongoose)
│   ├── src/
│   │   ├── config/         # MongoDB connection
│   │   ├── controllers/    # auth & post business logic
│   │   ├── middleware/     # JWT auth, file upload, error handlers
│   │   ├── models/         # User, Post  (ONLY 2 collections)
│   │   ├── routes/         # /api/auth, /api/posts
│   │   ├── utils/          # JWT + Cloudinary helpers
│   │   └── server.js       # Express app entry
│   └── package.json
└── frontend/               # React (Vite) + Material UI
    ├── src/
    │   ├── api/            # axios client + endpoint modules
    │   ├── components/     # Navbar, PostCard, CommentSection, UserAvatar
    │   ├── context/        # AuthContext, ColorModeContext
    │   ├── pages/          # Login, Signup, Feed, CreatePost
    │   ├── utils/          # formatting helpers
    │   └── App.jsx
    └── package.json
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js ≥ 18
- A MongoDB instance (local or free [MongoDB Atlas](https://cloud.mongodb.com/) cluster)
- A free [Cloudinary](https://cloudinary.com/) account for image uploads

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev            # http://localhost:5000
```

`.env` keys:

| Key | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Random long secret (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `CLIENT_URLS` | Comma-separated allowed frontend origins (default `http://localhost:5173`) |
| `PORT` | Default `5000` |

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL to http://localhost:5000/api
npm run dev            # http://localhost:5173
```

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

### Authentication
| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | `{ name, email, password }` | Create account, returns token + user |
| `POST` | `/auth/login` | `{ email, password }` | Log in, returns token + user |
| `GET` | `/auth/me` | — | Current user (Bearer token) |

### Posts
| Method | Endpoint | Body | Description |
|---|---|---|---|
| `GET` | `/posts?cursor=&limit=` | — | Public feed (cursor pagination, newest first) |
| `GET` | `/posts/:id` | — | Single post |
| `POST` | `/posts` | `FormData(text?, image?)` | Create post (**protected**) |
| `POST` | `/posts/:id/like` | — | Toggle like (**protected**) |
| `POST` | `/posts/:id/comment` | `{ text }` | Add comment (**protected**) |

**Feed response shape:**
```json
{
  "posts": [
    {
      "_id": "...",
      "text": "...",
      "image": "https://...",
      "createdAt": "...",
      "user": { "_id": "...", "name": "Alice", "avatar": "" },
      "likesCount": 3,
      "commentsCount": 1,
      "likedByMe": false,
      "comments": [ { "_id": "...", "text": "...", "user": { "name": "Bob" } } ]
    }
  ],
  "nextCursor": "...",
  "hasMore": true
}
```

---

## 📦 Database Design (2 collections)

```
User {
  name: String,
  email: String,        // unique, lowercased
  passwordHash: String, // bcrypt
  avatar: String,       // url
  timestamps
}

Post {
  user: ObjectId ➜ User,
  text: String,         // optional
  image: String,        // optional (Cloudinary URL)
  likes: [ObjectId ➜ User],          // who liked
  comments: [ { user: ObjectId, text: String, timestamps } ],
  timestamps
  // indexed on (createdAt, _id) for cursor pagination
}
```

---

## 🌐 Deployment Guide

### Frontend → Vercel
1. Push this repo to GitHub.
2. In Vercel, **New Project → Import** the repo → set **Root Directory** to `frontend`.
3. Add env var: `VITE_API_URL=https://<your-backend>.onrender.com/api`
4. Build command auto-detected (`vite build`), output `dist`.
5. Deploy. SPA routing is handled by `vercel.json` rewrite rules.

### Backend → Render
1. In Render, **New Web Service → connect your repo** → Root Directory `backend`.
2. Build command: `npm install` → Start command: `npm start`.
3. Add env vars: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `CLIENT_URLS=https://<your-frontend>.vercel.app`
4. Deploy; copy the `.onrender.com` URL into the frontend's `VITE_API_URL`.

### Database → MongoDB Atlas (free)
1. Create a free cluster →
2. Database Access → create a DB user (remember the password) →
3. Network Access → allow `0.0.0.0/0` (for Render) →
4. Connect → Drivers → copy the connection string into the backend's `MONGO_URI`.

---

## ✅ Assignment Checklist

- [x] Account creation with email + password (stored in MongoDB)
- [x] Create posts with text and/or image (neither field mandatory — at least one required)
- [x] Public feed showing all users' posts (username, content, likes, comment count)
- [x] Like & comment on any post, with total counts
- [x] Usernames of likers/commenters saved in the database
- [x] React.js frontend + Node/Express backend + MongoDB
- [x] Material UI styling (no Tailwind)
- [x] Clean UI inspired by TaskPlanet social feed
- [x] Basic auth flow: signup → login → create post → view feed
- [x] Instant like/comment updates
- [x] Cursor-based pagination (bonus)
- [x] Well-structured, commented, reusable code

---

## 📄 License

MIT — free to use for the assignment.