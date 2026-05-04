import React from 'react';
import CaptionAnimation from './CaptionAnimation';

const Innovation = () => {
  return (
    <section className="innovation" id="about">
      <div className="container">
        <div className="section-header">
          <h2>Redefining Accessibility through AI</h2>
          <p>At SwarAI, we're dedicated to making video content accessible to everyone. Our platform uses state-of-the-art speech recognition to transcribe your audio perfectly, ensuring your message is heard—and read—by audiences worldwide, regardless of language or hearing ability.</p>
        </div>
        
        <CaptionAnimation />
      </div>
    </section>
  );
};

export default Innovation;
