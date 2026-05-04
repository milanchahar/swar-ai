import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const CaptionEditModal = ({ isOpen, onClose, onSave, initialText }) => {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000 }}>
      <div className="modal-content caption-edit-modal" style={{ borderRadius: '0', padding: '60px 56px', maxWidth: '640px', width: '90%', background: 'white', border: 'none', position: 'relative' }}>
        <div className="modal-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
             <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.2rem', fontWeight: '500', margin: 0, lineHeight: 1, color: '#000' }}>Edit Segment</h3>
             <p style={{ margin: '16px 0 0 0', fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '800' }}>Subtitle Refinement</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', opacity: 0.3, transition: 'opacity 0.2s' }}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your caption here..."
            style={{ 
              width: '100%', 
              minHeight: '180px', 
              padding: '32px', 
              border: '2.5px solid #f2f2f2', 
              borderRadius: '0', 
              fontSize: '1.25rem', 
              fontFamily: 'var(--font-sans)',
              outline: 'none',
              background: '#fafafa',
              resize: 'none',
              lineHeight: '1.7',
              color: '#000',
              fontWeight: 500,
              transition: 'border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onFocus={(e) => e.target.style.borderColor = '#000'}
            onBlur={(e) => e.target.style.borderColor = '#f2f2f2'}
          />
        </div>
        
        <div className="modal-actions">
          <button className="btn-white-outlined" onClick={onClose}>
            CANCEL
          </button>
          <button className="btn-black" onClick={() => onSave(text)}>
            <Save size={16} />
            SAVE CHANGES
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptionEditModal;
