import { Shield, Sparkles, Globe } from 'lucide-react';

interface FooterProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export const Footer = ({ language, setLanguage }: FooterProps) => {
  return (
    <footer className="glass-panel" style={{
      marginTop: 'auto',
      borderRadius: '16px 16px 0 0',
      borderBottom: 'none',
      borderInline: 'none',
      padding: '3rem 0 2rem 0',
      background: 'var(--glass-bg)',
      zIndex: 10
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
          gap: '2.5rem',
          marginBottom: '2rem'
        }}>
          {/* Brand Info */}
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Shield size={20} color="var(--primary)" /> RentWise AI
            </h3>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              marginBottom: '1rem',
              maxWidth: '300px'
            }}>
              Next-generation AI marketplace for safe and verified product rentals in India. Rent cameras, drones, appliances, and fitness gear securely.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              color: 'var(--success)'
            }}>
              <Sparkles size={16} /> Secured by RentWise AI Shield™
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.8rem', fontWeight: 600 }}>Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li><a href="#electronics" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Electronics</a></li>
              <li><a href="#sports" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Sports & Fitness</a></li>
              <li><a href="#events" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Events & Entertainment</a></li>
              <li><a href="#travel" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Travel & Gear</a></li>
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.8rem', fontWeight: 600 }}>Resources</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li><a href="#renter-guide" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Renter Guidebook</a></li>
              <li><a href="#lender-guide" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Lender Guidelines</a></li>
              <li><a href="#agreement" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Rental Agreement</a></li>
              <li><a href="#faqs" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>FAQs</a></li>
            </ul>
          </div>

          {/* Settings / Newsletter */}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.8rem', fontWeight: 600 }}>Localization</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
              Select your preferred layout language. Translating content dynamically.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border)',
              padding: '6px 12px',
              borderRadius: '8px',
              width: 'fit-content'
            }}>
              <Globe size={16} color="var(--text-muted)" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="English" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>English (India)</option>
                <option value="Spanish" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Español</option>
                <option value="French" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Français</option>
                <option value="German" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Deutsch</option>
              </select>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1.5rem 0' }} />

        {/* Copyright */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <span>&copy; {new Date().getFullYear()} RentWise AI India. All rights reserved. Registered trademark.</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#cookies" style={{ color: 'inherit', textDecoration: 'none' }}>Cookie Preference</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
