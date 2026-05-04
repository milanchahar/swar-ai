import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import EditorWrapper from './components/Editor/EditorWrapper';
import SettingsPage from './components/Editor/SettingsPage';
import StaticPage from './components/StaticPage';
import { useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import './App.css';

function App() {
  const { token, isAuthModalOpen, authMode, closeAuthModal } = useAuth();

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<StaticPage />} />
          <Route path="/features" element={<StaticPage />} />
          <Route path="/pricing" element={<StaticPage />} />
          <Route path="/benchmarks" element={<StaticPage />} />
          <Route path="/showcase" element={<StaticPage />} />
          <Route path="/status" element={<StaticPage />} />
          <Route path="/community" element={<StaticPage />} />
          <Route path="/privacy" element={<StaticPage />} />
          <Route path="/terms" element={<StaticPage />} />
          <Route path="/documentation" element={<StaticPage />} />
          <Route path="/api" element={<StaticPage />} />
          <Route path="/contact" element={<StaticPage />} />
          <Route 
            path="/editor" 
            element={token ? <EditorWrapper /> : <Navigate to="/" />} 
          />
          <Route 
            path="/settings" 
            element={token ? <SettingsPage /> : <Navigate to="/" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={closeAuthModal} 
          authMode={authMode} 
        />
      </div>
    </Router>
  );
}

export default App;
