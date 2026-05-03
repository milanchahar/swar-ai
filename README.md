# SwarAI Studio

SwarAI is a professional, AI-powered video studio designed for effortless caption generation and video editing. By combining state-of-the-art speech-to-text models with a minimalist, high-performance editor, SwarAI empowers creators to produce accessible and engaging video content in minutes.

## Project Structure

The project is divided into two main components:

- **[FrontEnd](./FrontEnd)**: A React-based minimalist studio editor for video playback, caption management, and real-time previews. (Hosted on **Vercel**)
- **[BackEnd](./BackEnd)**: An Node.js/Express server that handles AI transcription (Whisper), user authentication, and project storage. (Hosted on **Render**)


## Quick Start

To get the entire platform running locally, follow these steps:

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### 2. Backend Setup
```bash
cd BackEnd
npm install
cp .env.example .env  # Fill in your credentials
npx prisma db push
npm run dev
```

### 3. Frontend Setup
```bash
cd FrontEnd
npm install
cp .env.example .env  # Point VITE_API_URL to your backend
npm run dev
```


The application will typically be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Key Features

- **AI Transcription**: Automatic speech-to-text using OpenAI Whisper.
- **High-Performance Editor**: Clutter-free workspace for editing captions.
- **Remotion Integration**: Smooth, programmatic video rendering and previews.
- **FFmpeg Processing**: Robust client-side and server-side video handling.
- **Secure Auth**: JWT-based user authentication and project management.

## Detailed Documentation

For specific setup details, environment variables, and technical documentation, please refer to the individual READMEs:

- [Frontend Documentation](./FrontEnd/README.md)
- [Backend Documentation](./BackEnd/README.md)