import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, X, Eye, EyeOff } from 'lucide-react';
import Portal from './Portal';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose} style={{ backdropFilter: 'blur(20px)', background: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-content auth-modal" onClick={e => e.stopPropagation()} style={{ 
          background: '#fff',
          borderRadius: '0', 
          padding: '80px 60px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.2)',
          border: 'none',
          position: 'relative',
          maxWidth: '500px',
          width: '100%'
        }}>
          <button className="auth-close" onClick={onClose} style={{ 
            position: 'absolute', 
            top: '32px', 
            right: '32px', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            opacity: 0.3
          }}>
            <X size={20} />
          </button>

          <div className="auth-header" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '3.5rem', 
              fontWeight: 500,
              marginBottom: '16px',
              color: '#000'
            }}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ color: '#888', fontSize: '0.95rem', fontWeight: 500, letterSpacing: '0.02em' }}>
              {mode === 'login' ? 'Sign in to your studio workspace' : 'Begin your cinematic captioning journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {error && <div className="auth-error" style={{ background: '#fef2f2', color: '#b91c1c', padding: '16px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #fee2e2' }}>{error}</div>}
            
            {mode === 'signup' && (
              <div className="input-field-group">
                <input 
                  type="text" 
                  placeholder="FULL NAME" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  style={{ 
                    width: '100%', 
                    padding: '16px 0', 
                    border: 'none', 
                    borderBottom: '2.5px solid #eee', 
                    outline: 'none', 
                    fontSize: '0.75rem', 
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    background: 'transparent' 
                  }}
                />
              </div>
            )}

            <div className="input-field-group">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '16px 0', 
                  border: 'none', 
                  borderBottom: '2.5px solid #eee', 
                  outline: 'none', 
                  fontSize: '0.75rem', 
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  background: 'transparent' 
                }}
              />
            </div>

            <div className="input-field-group" style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="PASSWORD" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '16px 0', 
                  border: 'none', 
                  borderBottom: '2.5px solid #eee', 
                  outline: 'none', 
                  fontSize: '0.75rem', 
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  background: 'transparent',
                  paddingRight: '40px' 
                }}
              />
              {password && (
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#ccc' }}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              )}
            </div>

            <button type="submit" className="btn-studio-primary">
              <span style={{ flex: 1 }}>{mode === 'login' ? 'SIGN IN' : 'GET STARTED'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <footer className="auth-switch-footer" style={{ textAlign: 'center', marginTop: '48px', fontSize: '0.85rem' }}>
            {mode === 'login' ? (
              <p style={{ color: '#888', fontWeight: 500 }}>
                New to SwarAI? <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: '#000', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline', letterSpacing: '0.05em' }}>JOIN NOW</button>
              </p>
            ) : (
              <p style={{ color: '#888', fontWeight: 500 }}>
                Already have an account? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#000', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline', letterSpacing: '0.05em' }}>SIGN IN</button>
              </p>
            )}
          </footer>
        </div>
      </div>
    </Portal>
  );
};

export default AuthModal;
