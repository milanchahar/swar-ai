import React from 'react';
import { Video, Target, Zap, Globe } from 'lucide-react';

const stats = [
  { label: 'Videos Processed', value: '500k+', icon: <Video size={24} color="#10b981" /> },
  { label: 'Transcription Accuracy', value: '99.2%', icon: <Target size={24} color="#10b981" /> },
  { label: 'Time Saved', value: '90%', icon: <Zap size={24} color="#10b981" /> },
  { label: 'Languages Supported', value: '50+', icon: <Globe size={24} color="#10b981" /> },
];

const Stats = () => {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-icon-large">{stat.icon}</div>
              <h2>{stat.value}</h2>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
