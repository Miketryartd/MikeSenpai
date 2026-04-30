MikeSenpai - Anime Streaming Platform
A full-stack anime streaming web application with user authentication, watch history, bookmarks, and multi-provider support (Anipub primary, AnimeKai fallback).

Features
Browse anime by genre, top rated, new releases, and binge-worthy recommendations

Search anime with fuzzy matching and suggestions

Watch episodes with sub/dub support

User authentication (register/login with JWT)

Watch history tracking with localStorage

Bookmark anime (database storage with sync across devices)

Responsive dashboard sidebar for history and bookmarks

Multi-provider fallback system (Anipub as primary, AnimeKai as fallback)

Visual source badges (green for working, orange for unstable)

Tech Stack
Frontend:

React with TypeScript

Tailwind CSS

Libraries:
Consumet
Backend:

Node.js with Express
Zod for validation
TypeScript

MongoDB with Mongoose

JWT authentication

Bcrypt for password hashing

Consumet extensions for anime data

Project Structure
text
MikeSenpai/
├── backend/
│   ├── Config/
│   ├── Controllers/
│   ├── Middleware/
│   ├── Models/
│   ├── Routes/
│   ├── Type/
│   ├── Utilities/
│   └── ZodMod/
├── AnimeApp/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   ├── Config/
│   │   ├── Hooks/
│   │   ├── Pages/
│   │   ├── Services/
│   │   ├── Types/
│   │   └── Utils/
│   └── package.json
└── README.md
Installation
Prerequisites
Node.js (v20 or higher)

MongoDB database

Git

Backend Setup
Clone the repository

bash
git clone https://github.com/Miketryartd/MikeSenpai.git
cd MikeSenpai/backend
Install dependencies

bash
npm install
Create a .env file in the Config folder

env
MONGOOSE_SECRET_PRIV_KEY=your_mongodb_connection_string
JWT_TOKEN_REF_PRIV=your_jwt_secret_key
HOST=3000
Build and run the backend

bash
npm run build
npm start
Frontend Setup
Navigate to the frontend directory

bash
cd ../AnimeApp
Install dependencies

bash
npm install
Create a .env file

env
VITE_BACKEND_PROD=https://your-backend-url.com
VITE_BACKEND_LOCAL=http://localhost:3000
Run the development server

bash
npm run dev
API Endpoints
Anipub Routes (Primary)
Method	Endpoint	Description
GET	/api/animeAll	Get total anime count
GET	/api/searchAnime/:query	Search anime
GET	/api/topRated/:page	Get top rated anime
GET	/api/getAnimeDetail/:id	Get anime details
GET	/api/getStream/:id	Get episode list
GET	/api/findByGenre/:genre	Filter by genre
GET	/api/getInfo/:id	Get anime info
AnimeKai Routes (Fallback)
Method	Endpoint	Description
GET	/api/animekai/top-rated	Get top rated from AnimeKai
GET	/api/animekai/new-releases	Get new releases
GET	/api/animekai/recently-added	Get recently added
GET	/api/animekai/latest-completed	Get latest completed
GET	/api/animekai/info/:id	Get anime info with recommendations
User Routes
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
Comment Routes
Method	Endpoint	Description
POST	/api/auth/comment/:id/:finder	Add comment (auth required)
GET	/api/auth/getComment/:id/:finder	Get comments
Environment Variables
Backend (.env)
Variable	Description
MONGOOSE_SECRET_PRIV_KEY	MongoDB connection string
JWT_TOKEN_REF_PRIV	Secret key for JWT tokens
HOST	Port number (default: 3000)
Frontend (.env)
Variable	Description
VITE_BACKEND_PROD	Production backend URL
VITE_BACKEND_LOCAL	Local development backend URL
Database Schema
User Model
typescript
{
  email: string,
  password: string (hashed)
}
Comment Model
typescript
{
  uid: ObjectId,
  email: string,
  comment: string,
  id: number,
  finder: string,
  location: string,
  createdAt: Date
}
How to Deploy
Deploy Backend to Render
Push your code to GitHub

Create a new Web Service on Render

Connect your GitHub repository

Set build command: npm install && npm run build

Set start command: npm start

Add environment variables in Render dashboard

Click Deploy

Deploy Frontend to Vercel
Push your code to GitHub

Import project to Vercel

Set build command: npm run build

Set output directory: dist

Add environment variables in Vercel dashboard

Click Deploy

Key Components Explained
WatchOverlay
Wraps anime cards and navigates to detail page with both ID and finder parameters.

SourceBadge
Displays green badge for Anipub (working) and orange badge for AnimeKai (unstable).

DashboardSidebar
Shows watch history from localStorage and bookmarks from database. Responsive on mobile with slide-out menu.

EpisodeList
Handles episode display with chunk pagination (100 episodes per chunk), sub/dub toggle, and watch history tracking.

Watch History Storage
Watch history is stored in localStorage with the following keys:

watched_{animeId} - Array of watched episode numbers

watched_time_{animeId} - Timestamp of last watch

anime_info_{animeId} - Anime metadata (title, image, finder)

Contributing
Fork the repository

Create a feature branch

Make your changes

Submit a pull request

License
This project is for educational purposes and one of my dream of making a anime site. All anime content is sourced from external providers.

Acknowledgments
Consumet extensions for anime data

Anipub and AnimeKai APIs

Tailwind CSS for styling
