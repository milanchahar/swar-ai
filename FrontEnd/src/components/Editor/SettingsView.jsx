import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Save, 
  Trash2, 
  Check, 
  Heart, 
  Star, 
  Settings as SettingIcon, 
  Bell, 
  Globe, 
  Briefcase,
  CheckCircle,
  X,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import axios from 'axios';
import UserAvatar from '../UserAvatar';
import ConfirmModal from './ConfirmModal';
import './Settings.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';


const AVATAR_STYLES = [
  { id: 'beam', label: 'Emerald' },
  { id: 'marble', label: 'Ocean' },
  { id: 'pixel', label: 'Amber' },
  { id: 'sunset', label: 'Crimson' },
  { id: 'bauhaus', label: 'Royal' }
];

const SettingsView = () => {
  const { user, token, setToken, updateUser, logout } = useAuth();
  
  // Split name for UI
  const nameParts = (user?.name || '').split(' ');
  const initialFirst = nameParts[0] || '';
  const initialLast = nameParts.slice(1).join(' ') || '';

  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);
  const [email] = useState(user?.email || '');
  const [avatarStyle, setAvatarStyle] = useState(user?.avatarStyle || 'beam');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  
  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility States
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Dirty Check
  const currentFullName = `${firstName} ${lastName}`.trim();
  const isDirty = currentFullName !== (user?.name || '') || avatarStyle !== (user?.avatarStyle || 'beam');

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    const fullName = `${firstName} ${lastName}`.trim();

    try {
       const response = await axios.put(`${API_BASE_URL}/auth/profile`, 
        { name: fullName, avatarStyle: avatarStyle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      updateUser(response.data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setShowStyleSelector(false); // Auto-hide selector on success
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
       console.error('Update error:', error);
       setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      logout();
    } catch (err) {
      alert("Failed to delete account. Please try again.");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPasswordMessage({ type: 'error', text: 'Please fill all password fields' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    
    setIsChangingPassword(true);
    setPasswordMessage({ type: '', text: '' });
    
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/password`, 
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the local token to match the new security version
      // so the current session remains valid.
      if (response.data.token) {
        setToken(response.data.token);
      }

      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      if (error.response?.status === 403) {
        setPasswordMessage({ type: 'error', text: 'Session expired. Logging out...' });
        setTimeout(() => logout(), 2000);
      } else {
        setPasswordMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update password' });
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCancel = () => {
     const nameParts = (user?.name || '').split(' ');
     setFirstName(nameParts[0] || '');
     setLastName(nameParts.slice(1).join(' ') || '');
     setAvatarStyle(user?.avatarStyle || 'beam');
     setMessage({ type: '', text: '' });
  };

  return (
    <div className="settings-container-minimal">
      {/* Main Content Area - Full Width */}
      <div className="settings-main-expanded">
        {/* Header Section */}
        <div className="settings-view-header">
          <div className="header-info">
            <h2>Personal Info</h2>
            <p>View and update your account's personal information.</p>
          </div>
          <div className="header-buttons">
            {isDirty && (
              <div className="animate-fade-in" style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="btn-white-outlined" 
                  onClick={handleCancel}
                  style={{ padding: '10px 24px', fontSize: '0.75rem' }}
                >
                  CANCEL
                </button>
                <button 
                  className="btn-black" 
                  onClick={handleSave} 
                  disabled={isSaving}
                  style={{ padding: '10px 24px', fontSize: '0.75rem' }}
                >
                  {isSaving ? 'UPDATING...' : 'SAVE CHANGES'}
                </button>
              </div>
            )}
          </div>
        </div>

        {message.text && (
          <div className={`settings-message-toast ${message.type}`}>
            {message.text}
          </div>
        )}

        </div>
 
          {/* Form Body */}
          <div className="settings-form-body">
            {/* Profile Photo Section */}
            <div className="settings-section-row">
              <div className="section-label">
                <h4>Profile Photo</h4>
                <p>Personalize your studio identity.</p>
              </div>
              <div className="section-content">
                <div className="photo-upload-area">
                  <div className="avatar-preview-box">
                    <UserAvatar name={user?.name || 'U'} style={avatarStyle} size={120} />
                  </div>
                  <div className="photo-actions">
                    <button 
                      className="btn-black"
                      onClick={() => setShowStyleSelector(!showStyleSelector)}
                      style={{ padding: '12px 24px', fontSize: '0.7rem' }}
                    >
                      CHANGE AVATAR
                    </button>
                  </div>
                </div>
  
                {showStyleSelector && (
                   <div className="avatar-style-selector animate-slide-up" style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                    {AVATAR_STYLES.map(style => (
                      <button 
                        key={style.id}
                        className={`style-chip ${avatarStyle === style.id ? 'active' : ''}`}
                        onClick={() => setAvatarStyle(style.id)}
                        style={{ padding: '8px 16px', border: '1px solid #eee', background: avatarStyle === style.id ? '#000' : '#fff', color: avatarStyle === style.id ? '#fff' : '#000', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
  
            {/* Name Section */}
            <div className="settings-section-row">
              <div className="section-label">
                <h4>Name</h4>
              </div>
              <div className="section-content">
                <div className="name-grid-row">
                  <div className="input-field-group">
                    <input 
                      type="text" 
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="input-field-group">
                    <input 
                      type="text" 
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
  
            {/* Email Section */}
            <div className="settings-section-row">
              <div className="section-label">
                <h4>Email ID</h4>
                <p>Primary account access email.</p>
              </div>
              <div className="section-content">
                 <div className="input-with-icon-pro">
                    <Mail size={16} className="field-icon" style={{ opacity: 0.3 }} />
                    <input type="email" value={email} disabled style={{ color: '#888', borderBottomStyle: 'dashed' }} />
                 </div>
              </div>
            </div>
  
            {/* Password Section */}
            <div className="settings-section-row">
              <div className="section-label">
                <h4>Security</h4>
                <p>Update your authentication credentials.</p>
              </div>
              <div className="section-content">
                <div className="password-stack">
                  <div className="input-with-icon-pro">
                     <Lock size={16} className="field-icon" style={{ opacity: 0.3 }} />
                     <input 
                       type={showCurrent ? "text" : "password"} 
                       placeholder="Current Password" 
                       value={currentPassword}
                       onChange={(e) => setCurrentPassword(e.target.value)}
                     />
                     {currentPassword && (
                       <button type="button" className="password-toggle-btn" onClick={() => setShowCurrent(!showCurrent)}>
                         {showCurrent ? <Eye size={16} /> : <EyeOff size={16} />}
                       </button>
                     )}
                  </div>
                  <div className="form-grid-row" style={{ marginTop: '32px' }}>
                    <div className="input-with-icon-pro">
                       <Lock size={16} className="field-icon" style={{ opacity: 0.3 }} />
                       <input 
                         type={showNew ? "text" : "password"} 
                         placeholder="New Password" 
                         value={newPassword}
                         onChange={(e) => setNewPassword(e.target.value)}
                       />
                       {newPassword && (
                         <button type="button" className="password-toggle-btn" onClick={() => setShowNew(!showNew)}>
                           {showNew ? <Eye size={16} /> : <EyeOff size={16} />}
                         </button>
                       )}
                    </div>
                    <div className="input-with-icon-pro">
                       <Lock size={16} className="field-icon" style={{ opacity: 0.3 }} />
                       <input 
                         type={showConfirm ? "text" : "password"} 
                         placeholder="Confirm Password" 
                         value={confirmPassword}
                         onChange={(e) => setConfirmPassword(e.target.value)}
                       />
                       {confirmPassword && (
                         <button type="button" className="password-toggle-btn" onClick={() => setShowConfirm(!showConfirm)}>
                           {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
                         </button>
                       )}
                    </div>
                  </div>
                  
                  {passwordMessage.text && (
                    <div className={`password-feedback-toast ${passwordMessage.type}`} style={{ marginTop: '20px', fontSize: '0.85rem', color: passwordMessage.type === 'error' ? '#ef4444' : '#10b981' }}>
                       {passwordMessage.text}
                    </div>
                  )}
  
                  <button 
                    className="btn-black" 
                    onClick={handlePasswordUpdate}
                    disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                    style={{ 
                      marginTop: '32px', 
                      width: 'auto', 
                      minWidth: '200px',
                      opacity: (isChangingPassword || !currentPassword || !newPassword || !confirmPassword) ? 0.3 : 1,
                      cursor: (isChangingPassword || !currentPassword || !newPassword || !confirmPassword) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isChangingPassword ? 'UPDATING...' : 'UPDATE PASSWORD'}
                  </button>
                </div>
              </div>
            </div>
  
            {/* Delete Account Section */}
            <div className="settings-section-row danger-zone">
              <div className="section-label">
                <h4>Danger Zone</h4>
                <p>Irreversibly delete your account and all associated data.</p>
              </div>
              <div className="section-content">
                <button 
                  className="btn-danger-studio" 
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'DELETING...' : 'DELETE MY ACCOUNT PERMANENTLY'}
                </button>
              </div>
            </div>
 
      </div>

      <ConfirmModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Account Permanently?"
        message="Are you sure you want to PERMANENTLY delete your account? This action cannot be undone and you will lose all your projects and data."
        confirmText={isDeleting ? "Deleting..." : "Yes, Delete Permanently"}
        variant="danger"
      />
    </div>
  );
};

export default SettingsView;
