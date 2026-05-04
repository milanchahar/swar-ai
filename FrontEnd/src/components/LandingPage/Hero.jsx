import React from 'react';
import { Link } from 'react-router-dom';
import heroIllustration from '../../assets/hero-illustration.png';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>
            Caption & manage your content very <span className="accent-block"><i>simple.</i></span>
          </h1>
          <p className="hero-subtitle">
            The ultimate AI-powered studio for cinematic video captioning. 
            Elevate your content with word-level sync and high-fidelity transcription.
          </p>
          <div className="hero-btns">
            <button className="btn-studio-primary">GET STARTED</button>
            <button className="btn-studio-outlined">CONTACT US</button>
          </div>
        </div>
        
        <div className="hero-illustration">
          <img src={heroIllustration} alt="SwarAI Hero Illustration" />        </div>
      </div>
    </section>
  );
};

export default Hero;
