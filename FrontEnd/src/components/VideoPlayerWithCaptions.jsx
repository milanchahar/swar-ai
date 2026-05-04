import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Play, Pause, Volume2, Maximize2 } from 'lucide-react';
import './VideoPlayer.css';

const VideoPlayerWithCaptions = forwardRef(({ videoFile, captions, onTimeUpdate, font, fontSize }, ref) => {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  useImperativeHandle(ref, () => ({
    seekTo: (time) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    }
  }));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [processedCaptions, setProcessedCaptions] = useState([]);
  const [currentWords, setCurrentWords] = useState([]);
  
  // Font and Size are now managed by EditorWrapper props

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (onTimeUpdate) onTimeUpdate(video.currentTime);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoUrl]);

  useEffect(() => {
    if (!captions || captions.length === 0) {
      setProcessedCaptions([]);
      return;
    }

    const processed = [];
    captions.forEach(caption => {
      const words = caption.text.split(' ');
      const wordsPerSegment = 8; // Increased for better stability
      const totalSegments = Math.ceil(words.length / wordsPerSegment);
      const segDuration = (caption.end - caption.start) / totalSegments;
      
      for (let i = 0; i < words.length; i += wordsPerSegment) {
        const segWords = words.slice(i, i + wordsPerSegment);
        const segmentIndex = i / wordsPerSegment;
        processed.push({
          start: caption.start + segmentIndex * segDuration,
          end: caption.start + (segmentIndex + 1) * segDuration,
          text: segWords.join(' '),
          words: segWords,
          originalEnd: caption.end
        });
      }
    });
    setProcessedCaptions(processed);
  }, [captions]);

  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);

  const SYNC_OFFSET = -0.15; // Precision Lead-In for Lip-Sync

  useEffect(() => {
    // TEMPORAL LIP-SYNC ALIGNMENT ENGINE
    // We apply a lead-in offset to match the initial lip movement (articulation)
    const segment = processedCaptions.find(c => 
      currentTime >= (c.start + SYNC_OFFSET) && currentTime <= (c.end + SYNC_OFFSET)
    );

    if (segment) {
      setCurrentCaption(segment.text);
      
      const words = segment.words || segment.text.split(' ');
      setCurrentWords(words);
      
      // Calculate high-fidelity index relative to the SYNC_OFFSET window
      const syncStart = segment.start + SYNC_OFFSET;
      const duration = segment.end - segment.start;
      const progress = Math.max(0, Math.min(1, (currentTime - syncStart) / duration));
      
      const wordCount = words.length;
      const targetIndex = Math.floor(progress * wordCount);
      
      setHighlightedWordIndex(Math.min(targetIndex, wordCount - 1));
    } else {
      setCurrentCaption('');
      setCurrentWords([]);
      setHighlightedWordIndex(-1);
    }
  }, [currentTime, processedCaptions]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * duration;
  };

  const togglePlayPause = () => {
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
  };

  const playerRef = useRef(null);

  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerRef.current.requestFullscreen();
      }
    }
  };

  if (!videoFile) return null;

  return (
    <div className="premium-player" ref={playerRef}>
      <div className="video-viewport">
        {videoUrl ? (
          <video 
            ref={videoRef} 
            src={videoUrl} 
            className="main-video" 
            onClick={togglePlayPause}
            controls={false}
          />
        ) : (
          <div className="loading-state">Initializing Player...</div>
        )}
        
        {currentCaption && (
          <div 
            className="glass-caption" 
            style={{ 
              fontFamily: font,
              transform: `translateX(-50%) scale(${fontSize || 1.0})` 
            }}
          >
            {currentWords.map((word, i) => (
              <span key={i} className={`word ${i === highlightedWordIndex ? 'active' : ''}`}>
                {word}{' '}
              </span>
            ))}
          </div>
        )}

        <div className="overlay-controls">
          <div className="progress-bar-container" onClick={handleSeek}>
            <div className="progress-track-bg"></div>
            <div 
              className="progress-track-fill" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
            <div 
              className="progress-handle"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          
          <div className="controls-row">
            <div className="left-controls">
              <button className="control-btn" onClick={togglePlayPause}>
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>
              <div className="time-info">
                {formatTime(currentTime)} <span>/ {formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="right-controls">
              <button className="control-btn"><Volume2 size={20} /></button>
              <button className="control-btn" onClick={toggleFullscreen}>
                <Maximize2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default VideoPlayerWithCaptions;