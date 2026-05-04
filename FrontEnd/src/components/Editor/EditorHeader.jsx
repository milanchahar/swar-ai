import { Settings, LogOut, Layout } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../UserAvatar';
import { Link, useLocation } from 'react-router-dom';

const EditorHeader = () => {
  const { user, token, logout } = useAuth();
  const location = useLocation();
  const isSettings = location.pathname === '/settings';

  return (
    <header className="editor-header">
      <div className="header-left">
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="logo-icon"></div>
            <span>SwarAI</span>
          </Link>
        </div>
      </div>
      
      <div className="header-right">
        {token && (
          <div className="header-user-section" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link 
              to={isSettings ? "/editor" : "/settings"} 
              className={`btn-settings-nav-trigger ${isSettings ? 'active' : ''}`} 
              style={{ 
                textDecoration: 'none',
                color: isSettings ? '#000' : '#888',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                transition: 'color 0.2s'
              }}
            >
              {isSettings ? <Layout size={14} /> : <Settings size={14} />}
              <span>{isSettings ? 'Full Studio' : 'Studio Settings'}</span>
            </Link>
            
            <div className="user-profile-badge" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <UserAvatar name={user?.name || 'U'} style={user?.avatarStyle || 'beam'} size={24} />
              <span style={{ fontWeight: '700', fontSize: '0.8rem', color: '#000', letterSpacing: '0.05em' }}>{user?.name || 'User'}</span>
            </div>
            
            <button 
              onClick={logout} 
              style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#000'}
              onMouseOut={(e) => e.currentTarget.style.color = '#ccc'}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default EditorHeader;
