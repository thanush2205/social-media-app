# SparksHub

SparksHub is a full-stack social feed built with React, Node.js, Express, MongoDB, and Cloudinary. Users can create accounts, publish text or image posts, browse a paginated feed, like posts, and add comments.

## Features

- JWT authentication with bcrypt password hashing
- Text and image posts with Cloudinary uploads
- Cursor-based feed pagination and infinite scroll
- Likes and comments with optimistic UI updates
- Responsive Material UI interface with persisted light and dark modes

## Stack

- **Frontend:** React 18, Vite, React Router, Material UI, Axios
- **Backend:** Node.js, Express, Mongoose, JWT, Multer
- **Services:** MongoDB Atlas and Cloudinary

## Project Structure

```text
backend/
  src/config       Database connection
  src/controllers  Authentication and post logic
  src/middleware   Auth, uploads, and error handling
  src/models       User and Post models
  src/routes       API routes
  src/utils        JWT and Cloudinary helpers
frontend/
  src/api          API clients
  src/components   Shared UI components
  src/context      Auth and color mode state
  src/pages        Login, signup, feed, and post creation
```

## Local Development

### Requirements

- Node.js 18 or newer
- MongoDB, local or Atlas
- Cloudinary account for image uploads

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Configure these values in `backend/.env`:

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long, random signing secret |
| `JWT_EXPIRES_IN` | Token lifetime, for example `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLIENT_URLS` | Allowed frontend origins |
| `PORT` | API port, default `5000` |

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` in `frontend/.env` to `http://localhost:5000/api`. The frontend runs at `http://localhost:5173` by default.

## API Overview

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/signup` | No | Create an account |
| `POST` | `/auth/login` | No | Authenticate a user |
| `GET` | `/auth/me` | Yes | Get the current user |
| `GET` | `/posts?cursor=&limit=` | No | Fetch the public feed |
| `GET` | `/posts/:id` | No | Fetch one post |
| `POST` | `/posts` | Yes | Create a text or image post |
| `POST` | `/posts/:id/like` | Yes | Toggle a like |
| `POST` | `/posts/:id/comment` | Yes | Add a comment |

## Deployment

### Frontend: Vercel

1. Import the repository and set the root directory to `frontend`.
2. Set `VITE_API_URL` to the deployed backend API URL.
3. Deploy with the default Vite build settings.

The included `frontend/vercel.json` enables SPA routing.

### Backend: Render

1. Create a web service with root directory `backend`.
2. Use `npm install` as the build command and `npm start` as the start command.
3. Add the backend environment variables and set `CLIENT_URLS` to the deployed frontend URL.

## License

MIT
