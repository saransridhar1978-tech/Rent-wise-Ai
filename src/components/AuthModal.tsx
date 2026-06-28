'use client';

import { useState } from 'react';
import { X, ShieldAlert, Mail, Lock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: 'Renter' | 'Owner' | 'Admin') => void;
}

export const AuthModal = ({
  isOpen,
  onClose,
  onLoginSuccess
}: AuthModalProps) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const [role, setRole] = useState<'Renter' | 'Owner' | 'Admin'>('Renter');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      setLoading(false);
      if (tab === 'forgot') {
        setMessage({ type: 'success', text: `A secure reset token was transmitted to ${email || 'your email'}.` });
      } else {
        // Trigger a tiny success confetti
        confetti({
          particleCount: 80,
          spread: 50,
          origin: { y: 0.6 }
        });
        onLoginSuccess(role);
        onClose();
      }
    }, 1200);
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    setMessage(null);

    setTimeout(() => {
      setLoading(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      onLoginSuccess(role);
      onClose();
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }} className="animate-fade-in">
      <div className="glass-panel animate-slide-in" style={{
        background: 'var(--bg-secondary)',
        width: '100%',
        maxWidth: '420px',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: 'var(--modal-shadow)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="btn-secondary"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            padding: '0.4rem',
            borderRadius: '50%'
          }}
        >
          <X size={18} />
        </button>

        {/* Brand Logo inside Modal */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{
            fontFamily: 'Outfit',
            fontSize: '1.6rem',
            fontWeight: 800,
            color: 'var(--text-primary)'
          }}>
            RentWise <span style={{ color: 'var(--primary)' }}>Market</span>
          </span>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Secure Unified Authentication Shield</p>
        </div>

        {/* Tab Headers */}
        {tab !== 'forgot' && (
          <div style={{
            display: 'flex',
            background: 'var(--bg-tertiary)',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '1.5rem'
          }}>
            <button 
              onClick={() => { setTab('login'); setMessage(null); }}
              style={{
                flex: 1,
                padding: '0.5rem 0',
                border: 'none',
                background: tab === 'login' ? 'var(--bg-secondary)' : 'transparent',
                color: tab === 'login' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setTab('signup'); setMessage(null); }}
              style={{
                flex: 1,
                padding: '0.5rem 0',
                border: 'none',
                background: tab === 'signup' ? 'var(--bg-secondary)' : 'transparent',
                color: tab === 'signup' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Sign Up
            </button>
          </div>
        )}

        {message && (
          <div style={{
            background: message.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
            color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
            padding: '0.75rem',
            borderRadius: '10px',
            fontSize: '0.8rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Sign Up Name Field */}
          {tab === 'signup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Full Name</label>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="Evelyn Sterling" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                className="glass-input" 
                style={{ paddingLeft: '2.2rem' }}
                placeholder="name@domain.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          {tab !== 'forgot' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Password</label>
                {tab === 'login' && (
                  <span 
                    onClick={() => setTab('forgot')}
                    style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Forgot Password?
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  className="glass-input" 
                  style={{ paddingLeft: '2.2rem' }}
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Role Access Select for testing role dashboards */}
          {tab !== 'forgot' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.2rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Assign Security Role</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['Renter', 'Owner', 'Admin'] as const).map(r => (
                  <label 
                    key={r}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem',
                      padding: '0.5rem',
                      borderRadius: '10px',
                      border: `1px solid ${role === r ? 'var(--primary)' : 'var(--glass-border)'}`,
                      background: role === r ? 'var(--primary-light)' : 'var(--bg-secondary)',
                      color: role === r ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <input 
                      type="radio" 
                      name="modal-role" 
                      value={r} 
                      checked={role === r}
                      onChange={() => setRole(r)}
                      style={{ display: 'none' }}
                    />
                    {r === 'Renter' ? 'Renter' : r === 'Owner' ? 'Lender' : 'Admin'}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}
            disabled={loading}
          >
            {loading ? (
              <div style={{
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'pulseBorder 1s linear infinite'
              }} />
            ) : tab === 'login' ? 'Sign In' : tab === 'signup' ? 'Create Account' : 'Reset Password'}
          </button>
        </form>

        {/* Alternate Google Sign In */}
        {tab !== 'forgot' && (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '1.25rem 0',
              color: 'var(--text-muted)',
              fontSize: '0.75rem'
            }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--glass-border)' }} />
              <span style={{ padding: '0 0.5rem' }}>OR CONTINUE WITH</span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--glass-border)' }} />
            </div>

            <button 
              onClick={handleGoogleAuth}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#ea4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.94 5.94 0 0 1 8 12.5a5.94 5.94 0 0 1 5.99-6.014c1.49 0 2.824.54 3.86 1.425l3.13-3.13A9.97 9.97 0 0 0 13.99 2 9.99 9.99 0 0 0 4 12c0 5.52 4.48 10 9.99 10 5.76 0 9.75-4.01 9.75-9.89 0-.67-.06-1.32-.16-1.825H12.24Z"/>
              </svg>
              <span>Google Secure Sign In</span>
            </button>
          </>
        )}

        {/* Back Link */}
        {tab === 'forgot' && (
          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <span 
              onClick={() => { setTab('login'); setMessage(null); }}
              style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
            >
              Back to Login
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
export default AuthModal;
