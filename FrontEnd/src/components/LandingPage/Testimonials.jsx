import React from 'react';

const testimonials = [
  {
    name: 'MARK VLOGS',
    role: 'Content Creator, YouTube',
    text: 'SwarAI has completely changed my workflow. I used to spend hours manually typing captions, but now it\'s done in seconds with incredible accuracy.',
    rating: 5
  },
  {
    name: 'ELENA RODRIGUEZ',
    role: 'Social Media Manager',
    text: 'The translation feature is a game-changer. I can now post the same video with different language subtitles and reach a global audience effortlessly.',
    rating: 5
  },
  {
    name: 'DAVID CHEN',
    role: 'Video Editor',
    text: 'The automated styling and SRT export options are exactly what I needed. It integrates perfectly with my professional editing software.',
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>More than 1,000 Users <br />Testimony This Product</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="stars">{'⭐'.repeat(Math.round(t.rating))}</div>
              <p className="testimony">"{t.text}"</p>
              <div className="user-info">
                <div className="user-avatar">{t.name[0]}</div>
                <div>
                  <h4>{t.name}</h4>
                  <p>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
