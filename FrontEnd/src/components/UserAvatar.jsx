import React from 'react';

const AVATAR_STYLING = {
  beam: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff'
  },
  marble: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#ffffff'
  },
  pixel: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#ffffff'
  },
  sunset: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#ffffff'
  },
  bauhaus: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    color: '#ffffff'
  }
};

const UserAvatar = ({ name = 'User', style = 'beam', size = 40 }) => {
  const initial = name.charAt(0).toUpperCase();
  const config = AVATAR_STYLING[style] || AVATAR_STYLING.beam;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: config.background,
    color: config.color,
    fontSize: `${size * 0.45}px`,
    fontWeight: '800',
    flexShrink: 0,
    userSelect: 'none',
    lineHeight: '1',
    border: '2px solid rgba(255,255,255,0.2)'
  };

  return (
    <div style={containerStyle} className="user-avatar-css">
      {initial}
    </div>
  );
};

export default UserAvatar;
