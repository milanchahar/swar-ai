# SwarAI - Frontend

A modern, professional-grade studio environment for video caption generation and editing. Built with a focus on minimalist design and high-performance AI integration, SwarAI Studio provides a seamless workspace for creators.

## Features

- **Professional Editor**: Full-width studio environment for precise caption editing.
- **AI-Powered Transcription**: Seamless integration with the backend Whisper engine.
- **Real-time Preview**: High-performance video playback with dynamic captions using Remotion.
- **Client-side Processing**: Integration with FFmpeg.wasm for robust video handling.
- **Minimalist UI**: Clutter-free layout designed for a distraction-free creative process.
- **Responsive Design**: Polished experience across different screen sizes.

## Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Modern, premium aesthetics)
- **Video Processing**: [Remotion](https://www.remotion.dev/) & [FFmpeg.wasm](https://ffmpegwasm.netlify.app/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd SwarAI/FrontEnd
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
   - Update `VITE_API_URL` to point to your backend service.

## Running the Application


### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

The production-ready assets will be generated in the `dist/` folder.

## Deployment (Vercel)

The frontend is optimized for deployment on **Vercel**:

1. Connect your repository to Vercel.
2. Set the **Root Directory** to `FrontEnd`.
3. Framework Preset: `Vite`.
4. Add Environment Variable: `VITE_API_URL` (points to your production backend).
5. Deploy.


## Directory Structure

```text
FrontEnd/
├── public/             # Static assets (favicons, etc.)
├── src/
│   ├── assets/        # Images and illustrations
│   ├── components/    # Reusable UI components
│   │   ├── Editor/    # Core studio editor components
│   │   ├── LandingPage/ # Landing page components
│   │   └── ...        # Shared components (Uploader, Modals)
│   ├── context/       # Auth and global state management
│   ├── App.jsx        # Root component and routing
│   └── main.jsx       # Application entry point
├── index.html         # HTML template
├── vite.config.js     # Vite configuration
└── package.json       # Project dependencies and scripts
```