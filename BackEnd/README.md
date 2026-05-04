# SwarAI - Backend

The backend engine for SwarAI Studio, a powerful video caption generation and editing platform. This service handles video processing, speech-to-text transcription using Whisper, user authentication, and project management.

## Features

- **Video Transcription**: AI-powered transcription using OpenAI's Whisper model via HuggingFace or Groq.
- **Authentication**: Secure JWT-based authentication for user accounts.
- **Project Management**: CRUD operations for user video projects.
- **File Handling**: Robust video/audio file upload management.
- **Database**: PostgreSQL integration with Prisma ORM.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon.tech recommended)
- **ORM**: Prisma
- **AI/ML**: Whisper (Speech-to-Text)
- **Authentication**: JSON Web Tokens (JWT) & BcryptJS

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) database

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd SwarAI/BackEnd
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your actual credentials in the `.env` file.

4. **Prisma Setup**:
   - Generate Prisma client:
     ```bash
     npx prisma generate
     ```
   - Run migrations (if applicable):
     ```bash
     npx prisma db push
     ```

## Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3001` (or your specified `PORT`).

## Deployment (Render)

The backend is designed to be hosted as a **Web Service** on **Render.com**:

1. Connect your repository to Render.
2. Set the **Root Directory** to `BackEnd`.
3. Build Command: `npm install && npx prisma generate`
4. Start Command: `npm start`
5. Add Environment Variables:
   - `DATABASE_URL` (Neon Postgres)
   - `GROQ_API_KEY`
   - `JWT_SECRET`
   - `FRONTEND_URLS` (Your Vercel URL for CORS)


## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | `GET` | Health check endpoint |
| `/api/auth/*` | `ALL` | Authentication routes (signup, login, etc.) |
| `/api/projects/*` | `ALL` | Project management routes |
| `/api/*` | `ALL` | Upload and processing routes |

## Directory Structure

```text
BackEnd/
├── prisma/             # Database schema and local SQLite (dev)
├── src/
│   ├── middleware/    # Auth and file upload middlewares
│   ├── routes/        # Express route handlers
│   ├── utils/         # Transcription and SRT utility scripts
│   └── server.js      # Main entry point of the server
├── uploads/           # Storage for uploaded files (temporary)
├── .env.example       # Template for environment variables
├── package.json       # Project dependencies and scripts
└── README.md          # Project documentation
```