# SwarAI Studio

SwarAI is a professional, AI-powered video studio designed for effortless caption generation and video editing. It combines state-of-the-art speech-to-text (Whisper) with a minimalist, high-performance editor.

---

## Features

- **AI Transcription**: Automatic speech-to-text using OpenAI Whisper.
- **High-Performance Editor**: Clutter-free workspace for editing captions.
- **Real-time Previews**: Smooth video playback with dynamic captions.
- **Local & Cloud Processing**: FFmpeg for local extraction and Groq for cloud power.
- **Secure Auth**: JWT-based user authentication and project management.

## Tech Stack

| Component | Technologies |
| :--- | :--- |
| **FrontEnd** | React 19, Vite, Remotion, FFmpeg.wasm, Lucide |
| **BackEnd** | Node.js, Express, Prisma, PostgreSQL |
| **AI Engine** | OpenAI Whisper (via Groq Cloud) |
| **Deployment** | Vercel (FrontEnd), Render (BackEnd) |

## Project Structure

- **[FrontEnd](./FrontEnd)**: React-based studio editor.
- **[BackEnd](./BackEnd)**: Express server for AI processing and Auth.

---

## Quick Start

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (Neon.tech recommended)
- Groq API Key

### 2. Setup
```bash
# Install dependencies for both
cd BackEnd && npm install
cd ../FrontEnd && npm install

# Configure Environment
# Copy .env.example to .env in both folders and add your keys.

# Initialize Database
cd ../BackEnd
npx prisma db push
```

### 3. Run Locally
```bash
# Run BackEnd (Term 1)
cd BackEnd && npm run dev

# Run FrontEnd (Term 2)
cd FrontEnd && npm run dev
```

---

## Deployment

- **FrontEnd**: Hosted on **Vercel**
- **BackEnd**: Hosted on **Render** (Node.js Web Service)

---

Developed by [Milan Chahar](https://github.com/milanchahar)