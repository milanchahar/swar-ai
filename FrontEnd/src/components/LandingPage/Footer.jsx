import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showFlash, setShowFlash] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setShowFlash(true);
      setEmail('');
      setTimeout(() => setShowFlash(false), 3000);
    }
  };
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo footer-logo-static">
              <div className="logo-icon"></div>
              <span>SwarAI</span>
            </div>
            <p className="footer-desc">
              The ultimate AI-powered studio for cinematic video captioning. 
              Elevate your content with word-level sync and high-fidelity transcription.
            </p>
          </div>
          
          <div className="footer-col">
            <h4>STUDIO</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/benchmarks">Benchmarks</Link></li>
              <li><Link to="/showcase">Showcase</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>DEVELOP</h4>
            <ul>
              <li><Link to="/documentation">Engine</Link></li>
              <li><Link to="/api">API Reference</Link></li>
              <li><Link to="/status">Status</Link></li>
              <li><Link to="/community">Community</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>LEGAL</h4>
            <ul>
              <li><Link to="/terms">Terms</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
              <li><Link to="/contact">Support</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col newsletter">
            <h4>NEWSLETTER</h4>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-black">JOIN</button>
            </form>
            {showFlash && (
              <div className="newsletter-flash">
                Successfully joined the studio mailing list.
              </div>
            )}
          </div>
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} SwarAI STUDIO. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
