import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import LogoWall from './LogoWall';
import Features from './Features';
import Footer from './Footer';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page" style={{ position: 'relative' }}>
      <Navbar />
      <Hero />
      <LogoWall />
      <Features />
      <Footer />
    </div>
  );
};

export default LandingPage;
