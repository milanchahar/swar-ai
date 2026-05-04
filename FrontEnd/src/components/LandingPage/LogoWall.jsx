import React from 'react';

const LogoWall = () => {
  const logos = ['Netflix', 'YouTube', 'Vimeo', 'Coursera', 'Loom'];
  
  return (
    <div className="logo-wall">
      <div className="container logo-wall-content">
        {logos.map((logo, index) => (
          <div key={index} className="logo-item">{logo.toLowerCase()}</div>
        ))}
      </div>
    </div>
  );
};

export default LogoWall;
