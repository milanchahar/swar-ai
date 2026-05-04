import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  Image as ImageIcon, 
  Repeat, 
  Share, 
  Users, 
  Settings 
} from 'lucide-react';

const EditorSidebar = ({ activeTab, onTabChange }) => {
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Projects', icon: Video },
    { label: 'Media', icon: ImageIcon },
    { label: 'Style Sync', icon: Repeat },
    { label: 'Export', icon: Share },
    { label: 'Team', icon: Users },
  ];

  return (
    <aside className="editor-sidebar">
      <div className="sidebar-brand">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'inherit' }}>
          <div className="logo-icon-wrapper">
            <div className="logo-icon"></div>
          </div>
          <span>SwarAI</span>
        </Link>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li 
              key={item.label} 
              className={`nav-item ${activeTab === item.label ? 'active' : ''}`}
              onClick={() => onTabChange(item.label)}
            >
              <item.icon size={18} /> {item.label}
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <li 
          className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`}
          onClick={() => onTabChange('Settings')}
          style={{ listStyle: 'none' }}
        >
          <Settings size={18} /> Settings
        </li>
      </div>
    </aside>
  );
};

export default EditorSidebar;
