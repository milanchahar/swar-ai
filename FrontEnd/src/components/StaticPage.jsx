import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './LandingPage/Navbar';
import Footer from './LandingPage/Footer';
import './StaticPage.css';

const PAGE_CONTENT = {
  '/privacy': {
    title: 'Privacy Policy',
    content: 'We take your privacy seriously. All video and audio processing is done locally via ffmpeg.wasm whenever possible. We do not store your raw media files. Your transcription data is processed with extreme confidentiality.'
  },
  '/terms': {
    title: 'Terms of Service',
    content: 'By using SwarAI Studio, you agree to our terms. This platform is provided for video editing and captioning. Users are responsible for the content they upload and must adhere to copyright laws.'
  },
  '/about': {
    title: 'About SwarAI',
    content: 'SwarAI is a high-fidelity studio environment for creators. Born from the need for precision captioning, we use cutting-edge AI to provide millisecond-perfect word timing and cinematic subtitle overlays.'
  },
  '/features': {
    title: 'Engine Features',
    content: 'Discover the power of our cinematic rendering engine. From word-level lip synchronization to high-contrast glassmorphic overlays, every feature is built for professional production quality.'
  },
  '/pricing': {
    title: 'Studio Pricing',
    content: 'Simple, transparent pricing for creators of all sizes. Whether you are an individual editor or a high-volume production house, Swarovski Studio has a plan that fits your workflow.'
  },
  '/benchmarks': {
    title: 'Performance Benchmarks',
    content: 'We lead the industry in transcription speed and temporal accuracy. Our models are benchmarked against the latest speech-to-text standards to ensure your captions are always frame-perfect.'
  },
  '/showcase': {
    title: 'Creative Showcase',
    content: 'See what other creators are building with SwarAI. From viral social media clips to full-length documentaries, the creative possibilities are unlimited in the Studio Hub.'
  },
  '/status': {
    title: 'System Status',
    content: 'All systems are operational. Our global transcription nodes and localized ffmpeg processing engines are running at 100% capacity to power your production workflow.'
  },
  '/community': {
    title: 'Creator Community',
    content: 'Join thousands of professional editors and creators in our official community. Share presets, get technical support, and collaborate on the future of cinematic video.'
  },
  '/documentation': {
    title: 'Documentation',
    content: 'Learn how to use SwarAI Studio. from uploading your first video to exporting cinematic srt files. Our engine supports multi-language transcription and custom styling presets.'
  },
  '/api': {
    title: 'API Reference',
    content: 'The SwarAI API allows developers to integrate our high-fidelity transcription engine into their own workflows. API keys and full documentation are available upon request.'
  },
  '/contact': {
    title: 'Contact Us',
    content: 'Need help with your studio experience? Reach out to our technical support team at support@swarai.studio. We are available 24/7 for production inquiries.'
  }
};

const StaticPage = () => {
  const { pathname } = useLocation();
  const page = PAGE_CONTENT[pathname] || { title: 'Not Found', content: 'This page does not exist.' };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="static-page-layout">
      <Navbar />
      <div className="static-content-container">
        <div className="container">
          <h1 className="static-title">{page.title}</h1>
          <div className="static-body">
            <p>{page.content}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StaticPage;
