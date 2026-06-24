import { useState } from 'react';
import type { Product } from '../data/mockProducts';
import { InteractiveMap } from './InteractiveMap';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { ArrowLeft, Check, ShieldCheck, ShieldAlert, Star, Heart, Landmark, MapPin, Building, Key, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PropertyDetailProps {
  product: Product;
  onBack: () => void;
  isWishlisted: boolean;
  toggleWishlist: () => void;
  onApply: (app: { propertyId: string, propertyTitle: string, status: string, date: string, totalAmount: string, deposit: string }) => void;
}

export const PropertyDetail = ({
  product,
  onBack,
  isWishlisted,
  toggleWishlist,
  onApply
}: PropertyDetailProps) => {
  const [showInspection, setShowInspection] = useState(false);
  const [inspectionLoading, setInspectionLoading] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  
  // Checkout States
  const [rentalDays, setRentalDays] = useState('3');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Wallet'>('UPI');
  const [walletType, setWalletType] = useState<string>('Paytm');
  const [showQrModal, setShowQrModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  // Price Predictions
  const lastYearPrice = product.rentHistory[product.rentHistory.length - 1].price;
  const rentTrendsData = [
    ...product.rentHistory,
    { year: 2027, price: Math.round(lastYearPrice * 1.05), type: 'forecast' },
    { year: 2028, price: Math.round(lastYearPrice * 1.08), type: 'forecast' }
  ];

  // Calculate Fair Rental Price Score
  const getFairRentalScore = (): { score: string, color: string, reason: string } => {
    if (product.scamRisk === 'High') {
      return {
        score: 'F',
        color: 'var(--danger)',
        reason: 'Rental cost is abnormally cheap. Extreme advance fee fraud risk detected.'
      };
    }
    const ratio = product.rentPerDay / product.securityDeposit;
    if (ratio >= 0.08) {
      return {
        score: 'A+',
        color: 'var(--success)',
        reason: 'Rental rate to deposit ratio is extremely fair. Lowest market rate for verified listings.'
      };
    } else {
      return {
        score: 'A',
        color: 'var(--success)',
        reason: 'Pricing matches regional averages for professional equipment in Indian Rupee markets.'
      };
    }
  };

  const fairRent = getFairRentalScore();

  const handleStartInspection = () => {
    setInspectionLoading(true);
    setTimeout(() => {
      setInspectionLoading(false);
      setShowInspection(true);
    }, 1200);
  };

  const calculatedTotal = product.rentPerDay * parseInt(rentalDays) + product.securityDeposit;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'UPI') {
      setShowQrModal(true);
    } else {
      processPaymentDirect();
    }
  };

  const processPaymentDirect = () => {
    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentLoading(false);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 }
      });
      setApplied(true);
      setShowQrModal(false);
      
      onApply({
        propertyId: product.id,
        propertyTitle: product.title,
        status: 'Booked (Verified)',
        date: new Date().toISOString().split('T')[0],
        totalAmount: `₹${calculatedTotal.toLocaleString('en-IN')}`,
        deposit: `₹${product.securityDeposit.toLocaleString('en-IN')}`
      });
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '1rem 0' }}>
      
      {/* Back Header Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={onBack} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={16} /> Back to Marketplace
        </button>

        <button onClick={toggleWishlist} className="btn-secondary" style={{ color: isWishlisted ? 'var(--danger)' : 'var(--text-primary)' }}>
          <Heart size={16} fill={isWishlisted ? 'var(--danger)' : 'none'} />
          <span>{isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2rem' }}>
        
        {/* Main Details Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header Card */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>{product.category}</span>
                <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>{product.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <MapPin size={16} color="var(--primary)" />
                  Pickup Point: {product.address}, {product.city}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{product.rentPerDay}<span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>/day</span></div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Deposit: ₹{product.securityDeposit}</div>
              </div>
            </div>

            {/* Layout highlights row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              background: 'var(--bg-tertiary)',
              padding: '1rem',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Brand</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{product.brand}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Condition</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{product.condition}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Serial Checked</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>Verified</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                  <Star size={16} fill="#f59e0b" color="#f59e0b" /> {product.rating}
                </div>
              </div>
            </div>
          </div>

          {/* 3D Hardware Inspection Sandbox */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={20} color="var(--primary)" /> AI 3D Hardware Inspection Sandbox
            </h3>
            
            {!showInspection ? (
              <div style={{
                height: '350px',
                background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.65)), url('${product.image || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                textAlign: 'center',
                gap: '1rem',
                padding: '2rem'
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, background: 'rgba(99, 102, 241, 0.3)', padding: '4px 12px', borderRadius: '50px' }}>
                  AI Verification Shield
                </span>
                <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Inspect {product.title} in 3D</h4>
                <p style={{ fontSize: '0.85rem', maxWidth: '400px', opacity: 0.9 }}>
                  Spin and view high-resolution condition captures. Locate pre-marked physical wear points before booking.
                </p>
                <button 
                  onClick={handleStartInspection} 
                  className="btn-primary"
                  disabled={inspectionLoading}
                >
                  {inspectionLoading ? 'Loading 3D Captures...' : 'Start Physical Inspection'}
                </button>
              </div>
            ) : (
              <div style={{
                height: '350px',
                background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.85)), url('${product.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 80px rgba(0,0,0,0.6)'
              }}>
                {/* Hotspot triggers */}
                <div 
                  onClick={() => setActiveHotspot('mount')}
                  style={{
                    position: 'absolute',
                    top: '30%',
                    left: '45%',
                    cursor: 'pointer',
                    background: 'var(--primary)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    boxShadow: '0 0 10px #fff'
                  }}
                >
                  🔍
                </div>
                <div 
                  onClick={() => setActiveHotspot('buttons')}
                  style={{
                    position: 'absolute',
                    top: '55%',
                    left: '60%',
                    cursor: 'pointer',
                    background: 'var(--secondary)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    boxShadow: '0 0 10px #fff'
                  }}
                >
                  🔍
                </div>

                <div style={{ position: 'absolute', bottom: '15px', left: '15px', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontSize: '0.85rem' }}>
                  Interactive 3D model. Click checkpoints to inspect.
                </div>

                {/* Hotspot details overlay */}
                {activeHotspot && (
                  <div className="glass-panel" style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'var(--bg-secondary)',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    maxWidth: '220px',
                    border: '1px solid var(--primary)',
                    zIndex: 10
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {activeHotspot === 'mount' ? 'Connector Bay' : 'Dial Controls'}
                      </strong>
                      <button onClick={() => setActiveHotspot(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--danger)', fontWeight: 'bold' }}>×</button>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {activeHotspot === 'mount' 
                        ? 'Contacts cleaned. Threading exhibits zero structural damage.' 
                        : 'Switches display full tactile response. Knobs operate correctly.'}
                    </p>
                  </div>
                )}

                <button 
                  onClick={() => setShowInspection(false)}
                  className="btn-secondary"
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                >
                  Exit 3D View
                </button>
              </div>
            )}
          </div>

          {/* Description & Specifications */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Product Specifications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {product.specifications.map((spec, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{spec.label}</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{spec.value}</strong>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Condition Report Check</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {product.conditionReport.map((rep, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--success)' }}>✓</span>
                  <span>{rep}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Pricing Predictor Chart */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Landmark size={20} color="var(--primary)" /> AI Rent price prediction
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Historical rates and 2-year demand forecast</span>
              </div>

              {/* Fair Rent Score */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  background: fairRent.color,
                  color: '#fff',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 800
                }}>
                  {fairRent.score}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>Fair Rent Rating</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Pricing Index Analyzed</div>
                </div>
              </div>
            </div>

            {/* Recharts chart */}
            <div style={{ width: '100%', height: '240px', background: 'var(--bg-secondary)', borderRadius: '12px', padding: '1rem 0.5rem', border: '1px solid var(--glass-border)' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rentTrendsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                  <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--primary)', borderRadius: '8px', color: 'var(--text-primary)' }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Line name="Daily Rent Rate (₹)" type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={2.5} activeDot={{ r: 6 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: 'var(--primary-light)', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <strong>AI Market Forecast Summary:</strong> {fairRent.reason} High seasonal demand is projected to increase value by 8% in 2027.
            </div>
          </div>
        </div>

        {/* Sidebar Panel: Checkout form, Scam Shield verification */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* AI Fraud Shield Indicator */}
          <div className="glass-panel" style={{ padding: '1.5rem', border: `1px solid ${product.scamRisk === 'High' ? 'var(--danger)' : 'var(--glass-border)'}` }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {product.scamRisk === 'High' ? <ShieldAlert size={20} color="var(--danger)" /> : <ShieldCheck size={20} color="var(--success)" />}
              AI Verification Shield
            </h3>

            {/* Risk Indicator meter */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                <span>Listing Scam Risk Index</span>
                <span style={{ color: product.scamRisk === 'High' ? 'var(--danger)' : 'var(--success)' }}>
                  {product.scamRisk === 'High' ? 'HIGH RISK' : 'LOW RISK'}
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${100 - product.trustScore}%`,
                  background: product.scamRisk === 'High' ? 'var(--danger)' : 'var(--success)',
                  borderRadius: '4px'
                }} />
              </div>
            </div>

            {/* Trust Breakdown Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {product.scamReasons.map((reason, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: product.scamRisk === 'High' ? 'var(--danger)' : 'var(--success)', flexShrink: 0 }}>
                    {product.scamRisk === 'High' ? '⚠' : '✓'}
                  </span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Secure Booking Section */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Key size={20} color="var(--primary)" /> Rent Product
            </h3>

            {applied ? (
              <div className="animate-fade-in" style={{ textAlign: 'center', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '0.75rem', borderRadius: '50%', display: 'flex' }}>
                  <Check size={28} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Rental Booking Confirmed</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Your booking code has been generated. Pick up coordinates and contract summary details are available on your Renter Portal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>RENTAL DURATION (DAYS)</label>
                  <input 
                    type="number" 
                    className="glass-input" 
                    min="1"
                    max="90"
                    value={rentalDays}
                    onChange={(e) => setRentalDays(e.target.value)}
                    required 
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '10px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Rent ({rentalDays} days):</span>
                    <strong>₹{(product.rentPerDay * parseInt(rentalDays || '0')).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Security Deposit (Refundable):</span>
                    <strong>₹{product.securityDeposit.toLocaleString('en-IN')}</strong>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', fontWeight: 'bold' }}>
                    <span>Total Amount Payable:</span>
                    <span>₹{calculatedTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Indian Payment Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>CHOOSE PAYMENT METHOD</label>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className="btn-secondary"
                      style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', background: paymentMethod === 'UPI' ? 'var(--primary-light)' : 'transparent', borderColor: paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--glass-border)', color: paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--text-primary)' }}
                    >
                      UPI / QR
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('Card')}
                      className="btn-secondary"
                      style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', background: paymentMethod === 'Card' ? 'var(--primary-light)' : 'transparent', borderColor: paymentMethod === 'Card' ? 'var(--primary)' : 'var(--glass-border)', color: paymentMethod === 'Card' ? 'var(--primary)' : 'var(--text-primary)' }}
                    >
                      Cards / Net
                    </button>
                  </div>
                </div>

                {paymentMethod === 'UPI' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <select 
                      className="glass-input" 
                      style={{ fontSize: '0.8rem', padding: '0.4rem' }}
                      value={walletType} 
                      onChange={(e) => setWalletType(e.target.value)}
                    >
                      <option value="Paytm">Paytm UPI</option>
                      <option value="PhonePe">PhonePe UPI</option>
                      <option value="GPay">Google Pay UPI</option>
                    </select>
                  </div>
                )}

                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                  Pay & Secure Product
                </button>
              </form>
            )}

            {/* Owner Info */}
            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Product Owner</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {product.owner.name} {product.owner.verified && '✓'}
                </div>
              </div>
              <a 
                href={`tel:${product.owner.contact}`}
                className="btn-secondary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                Contact
              </a>
            </div>
          </div>

          <InteractiveMap product={product} />

        </div>
      </div>

      {/* Interactive UPI QR code Modal */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div className="glass-panel" style={{
            background: 'var(--bg-secondary)',
            padding: '2rem',
            maxWidth: '350px',
            width: '100%',
            textAlign: 'center',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Scan with {walletType}</strong>
              <button 
                onClick={() => setShowQrModal(false)} 
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--danger)', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            {/* Simulated QR Code Graphic */}
            <div style={{
              background: '#fff',
              padding: '1rem',
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              border: '4px solid var(--primary-light)'
            }}>
              <QrCode size={160} color="#0f172a" />
            </div>

            <div style={{ fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--text-muted)' }}>Amount Payable:</div>
              <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>₹{calculatedTotal.toLocaleString('en-IN')}</strong>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Scan this dynamic QR code using your mobile banking or UPI app to transfer reservation funds.
            </p>

            <button 
              onClick={processPaymentDirect}
              className="btn-primary"
              style={{ justifyContent: 'center', padding: '0.6rem' }}
              disabled={paymentLoading}
            >
              {paymentLoading ? 'Confirming UPI Check...' : 'Simulate UPI Success'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
export default PropertyDetail;
