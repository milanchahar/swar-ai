import React, { useState, useRef } from 'react';
import { Sparkles, FileVideo, RotateCcw } from 'lucide-react';
import EditorHeader from './EditorHeader';
import TranscriptSidebar from './TranscriptSidebar';
import ConfirmModal from './ConfirmModal';
import VideoUploader from '../VideoUploader';
import SettingsView from './SettingsView';
import './Editor.css';

const EditorWrapper = () => {
  const [activeTab, setActiveTab] = useState('Projects');
  const [captions, setCaptions] = useState([]);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  
  // Custom Settings State
  const [selectedModel, setSelectedModel] = useState('turbo');
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [fontSize, setFontSize] = useState(1.0);
  
  const uploaderRef = useRef();
  
  const handleReset = () => {
    if (uploaderRef.current) uploaderRef.current.reset();
    setCaptions([]);
    setIsVideoUploaded(false);
    setProjectName('');
    setCurrentTime(0);
    setIsResetModalOpen(false);
  };

  const handleRegenerate = () => {
    triggerGeneration();
    setIsRegenerateModalOpen(false);
  };
  
  const handleFileSelect = (file) => {
    setIsVideoUploaded(true);
    setProjectName(file.name);
    setCaptions([]);
  };

  const handleCaptionsGenerated = (generatedCaptions) => {
    setCaptions(generatedCaptions);
  };

  const handleEdit = (index, newText) => {
    const updated = [...captions];
    updated[index].text = newText;
    setCaptions(updated);
  };

  const handleDelete = (index) => {
    setCaptions(captions.filter((_, i) => i !== index));
  };

  const triggerGeneration = () => {
    if (uploaderRef.current) {
      uploaderRef.current.triggerGeneration();
    }
  };

  const handleExport = () => {
    if (uploaderRef.current) uploaderRef.current.exportSRT();
  };


  const hasCaptions = captions && captions.length > 0;

  const handleSettingsClick = (tab) => {
    setActiveTab(tab);
  };

  const handleExportTXT = () => {
    if (!captions || captions.length === 0) return;
    const textContent = captions.map(c => c.text).join('\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.split('.')[0] || 'transcript'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSync = (time) => {
    if (uploaderRef.current) uploaderRef.current.seekTo(time);
  };

  return (
    <div className="editor-container full-width-layout">
      <EditorHeader />
      
      <div className="workspace-stack-container" style={{ position: 'relative', flex: 1 }}>
        <div className={`main-workspace-grid ${hasCaptions ? 'single-sidebar-layout' : 'full-width-stage-layout'}`}>
          <main className="editor-workspace">
            <div className={`studio-hub ${hasCaptions ? 'has-content' : ''} animate-fade-in`}>
              <div className="studio-viewport-header">
                <div className="file-pill">
                  <FileVideo size={14} />
                  <span>{projectName || 'Studio Workspace'}</span>
                </div>
                <div>
                   {isVideoUploaded && (
                     <button className="btn-reset-light" onClick={() => setIsResetModalOpen(true)}>RESET</button>
                   )}
                </div>
              </div>

              <div className={`video-stage ${isVideoUploaded ? 'has-video' : ''}`}>
                <VideoUploader 
                  ref={uploaderRef}
                  minimal={true} 
                  model={selectedModel}
                  language={selectedLanguage}
                  font={selectedFont}
                  fontSize={fontSize}
                  onFileSelect={handleFileSelect}
                  onCaptionsGenerated={handleCaptionsGenerated} 
                  onTimeUpdate={setCurrentTime}
                />
              </div>

              {isVideoUploaded && (
                <div className="studio-control-toolbar">
                  <div className="toolbar-left">
                    {!hasCaptions && (
                      <button className="btn-black" onClick={triggerGeneration}>
                        GENERATE CAPTIONS
                      </button>
                    )}
                    {hasCaptions && (
                       <button className="btn-white-outlined" onClick={() => setIsRegenerateModalOpen(true)}>
                         <RotateCcw size={14} />
                         REGENERATE
                       </button>
                    )}
                  </div>
                  
                  <div className="toolbar-right">
                    <div className="toolbar-item">
                      <label>Font</label>
                      <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)}>
                        <option value="Inter">Inter (Sans)</option>
                        <option value="Instrument Serif">Instrument (Serif)</option>
                        <option value="Outfit">Outfit (Brand)</option>
                      </select>
                    </div>
                    
                    <div className="toolbar-item">
                      <label>Size</label>
                      <input 
                        type="range" 
                        min="0.5" max="2.5" step="0.1" 
                        value={fontSize} 
                        onChange={(e) => setFontSize(parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {hasCaptions && (
            <aside className="editor-transcript-aside">
              <TranscriptSidebar 
                captions={captions} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                onSync={handleSync}
                currentTime={currentTime}
                onExportSRT={handleExport}
                onExportTXT={handleExportTXT}
              />
            </aside>
          )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleReset}
        title="Reset Project?"
        message="This will remove all uploaded media and generated captions. This action cannot be undone."
        confirmText="Yes, Reset"
        variant="danger"
      />

      <ConfirmModal 
        isOpen={isRegenerateModalOpen}
        onClose={() => setIsRegenerateModalOpen(false)}
        onConfirm={handleRegenerate}
        title="Re-generate?"
        message="Current captions will be replaced with fresh AI output."
        confirmText="Confirm"
        variant="primary"
      />
    </div>
  );
};

export default EditorWrapper;