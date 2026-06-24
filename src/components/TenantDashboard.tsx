import { useState } from 'react';
import { mockProducts, type Product } from '../data/mockProducts';
import { Heart, Clock, Download, Sparkles, FileText, ArrowRight, Home, ShieldCheck, Upload, AlertTriangle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TenantDashboardProps {
  wishlist: Product[];
  toggleWishlist: (p: Product) => void;
  applications: { propertyId: string, propertyTitle: string, status: string, date: string, totalAmount?: string, deposit?: string }[];
  onSelectProperty: (p: Product) => void;
  setCurrentTab: (tab: string) => void;
}

export const TenantDashboard = ({
  wishlist,
  toggleWishlist,
  applications,
  onSelectProperty,
  setCurrentTab
}: TenantDashboardProps) => {
  // KYC States
  const [kycStatus, setKycStatus] = useState<'Unverified' | 'Verifying' | 'Verified'>('Unverified');
  const [aadhaarFile, setAadhaarFile] = useState(false);
  const [panFile, setPanFile] = useState(false);
  const [selfieTaken, setSelfieTaken] = useState(false);
  const [trustScore, setTrustScore] = useState(65);

  // Return & Damage States
  const [showDamageForm, setShowDamageForm] = useState<string | null>(null);
  const [damageDesc, setDamageDesc] = useState('');
  const [damageReported, setDamageReported] = useState(false);

  const getAiPersonalizedSuggestion = (): Product | null => {
    const suggestion = mockProducts.find(p => p.trustScore >= 95 && p.scamRisk === 'Low' && !wishlist.some(w => w.id === p.id));
    return suggestion || mockProducts[0];
  };

  const aiSuggestion = getAiPersonalizedSuggestion();

  const triggerKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKycStatus('Verifying');
    
    setTimeout(() => {
      setKycStatus('Verified');
      setTrustScore(98);
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  const submitDamageReport = (e: React.FormEvent) => {
    e.preventDefault();
    setDamageReported(true);
    setTimeout(() => {
      setShowDamageForm(null);
      setDamageDesc('');
      setDamageReported(false);
      alert('Accidental damage ticket logged successfully. Escrow insurance has been activated.');
    }, 1200);
  };

  return (
    <div className="animate-fade-in sidebar-layout" style={{ marginTop: '1rem' }}>
      
      {/* Sidebar - Renter Info, KYC & Report Download */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* User Card with dynamic Trust Score */}
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            margin: '0 auto 1rem auto'
          }}>
            ES
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Evelyn Sterling</h3>
          
          {kycStatus === 'Verified' ? (
            <span className="badge badge-success" style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              <ShieldCheck size={12} /> Verified Renter
            </span>
          ) : (
            <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Unverified Profile</span>
          )}

          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', textAlign: 'left', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.3rem 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Renter Trust Score:</span>
              <strong style={{ color: trustScore >= 80 ? 'var(--success)' : 'var(--warning)' }}>{trustScore}%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.3rem 0' }}>
              <span style={{ color: 'var(--text-muted)' }}>Rental History Score:</span>
              <strong style={{ color: 'var(--primary)' }}>Excellent (A)</strong>
            </div>
          </div>
        </div>

        {/* KYC Verification Center */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={16} color="var(--primary)" /> Indian KYC Verification
          </h4>

          {kycStatus === 'Verified' ? (
            <div style={{ display: 'flex', gap: '0.4rem', color: 'var(--success)', fontSize: '0.8rem', background: 'var(--success-light)', padding: '0.6rem', borderRadius: '8px' }}>
              <CheckCircle2 size={16} /> Aadhaar & PAN validation complete. Trust score optimized.
            </div>
          ) : kycStatus === 'Verifying' ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '24px',
                height: '24px',
                border: '2px solid rgba(0,0,0,0.1)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'pulseBorder 1s linear infinite',
                margin: '0 auto 0.5rem auto'
              }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI Document Validation in progress...</span>
            </div>
          ) : (
            <form onSubmit={triggerKycSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AADHAAR CARD</span>
                <div style={{ background: 'var(--bg-tertiary)', border: '1px dashed var(--glass-border)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  <Upload size={14} /> {aadhaarFile ? 'AadhaarUploaded.jpg' : 'Upload Aadhaar Card (PDF/JPG)'}
                  <input type="file" style={{ display: 'none' }} onChange={() => setAadhaarFile(true)} required />
                </div>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PAN CARD</span>
                <div style={{ background: 'var(--bg-tertiary)', border: '1px dashed var(--glass-border)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  <Upload size={14} /> {panFile ? 'PanUploaded.jpg' : 'Upload PAN Card (PDF/JPG)'}
                  <input type="file" style={{ display: 'none' }} onChange={() => setPanFile(true)} required />
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={selfieTaken} onChange={(e) => setSelfieTaken(e.target.checked)} required />
                Confirm Selfie match criteria
              </label>

              <button type="submit" className="btn-primary" style={{ padding: '0.5rem', fontSize: '0.8rem', justifyContent: 'center' }}>
                Submit Documents
              </button>
            </form>
          )}
        </div>

        {/* Download Rental Report */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <h4 style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <FileText size={16} color="var(--primary)" /> Download Rental Report
          </h4>
          <button 
            onClick={() => window.print()} 
            className="btn-primary" 
            style={{ width: '100%', padding: '0.6rem', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <Download size={14} /> Generate Report PDF
          </button>
        </div>

        {/* AI Recommendations */}
        {aiSuggestion && (
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--primary-light)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              <Sparkles size={16} />
              <strong style={{ fontSize: '0.85rem' }}>AI Matching suggestion</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-primary)', marginBottom: '0.8rem', lineHeight: 1.4 }}>
              Based on your location and interest history, check out:
            </p>
            <div 
              onClick={() => {
                onSelectProperty(aiSuggestion);
                setCurrentTab('home');
              }}
              style={{
                background: 'var(--bg-secondary)',
                padding: '0.6rem',
                borderRadius: '8px',
                cursor: 'pointer',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)', display: 'block' }}>{aiSuggestion.title}</strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>₹{aiSuggestion.rentPerDay}/day</span>
              </div>
              <ArrowRight size={14} color="var(--primary)" />
            </div>
          </div>
        )}
      </div>

      {/* Main Dash Panel: Active Bookings & Saved products */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Active bookings list */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={20} color="var(--primary)" /> Active Product Rentals
          </h3>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <Home size={36} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
              <p style={{ fontSize: '0.85rem' }}>No active product bookings.</p>
              <button 
                onClick={() => setCurrentTab('home')}
                className="btn-secondary" 
                style={{ marginTop: '0.8rem', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {applications.map((app, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  flexWrap: 'wrap',
                  gap: '0.8rem'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{app.propertyTitle}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                      Booked Date: {app.date} • Total Paid: {app.totalAmount || '₹4,500'} (escrowed)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-success" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
                      {app.status}
                    </span>

                    <button 
                      onClick={() => setShowDamageForm(app.propertyId)}
                      className="btn-secondary" 
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    >
                      Report Damage
                    </button>

                    <button 
                      onClick={() => {
                        const found = mockProducts.find(p => p.id === app.propertyId);
                        if (found) {
                          onSelectProperty(found);
                          setCurrentTab('home');
                        }
                      }}
                      className="btn-secondary" 
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist Section */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Heart size={20} color="var(--danger)" /> Saved Products ({wishlist.length})
          </h3>

          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.85rem' }}>Wishlist is currently empty.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {wishlist.map(p => (
                <div key={p.id} className="glass-panel animate-slide-in" style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{
                    height: '80px',
                    background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('${p.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    padding: '0.5rem',
                    position: 'relative'
                  }}>
                    <button 
                      onClick={() => toggleWishlist(p)}
                      style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}
                    >
                      ×
                    </button>
                    <strong style={{ fontSize: '0.85rem', textShadow: '0 1px 2px rgba(0,0,0,0.4)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '90%' }}>{p.title}</strong>
                  </div>
                  <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>₹{p.rentPerDay}</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/day</span>
                    </div>
                    <button 
                      onClick={() => {
                        onSelectProperty(p);
                        setCurrentTab('home');
                      }}
                      className="btn-secondary" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Damage Modal */}
      {showDamageForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1500,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{ background: 'var(--bg-secondary)', padding: '2rem', maxWidth: '400px', width: '100%', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertTriangle size={18} color="var(--danger)" /> Report Product Damage
              </h3>
              <button onClick={() => setShowDamageForm(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--danger)', fontWeight: 'bold' }}>✕</button>
            </div>

            <form onSubmit={submitDamageReport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>DAMAGE TYPE</label>
                <select className="glass-input">
                  <option>Cosmetic Scratches / Dents</option>
                  <option>Functional Malfunction / Electronics Error</option>
                  <option>Broken Hardware Components</option>
                  <option>Missing Accessories / Cables</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>INCIDENT DETAILS</label>
                <textarea 
                  className="glass-input" 
                  placeholder="Describe how and when the damage occurred..." 
                  style={{ height: '80px', resize: 'none' }}
                  value={damageDesc}
                  onChange={(e) => setDamageDesc(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>UPLOAD PHOTO PROOF</label>
                <div style={{ border: '1px dashed var(--glass-border)', padding: '1rem', textAlign: 'center', borderRadius: '8px', background: 'var(--bg-tertiary)', fontSize: '0.8rem', cursor: 'pointer' }}>
                  📸 Attach Damage Photo (JPG/PNG)
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }} disabled={damageReported}>
                {damageReported ? 'Filing Claim...' : 'File Damage Insurance Claim'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
export default TenantDashboard;
