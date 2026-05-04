import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { UploadCloud, FileVideo, Info, AlertCircle } from 'lucide-react';
import VideoPlayerWithCaptions from './VideoPlayerWithCaptions';
import ConfirmModal from './Editor/ConfirmModal';
import './VideoUploader.css';

const VideoUploader = forwardRef(({ minimal = false, model = 'large-v3', language = 'auto', font, fontSize, onCaptionsGenerated, onFileSelect, onTimeUpdate }, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transcriptionState, setTranscriptionState] = useState('idle'); // 'idle', 'extracting', 'initializing', 'transcribing'
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedAudioUrl, setExtractedAudioUrl] = useState(null);
  const [captions, setCaptions] = useState(null);
  const [srtContent, setSrtContent] = useState(null);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [useHinglishModel, setUseHinglishModel] = useState(false);
  const fileInputRef = useRef(null);
  const ffmpegRef = useRef(new FFmpeg());

  const handleReset = () => {
    setSelectedFile(null);
    setExtractedAudioUrl(null);
    setCaptions(null);
    setSrtContent(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTranscriptionState('idle');
  };

  useImperativeHandle(ref, () => ({
    triggerGeneration: () => {
      if (selectedFile) extractAudio();
      else setError('Please upload a video first');
    },
    reset: handleReset,
    openFilePicker: () => {
      fileInputRef.current?.click();
    },
    exportSRT: () => {
      downloadSRT();
    },
    exportAudio: () => {
      downloadAudio();
    },
    seekTo: (time) => {
      playerRef.current?.seekTo(time);
    }
  }));

  const playerRef = useRef(null);


  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;
    
    ffmpeg.on('progress', ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    setIsFFmpegLoaded(true);
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setExtractedAudioUrl(null);
      setCaptions(null);
      setSrtContent(null);
      if (onFileSelect) onFileSelect(file);
    } else {
      alert('Please select a valid video file');
    }
  };

  const generateCaptions = async (audioBlob) => {
    setIsGeneratingCaptions(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'extracted_audio.mp3');
      formData.append('model', model === 'hinglish' ? 'Oriserve/Whisper-Hindi2Hinglish-Swift' : model);
      formData.append('language', language);

      const endpoint = model === 'hinglish' ? '/upload-audio-hinglish' : '/upload-audio';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // BREAK CAPTIIONS INTO 4-SECOND MAX FRAGMENTS
        const breakLongCaptions = (rawCaptions) => {
          const final = [];
          rawCaptions.forEach(cap => {
            const duration = cap.end - cap.start;
            if (duration <= 4) {
              final.push(cap);
            } else {
              // Split logic
              const words = cap.text.split(' ');
              const segmentsNeeded = Math.ceil(duration / 4);
              const wordsPerSegment = Math.ceil(words.length / segmentsNeeded);
              const segmentDuration = duration / segmentsNeeded;
              
              for (let i = 0; i < segmentsNeeded; i++) {
                const segmentWords = words.slice(i * wordsPerSegment, (i + 1) * wordsPerSegment);
                if (segmentWords.length === 0) continue;
                
                final.push({
                  start: cap.start + (i * segmentDuration),
                  end: Math.min(cap.start + ((i + 1) * segmentDuration), cap.end),
                  text: segmentWords.join(' '),
                  words: segmentWords
                });
              }
            }
          });
          return final;
        };

        const processedCaptions = breakLongCaptions(result.transcription);
        setCaptions(processedCaptions);
        setSrtContent(result.srt);
        if (onCaptionsGenerated) onCaptionsGenerated(processedCaptions);
        console.log('Captions generated and chunked successfully:', processedCaptions);
      } else {
        throw new Error(result.message || 'Failed to generate captions');
      }

    } catch (error) {
      console.error('Error generating captions:', error);
      setError(`Caption Generation Failed: ${error.message || 'Server connection lost'}. The project will be reset to ensure a clean state.`);
      handleReset(); // Auto reset state on failure
    } finally {
      setIsGeneratingCaptions(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const extractAudio = async () => {
    if (!selectedFile) return;
    setTranscriptionState('extracting');
    setIsLoading(true);

    if (!isFFmpegLoaded) {
      await loadFFmpeg();
    }

    setProgress(0);

    const ffmpeg = ffmpegRef.current;
    const inputFileName = 'input.mp4';
    const outputFileName = 'output.mp3';

    try {
      await ffmpeg.writeFile(inputFileName, await fetchFile(selectedFile));

      await ffmpeg.exec(['-i', inputFileName, '-q:a', '0', '-map', 'a', outputFileName]);

      const data = await ffmpeg.readFile(outputFileName);
      const audioBlob = new Blob([data.buffer], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      setExtractedAudioUrl(audioUrl);

      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);

      console.log('Audio extracted, generating captions...');
      await generateCaptions(audioBlob);
      
    } catch (error) {
      console.error('Error extracting audio:', error);
      setError('Failed to extract audio. Please check your file format and try again.');
      handleReset();
    }

    setIsLoading(false);
    setProgress(0);
  };

  const downloadAudio = () => {
    if (extractedAudioUrl) {
      const a = document.createElement('a');
      a.href = extractedAudioUrl;
      a.download = `${selectedFile.name.split('.')[0]}_audio.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const downloadSRT = () => {
    if (srtContent) {
      const blob = new Blob([srtContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedFile.name.split('.')[0]}_captions.srt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={`video-uploader ${minimal ? 'video-uploader-minimal' : ''}`}>
      {!captions && !selectedFile && (
        <div className={`upload-stage-centering ${minimal ? 'minimal-mode' : ''}`}>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
          
          {minimal ? (
            <div className="minimal-upload-ready">
              <div className="upload-brand-circle">
                <UploadCloud size={32} />
              </div>
              <h2>Ready to transcribe?</h2>
              <p>Your media will be analyzed locally for total privacy.</p>
              <button 
                className="btn-black"
                onClick={() => fileInputRef.current?.click()}
                style={{ marginTop: '20px' }}
              >
                UPLOAD VIDEO
              </button>
            </div>
          ) : (
            <div className="upload-container-v2">
              <div
                className={`upload-dropzone-v2 ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="dropzone-content">
                  <div className="upload-icon-circle">
                    <UploadCloud size={40} />
                  </div>
                  <h3>Select Video to Start</h3>
                  <p>Drag and drop your file here, or click to browse</p>
                  <div className="format-chips">
                    <span>MP4</span><span>MOV</span><span>AVI</span><span>WEBM</span><span>MKV</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
        {selectedFile && (
          <div className="video-section" style={{ background: '#000', position: 'relative', width: '100%', height: '100%' }}>
            <VideoPlayerWithCaptions 
              ref={playerRef}
              videoFile={selectedFile}
              captions={captions || []}
              onTimeUpdate={onTimeUpdate}
              font={font}
              fontSize={fontSize}
            />
            
            {(isLoading || isGeneratingCaptions) && (
              <div className="micro-loader-container" style={{ pointerEvents: 'none' }}>
                <div className="orbital-spinner">
                  <div className="orbit-core"></div>
                  <div className="orbit-ring"></div>
                </div>
              </div>
            )}
          </div>
        )}

      {(isLoading || isGeneratingCaptions) && !selectedFile && (
        <div className="micro-loader-container">
          <div className="orbital-spinner">
            <div className="orbit-core"></div>
            <div className="orbit-ring"></div>
          </div>
        </div>
      )}
      <ConfirmModal 
        isOpen={!!error}
        onClose={() => setError(null)}
        onConfirm={() => setError(null)}
        title="Processing Error"
        message={error}
        confirmText="Try Again"
        variant="danger"
      />
    </div>
  );
});

export default VideoUploader;