import React from 'react';

const Features = () => {
  const features = [
    {
      title: "Manage",
      description: "Organize your video projects and captions in one central hub with intuitive controls.",
      isDark: true
    },
    {
      title: "Track",
      description: "Monitor the performance and engagement of your captioned content across all platforms.",
      isDark: false
    },
    {
      title: "Share",
      description: "Seamlessly export and share your videos with hardcoded or sidecar captions in seconds.",
      isDark: false
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="features-header">
          <h2>Our <span className="accent-block">Studio</span> Features</h2>
          <p className="hero-subtitle" style={{ margin: '0 auto' }}>
            Everything you need to create world-class content with professional accessibility.
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className={`feature-card ${feature.isDark ? 'dark' : ''}`}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="feature-image-placeholder">
                {/* Visual element or icon could go here */}
                <div style={{ 
                  width: '60%', 
                  height: '4px', 
                  background: feature.isDark ? '#333' : '#eee',
                  borderRadius: '2px' 
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
