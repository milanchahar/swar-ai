import React from 'react';
import EditorHeader from './EditorHeader';
import SettingsView from './SettingsView';
import './Editor.css';
import './Settings.css';

const SettingsPage = () => {
  return (
    <div className="editor-container full-settings-page">
      <EditorHeader />
      <div className="settings-page-content" style={{ flex: 1, background: '#fff', overflowY: 'auto' }}>
        <SettingsView />
      </div>
    </div>
  );
};

export default SettingsPage;
