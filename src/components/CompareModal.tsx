import type { Product } from '../data/mockProducts';
import { X, Sparkles, AlertTriangle, ShieldCheck, Award } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareList: Product[];
  removeFromCompare: (id: string) => void;
}

export const CompareModal = ({
  isOpen,
  onClose,
  compareList,
  removeFromCompare
}: CompareModalProps) => {
  if (!isOpen) return null;

  // AI analysis calculation to find the "Best Option"
  const getAiWinner = (): { product: Product; reason: string } | null => {
    if (compareList.length === 0) return null;
    
    // Sort by a value formula: (TrustScore * Rating) / (RentPerDay + Deposit * 0.05)
    let bestProduct = compareList[0];
    let maxVal = -1;

    compareList.forEach(p => {
      const score = (p.trustScore * p.rating) / (p.rentPerDay + p.securityDeposit * 0.05);
      if (score > maxVal) {
        maxVal = score;
        bestProduct = p;
      }
    });

    let reason = '';
    if (bestProduct.scamRisk === 'High') {
      reason = 'Warning: While this product lists a low daily rate, its Scam Risk index is flagged HIGH. Proceed with caution.';
    } else {
      reason = `${bestProduct.title} represents the ideal rental deal: low daily cost (₹${bestProduct.rentPerDay}) with a reasonable security deposit (₹${bestProduct.securityDeposit}), coupled with a ${bestProduct.trustScore}% trust score and verified invoice matching.`;
    }

    return { product: bestProduct, reason };
  };

  const aiWinner = getAiWinner();

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
        maxWidth: '1000px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        boxShadow: 'var(--modal-shadow)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={24} color="var(--primary)" /> Smart Product Comparison
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Compare products side-by-side with AI value recommendations</span>
          </div>
          <button 
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.4rem', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Area */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {compareList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
              <AlertTriangle size={48} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>No Products Selected</p>
              <p style={{ fontSize: '0.85rem' }}>Add products from the marketplace to run comparison audits.</p>
            </div>
          ) : (
            <>
              {/* AI Winner Banner */}
              {aiWinner && compareList.length > 1 && (
                <div className="glass-panel" style={{
                  background: 'var(--primary-light)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}>
                  <div style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    display: 'flex'
                  }}>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.2rem' }}>
                      AI Smart Recommendation
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      <strong>AI Deal Winner:</strong> {aiWinner.reason}
                    </p>
                  </div>
                </div>
              )}

              {/* Comparison Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `180px repeat(${compareList.length}, 1fr)`,
                gap: '1px',
                background: 'var(--glass-border)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--glass-border)'
              }}>
                {/* Headers */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Product</div>
                {compareList.map(p => (
                  <div key={p.id} style={{ 
                    background: 'var(--bg-secondary)', 
                    padding: '1rem', 
                    position: 'relative',
                    borderLeft: '1px solid var(--glass-border)',
                    textAlign: 'center'
                  }}>
                    <button 
                      onClick={() => removeFromCompare(p.id)}
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--danger)',
                        cursor: 'pointer'
                      }}
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                    <div style={{
                      height: '8px',
                      background: p.gradientTheme,
                      borderRadius: '4px',
                      marginBottom: '0.5rem'
                    }} />
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {p.title}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.brand} ({p.city})</span>
                  </div>
                ))}

                {/* Daily Cost */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', fontWeight: 600, fontSize: '0.85rem' }}>Daily Rent</div>
                {compareList.map(p => (
                  <div key={p.id} style={{ background: 'var(--bg-secondary)', padding: '1rem', textAlign: 'center', fontWeight: 700, color: 'var(--primary)', fontSize: '1.05rem' }}>
                    ₹{p.rentPerDay}/day
                  </div>
                ))}

                {/* Security Deposit */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', fontWeight: 600, fontSize: '0.85rem' }}>Security Deposit</div>
                {compareList.map(p => (
                  <div key={p.id} style={{ background: 'var(--bg-secondary)', padding: '1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
                    ₹{p.securityDeposit}
                  </div>
                ))}

                {/* Condition Row */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', fontWeight: 600, fontSize: '0.85rem' }}>Condition</div>
                {compareList.map(p => (
                  <div key={p.id} style={{ background: 'var(--bg-secondary)', padding: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>
                    <span className="badge badge-info" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                      {p.condition}
                    </span>
                  </div>
                ))}

                {/* Trust Score Row */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', fontWeight: 600, fontSize: '0.85rem' }}>Trust Score</div>
                {compareList.map(p => (
                  <div key={p.id} style={{ background: 'var(--bg-secondary)', padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      fontWeight: 'bold',
                      color: p.trustScore >= 80 ? 'var(--success)' : 'var(--danger)',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.2rem'
                    }}>
                      {p.trustScore >= 80 && <ShieldCheck size={14} />} {p.trustScore}%
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Risk: {p.scamRisk}</span>
                  </div>
                ))}

                {/* Invoice Checked */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', fontWeight: 600, fontSize: '0.85rem' }}>Invoice verified</div>
                {compareList.map(p => (
                  <div key={p.id} style={{ background: 'var(--bg-secondary)', padding: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>
                    {p.invoiceVerified ? '✅ Verified Invoice' : '❌ No Invoice'}
                  </div>
                ))}

                {/* Serial checked */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', fontWeight: 600, fontSize: '0.85rem' }}>Serial Registered</div>
                {compareList.map(p => (
                  <div key={p.id} style={{ background: 'var(--bg-secondary)', padding: '1rem', textAlign: 'center', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    {p.serialNumber}
                  </div>
                ))}

                {/* Rating */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', fontWeight: 600, fontSize: '0.85rem' }}>Owner Rating</div>
                {compareList.map(p => (
                  <div key={p.id} style={{ background: 'var(--bg-secondary)', padding: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>
                    ⭐ {p.owner.rating} ({p.owner.name})
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'var(--bg-tertiary)',
          borderTop: '1px solid var(--glass-border)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem'
        }}>
          <button onClick={onClose} className="btn-secondary">Close Comparison</button>
        </div>
      </div>
    </div>
  );
};
export default CompareModal;
