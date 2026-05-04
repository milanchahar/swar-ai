import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", variant = "danger" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content confirm-modal-content" style={{ background: 'white', padding: '60px 48px', maxWidth: '420px', width: '90%', textAlign: 'center', border: 'none', position: 'relative' }}>
        <button className="modal-close-btn" onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.3 }}>
          <X size={20} />
        </button>
        
        <div className="modal-body">
          <div className={`modal-icon-wrapper ${variant}`} style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center', color: variant === 'danger' ? '#db4f45' : '#f29b7a' }}>
            <AlertCircle size={48} />
          </div>
          
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', marginBottom: '16px', fontWeight: '500', color: '#000' }}>{title}</h2>
          <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '48px', lineHeight: '1.7', fontWeight: '500' }}>{message}</p>
          
          <div className="modal-actions">
            <button className="btn-white-outlined" onClick={onClose}>
              CANCEL
            </button>
            <button 
              className={variant === 'danger' ? 'btn-danger' : 'btn-black'} 
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
