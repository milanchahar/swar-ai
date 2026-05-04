import React, { useEffect, useRef, useState } from 'react';
import { Pencil, Download } from 'lucide-react';
import CaptionEditModal from './CaptionEditModal';
import ConfirmModal from './ConfirmModal';

const TranscriptSidebar = ({ captions, onEdit, onDelete, onSync, onExportSRT, onExportTXT, currentTime = 0 }) => {
  const activeRef = useRef(null);
  const listRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingText, setEditingText] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  
  const activeIndex = captions.findIndex(c => currentTime >= c.start && currentTime <= c.end);
  const prevActiveIndex = useRef(-1);

  useEffect(() => {
    if (activeIndex !== -1 && activeIndex !== prevActiveIndex.current) {
      if (activeRef.current && listRef.current) {
        const container = listRef.current;
        const row = activeRef.current;
        const targetScrollTop = row.offsetTop - (container.offsetHeight / 2) + (row.offsetHeight / 2);
        
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
      }
      prevActiveIndex.current = activeIndex;
    }
  }, [activeIndex]);

  const handleEditClick = (index, text) => {
    setEditingText(text);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSave = (newText) => {
    onEdit(editingIndex, newText);
    setIsModalOpen(false);
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60).toString().padStart(2, '0');
    const secs = Math.floor(s % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="transcript-sidebar">
      <div className="transcript-header studio-style" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px' }}>
        <h3 style={{ margin: 0, fontSize: '1.8rem', fontFamily: 'var(--font-serif)' }}>Transcript</h3>
        <div className="header-right-actions" style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-white-outlined" onClick={onExportSRT} style={{ fontSize: '0.65rem', padding: '8px 16px', fontWeight: '800' }}>
            .SRT
          </button>
          <button className="btn-white-outlined" onClick={() => onExportTXT()} style={{ fontSize: '0.65rem', padding: '8px 16px', fontWeight: '800' }}>
            .TXT
          </button>
        </div>
      </div>
      
      <div className="transcript-list studio-list" ref={listRef}>
        {captions && captions.length > 0 ? (
          captions.map((cap, index) => {
            const isActive = currentTime >= cap.start && currentTime <= cap.end;
            return (
              <div 
                key={index} 
                ref={isActive ? activeRef : null}
                className={`transcript-row ${isActive ? 'active' : ''}`}
                onClick={() => onSync(cap.start)}
              >
                <div className="row-time">{formatTime(cap.start)}</div>
                <div className="row-content">
                  <p className="caption-text-studio">{cap.text}</p>
                </div>
                <div className="row-actions">
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       handleEditClick(index, cap.text);
                     }}
                     className="edit-trigger-btn"
                     style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: isActive ? '#fff' : '#000', opacity: isActive ? 1 : 0.3 }}
                   >
                     <Pencil size={14} />
                   </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-transcript" style={{ textAlign: 'center', padding: '120px 40px', color: '#ccc' }}>
             <p style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Ready to generate.</p>
          </div>
        )}
      </div>

      <CaptionEditModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialText={editingText}
      />
    </div>
  );
};

export default TranscriptSidebar;
