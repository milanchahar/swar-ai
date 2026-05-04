import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="cta-container">
      <div className="container">
        <div className="cta-section">
          <h2>Ready to Caption <br />Your Videos?</h2>
          <p>Bring your content to life with SwarAI's AI-powered caption generator. Join the future of video accessibility and reach a wider, more engaged audience today.</p>
          <div className="cta-btns">
            <Link to="/editor" className="btn btn-white">Try for Free</Link>
            <Link to="/editor" className="btn btn-outline">Request Demo</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
