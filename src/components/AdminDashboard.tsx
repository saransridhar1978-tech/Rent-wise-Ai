'use client';

import { useState } from 'react';
import type { Product } from '../data/mockProducts';
import { ShieldAlert, Trash2, Scale, Eye, UserCheck, Check, X, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  products: Product[];
  onDeleteProduct: (id: string) => void;
  onUpdateProductTrust: (id: string, score: number) => void;
  onSelectProduct: (p: Product) => void;
  setCurrentTab: (tab: string) => void;
}

interface KycRequest {
  id: string;
  name: string;
  role: 'Renter' | 'Lender';
  aadhaarNum: string;
  panNum: string;
  selfieStatus: 'Matched' | 'Unmatched';
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export const AdminDashboard = ({
  products,
  onDeleteProduct,
  onUpdateProductTrust,
  onSelectProduct,
  setCurrentTab
}: AdminDashboardProps) => {
  const [selectedProdId, setSelectedProdId] = useState<string | null>(null);
  const [sliderVal, setSliderVal] = useState<number>(90);

  // KYC Moderation Queue State
  const [kycRequests, setKycRequests] = useState<KycRequest[]>([
    {
      id: 'kyc-1',
      name: 'Aarav Mehta',
      role: 'Renter',
      aadhaarNum: '•••• •••• 9840',
      panNum: 'ABCDE••••F',
      selfieStatus: 'Matched',
      date: '2026-06-23',
      status: 'Pending'
    },
    {
      id: 'kyc-2',
      name: 'Amit "No-Verify" Kumar',
      role: 'Lender',
      aadhaarNum: '•••• •••• 1121',
      panNum: 'FGHIJ••••K',
      selfieStatus: 'Unmatched',
      date: '2026-06-24',
      status: 'Pending'
    },
    {
      id: 'kyc-3',
      name: 'Evelyn Sterling',
      role: 'Renter',
      aadhaarNum: '•••• •••• 7740',
      panNum: 'XYZWP••••A',
      selfieStatus: 'Matched',
      date: '2026-06-22',
      status: 'Approved'
    }
  ]);

  // Platform wide stats
  const stats = {
    totalUsers: 1420,
    verifiedListings: Math.round((products.filter(p => p.trustScore >= 80).length / products.length) * 100),
    scamsDetected: products.filter(p => p.scamRisk === 'High').length,
    revenueTransacted: '₹4,24,500',
    commissionEarned: '₹42,450'
  };

  const handleUpdateTrust = (id: string) => {
    onUpdateProductTrust(id, sliderVal);
    setSelectedProdId(null);
    confetti({
      particleCount: 80,
      spread: 40,
      origin: { y: 0.6 }
    });
  };

  const handleApproveKyc = (id: string) => {
    setKycRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Approved' } : req));
    confetti({
      particleCount: 50,
      spread: 30,
      origin: { y: 0.6 }
    });
  };

  const handleRejectKyc = (id: string) => {
    setKycRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'Rejected' } : req));
  };

  return (
    <div className="animate-fade-in sidebar-layout" style={{ marginTop: '1rem' }}>
      
      {/* Sidebar: Overall Platform metrics & quick slider trust modifier */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Metric panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>SYSTEM AUDITING</h4>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Users:</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{stats.totalUsers}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Listings:</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--success)' }}>{stats.verifiedListings}%</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fraud Alerts Triggered:</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--danger)' }}>{stats.scamsDetected}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gross Transacted:</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>{stats.revenueTransacted}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>10% Escrow Commissions:</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>{stats.commissionEarned}</strong>
          </div>
        </div>

        {/* Dynamic Trust Override controls */}
        {selectedProdId && (
          <div className="glass-panel animate-slide-in" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--primary)' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Scale size={16} color="var(--primary)" /> Edit Trust Index Score
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Product ID: {selectedProdId}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Trust Level (%)</span>
                  <strong>{sliderVal}%</strong>
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={sliderVal}
                  onChange={(e) => setSliderVal(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer', marginTop: '0.3rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleUpdateTrust(selectedProdId)}
                  className="btn-primary" 
                  style={{ flex: 1, padding: '0.5rem', justifyContent: 'center', fontSize: '0.8rem' }}
                >
                  Save Override
                </button>
                <button 
                  onClick={() => setSelectedProdId(null)}
                  className="btn-secondary" 
                  style={{ padding: '0.5rem', justifyContent: 'center', fontSize: '0.8rem' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Panel: Moderation Queue & Flagged listings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* KYC Verification Moderation Queue */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <UserCheck size={20} color="var(--primary)" /> Indian KYC Verification Queue
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {kycRequests.map(req => (
              <div 
                key={req.id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-secondary)',
                  border: `1px solid ${req.status === 'Rejected' ? 'rgba(239, 68, 68, 0.25)' : req.status === 'Approved' ? 'rgba(16, 185, 129, 0.25)' : 'var(--glass-border)'}`,
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  flexWrap: 'wrap',
                  gap: '0.8rem'
                }}
              >
                {/* Info block */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{req.name}</h4>
                    <span className={`badge ${req.role === 'Lender' ? 'badge-info' : 'badge-success'}`} style={{ fontSize: '0.65rem' }}>
                      {req.role}
                    </span>
                    <span className={`badge ${req.status === 'Approved' ? 'badge-success' : req.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                      {req.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                    <span>Aadhaar: {req.aadhaarNum}</span>
                    <span>PAN: {req.panNum}</span>
                    <span style={{ color: req.selfieStatus === 'Matched' ? 'var(--success)' : 'var(--danger)' }}>
                      Selfie Check: {req.selfieStatus}
                    </span>
                  </div>
                </div>

                {/* KYC Actions */}
                {req.status === 'Pending' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button 
                      onClick={() => handleApproveKyc(req.id)}
                      className="btn-primary" 
                      title="Approve KYC Documents"
                      style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', gap: '0.2rem' }}
                    >
                      <Check size={12} /> Approve
                    </button>
                    <button 
                      onClick={() => handleRejectKyc(req.id)}
                      className="btn-secondary" 
                      title="Reject KYC Documents"
                      style={{ padding: '0.4rem 0.6rem', borderRadius: '8px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', fontSize: '0.75rem', gap: '0.2rem' }}
                    >
                      <X size={12} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Moderation Queue */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Scale size={20} color="var(--primary)" /> Product Moderation Queue
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {products.map(p => (
              <div 
                key={p.id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-secondary)',
                  border: `1px solid ${p.scamRisk === 'High' ? 'rgba(239, 68, 68, 0.25)' : 'var(--glass-border)'}`,
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  flexWrap: 'wrap',
                  gap: '0.8rem'
                }}
              >
                {/* Info block */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{p.title}</h4>
                    <span className={`badge ${p.scamRisk === 'High' ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '0.65rem' }}>
                      Risk: {p.scamRisk}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Category: {p.category} • Brand: {p.brand} • Serial: {p.serialNumber} • Trust: {p.trustScore}% • Rent: ₹{p.rentPerDay}/day
                  </div>
                </div>

                {/* Moderation Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {/* View Details */}
                  <button 
                    onClick={() => {
                      onSelectProduct(p);
                      setCurrentTab('home');
                    }}
                    className="btn-secondary" 
                    title="View Details"
                    style={{ padding: '0.4rem', borderRadius: '8px' }}
                  >
                    <Eye size={14} />
                  </button>

                  {/* Edit Trust Overrider */}
                  <button 
                    onClick={() => {
                      setSelectedProdId(p.id);
                      setSliderVal(p.trustScore);
                    }}
                    className="btn-secondary" 
                    title="Override Trust Score"
                    style={{ padding: '0.4rem', borderRadius: '8px', color: 'var(--primary)', borderColor: 'rgba(99, 102, 241, 0.2)' }}
                  >
                    ⚖
                  </button>

                  {/* Delete listing from system */}
                  <button 
                    onClick={() => onDeleteProduct(p.id)}
                    className="btn-secondary" 
                    title="Delete Product"
                    style={{ padding: '0.4rem', borderRadius: '8px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flagged Scam Triggers Breakdown logs */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldAlert size={20} color="var(--danger)" /> AI Fraud Shield Compliance Audits
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem' }}>
            <div style={{ padding: '0.6rem 0.8rem', background: 'rgba(239, 68, 68, 0.08)', borderLeft: '3px solid var(--danger)', borderRadius: '4px', color: 'var(--text-secondary)', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <AlertTriangle size={14} color="var(--danger)" />
              <div>
                <strong>ALERT:</strong> Product <code>prod-6</code> (Suspiciously Cheap DSLR Camera Scam) flagged automatically. Rent (₹199) is 85% below average camera rates. Advancing fee payment demanded in description. No invoice proof was linked.
              </div>
            </div>
            <div style={{ padding: '0.6rem 0.8rem', background: 'rgba(52, 211, 153, 0.08)', borderLeft: '3px solid var(--success)', borderRadius: '4px', color: 'var(--text-secondary)', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <Check size={14} color="var(--success)" />
              <div>
                <strong>AUDIT:</strong> Product <code>prod-1</code> (Sony Alpha 7 IV Mirrorless Camera) verification completed. Serial <code>S-7402941-B</code> matched official manufacturer database. Invoice check passed.
              </div>
            </div>
            <div style={{ padding: '0.6rem 0.8rem', background: 'rgba(52, 211, 153, 0.08)', borderLeft: '3px solid var(--success)', borderRadius: '4px', color: 'var(--text-secondary)', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <Check size={14} color="var(--success)" />
              <div>
                <strong>AUDIT:</strong> Product <code>prod-2</code> (DJI Mavic 3 Pro Drone Kit) registration cleared. Registration checked on DGCA DigitalSky India portal.
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
export default AdminDashboard;
