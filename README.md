# MikeSenpai - Anime Streaming Platform

A full-stack anime streaming web application with user authentication, watch history, bookmarks, and multi-provider support (AnimeUnity as primary, AnimeKai fallback).

## Features

Browse anime by genre, top rated, new releases, and binge-worthy recommendations
Search anime with fuzzy matching and suggestions
Watch episodes with sub/dub support
User authentication (register/login with JWT)
Watch history tracking with localStorage
Bookmark anime (database storage with sync across devices)
Responsive dashboard sidebar for history and bookmarks
Multi-provider fallback system (AnimeUnity primary for episodes, AnimeKai for info)
Visual source badges (green for working, orange for unstable)
Ngrok tunneling for production without credit card
Cloudflare Worker proxy support (bypasses IP blocks)

## Tech Stack

Frontend: React with TypeScript, Tailwind CSS, Vercel (deployment)
Backend: Node.js with Express, TypeScript, MongoDB with Mongoose, JWT authentication, Bcrypt, @consumet/extensions, Ngrok/Cloudflare Tunnel, Render (deployment)

## Project Structure

MikeSenpai/
├── backend/
│ ├── Config/ # Configuration files
│ ├── Controllers/ # Business logic
│ ├── Middleware/ # Auth and validation
│ ├── Models/ # MongoDB schemas
│ ├── Routes/ # API endpoints
│ ├── Type/ # TypeScript interfaces
│ ├── Utilities/ # Helpers and cache
│ └── ZodMod/ # Validation schemas
├── AnimeApp/
│ ├── public/
│ ├── src/
│ │ ├── Components/ # React components
│ │ ├── Config/ # App configuration
│ │ ├── Hooks/ # Custom React hooks
│ │ ├── Pages/ # Page components
│ │ ├── Services/ # API calls
│ │ ├── Types/ # TypeScript types
│ │ └── Utils/ # Helpers (DynamicUrl)
│ └── package.json
└── README.md

## Installation

Prerequisites: Node.js (v20 or higher), MongoDB database, Git

Backend Setup:
git clone https://github.com/Miketryartd/MikeSenpai.git
cd MikeSenpai/backend
npm install
Create Config/.env file with: MONGOOSE_SECRET_PRIV_KEY=your_mongodb_connection_string, JWT_TOKEN_REF_PRIV=your_jwt_secret_key, HOST=3000
npm run build
npm start

Frontend Setup:
cd ../AnimeApp
npm install
Create .env file with: VITE_BACKEND_PROD=https://your-backend-url.com, VITE_BACKEND_LOCAL=http://localhost:3000
npm run dev

## Production Tunneling (No Credit Card Required)

Option 1 - Ngrok (Free, requires PC on):
Download from https://ngrok.com/download
cd backend
ngrok http 3000
Keep running 24/7 with PM2: pm2 start ngrok -- --http 3000

Option 2 - Cloudflare Tunnel (Free, persistent):
Install cloudflared from https://github.com/cloudflare/cloudflared/releases
cloudflared tunnel --url http://localhost:3000

Option 3 - Cloudflare Worker (Free, 24/7, no PC needed):
Deploy worker with code that proxies requests through Cloudflare IPs to bypass blocks

## API Endpoints

AnimeUnity Routes (Primary - Working Episodes):
GET /api/multi/stream/:id - Get episode list
GET /api/multi/episode-source/:episodeId - Get video source URLs
GET /api/getAnimeDetail/:id - Get anime details
GET /api/searchAnime/:query - Search anime
GET /api/topRated/:page - Get top rated

AnimeKai Routes (Fallback - Info Only):
GET /api/animekai/top-rated - Get top rated
GET /api/animekai/new-releases - Get new releases
GET /api/map/animekai/:id - Map AnimeKai ID to AnimeUnity

User Routes:
POST /api/auth/register - Register new user
POST /api/auth/login - Login user

Comment Routes:
POST /api/auth/comment/:id/:finder - Add comment (auth required)
GET /api/auth/getComment/:id/:finder - Get comments

## Environment Variables

Backend (.env):
MONGOOSE_SECRET_PRIV_KEY - MongoDB connection string
JWT_TOKEN_REF_PRIV - Secret key for JWT tokens
HOST - Port number (default: 3000)

Frontend (.env):
VITE_BACKEND_PROD - Production backend URL (ngrok/Cloudflare)
VITE_BACKEND_LOCAL - Local development backend URL

## Database Schema

User Model: { email: string, password: string (hashed) }
Comment Model: { uid: ObjectId, email: string, comment: string, id: number, finder: string, location: string, createdAt: Date }

## Deployment

Deploy Backend to Render:
Push code to GitHub, create Web Service on Render, connect repository, build command: npm install && npm run build, start command: npm start, add environment variables in Render dashboard

Deploy Frontend to Vercel:
Push code to GitHub, import project to Vercel, build command: npm run build, output directory: dist, add environment variables in Vercel dashboard

## Key Components

WatchOverlay: Wraps anime cards and navigates to detail page with both ID and finder parameters
SourceBadge: Displays green badge for AnimeUnity (working), orange badge for AnimeKai (unstable)
DashboardSidebar: Shows watch history from localStorage and bookmarks from database, responsive on mobile
EpisodeList: Handles episode display with chunk pagination (100 episodes per chunk), sub/dub toggle, and watch history tracking

## Watch History Storage

Watch history stored in localStorage with keys:
watched*{animeId} - Array of watched episode numbers
watched_time*{animeId} - Timestamp of last watch
anime*info*{animeId} - Anime metadata (title, image, finder)

## Contributing

Fork the repository, create a feature branch, make changes, submit a pull request

## License

This project is for educational purposes. All anime content is sourced from external providers.

## Acknowledgments

Consumet extensions for anime data, AnimeUnity for working episode sources, AnimeKai for anime info, Tailwind CSS for styling
