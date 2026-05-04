import React from 'react';
import { Captions, FileVideo, Type, Globe } from 'lucide-react';
import './CaptionAnimation.css';

const CaptionAnimation = () => {
  return (
    <div className="caption-animation-container">
      <div className="animation-frame">
        {/* Stylized Video Player UI */}
        <div className="video-player-ui">
          <div className="ui-header">
            <div className="ui-dot"></div>
            <div className="ui-dot"></div>
            <div className="ui-dot"></div>
          </div>
          
          <div className="ui-content">
            {/* Visualizing Video being scanned */}
            <div className="scanner-line"></div>
            
            <div className="ai-core">
              <Captions size={64} className="captions-icon" />
              <div className="pulse-ring"></div>
            </div>

            <div className="data-streams">
              <div className="stream stream-left">
                <FileVideo size={20} />
                <span>RAW_VIDEO.mp4</span>
              </div>
              <div className="stream stream-right">
                <Globe size={20} />
                <span>TRANSCRIPTION_LAYER</span>
              </div>
            </div>
          </div>

          <div className="ui-footer">
            <div className="dynamic-captions">
              <span className="word w1">SwarAI</span>
              <span className="word w2">makes</span>
              <span className="word w3">video</span>
              <span className="word w4">accessible.</span>
            </div>
            <div className="ui-controls"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptionAnimation;
