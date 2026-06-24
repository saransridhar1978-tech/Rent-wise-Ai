import { useState } from 'react';
import type { Product } from '../data/mockProducts';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Users, Landmark, Percent, Check, X, ShieldCheck, Upload } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OwnerDashboardProps {
  properties: Product[];
  onAddProperty: (p: Product) => void;
  applications: { propertyId: string, propertyTitle: string, status: string, date: string, totalAmount?: string, deposit?: string }[];
  onApproveApplication: (propId: string) => void;
}

export const OwnerDashboard = ({
  properties,
  onAddProperty,
  applications,
  onApproveApplication
}: OwnerDashboardProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Product Form States
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [category, setCategory] = useState<'Electronics' | 'Sports' | 'Event' | 'Home' | 'Educational' | 'Travel'>('Electronics');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState<'New' | 'Like New' | 'Good' | 'Fair'>('New');
  const [city, setCity] = useState('Mumbai');
  const [address, setAddress] = useState('');
  const [serial, setSerial] = useState('');
  const [invoiceUploaded, setInvoiceUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Analytical Chart Seeds
  const revenueData = [
    { name: 'Jan', revenue: 12000 },
    { name: 'Feb', revenue: 18500 },
    { name: 'Mar', revenue: 25050 },
    { name: 'Apr', revenue: 31650 },
    { name: 'May', revenue: 42300 },
    { name: 'Jun', revenue: 64850 }
  ];

  const occupancyData = [
    { quarter: 'Q1', rate: 68 },
    { quarter: 'Q2', rate: 75 },
    { quarter: 'Q3', rate: 88 },
    { quarter: 'Q4', rate: 94 }
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rent || !serial) return;

    // Generate random gradients for product card themes
    const themes = [
      'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
      'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
      'linear-gradient(135deg, #15803d 0%, #166534 100%)'
    ];
    const randTheme = themes[Math.floor(Math.random() * themes.length)];

    let finalImage = imageUrl.trim();
    if (!finalImage) {
      const categoryImages: Record<string, string> = {
        Electronics: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
        Event: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        Home: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
        Educational: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
        Travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
      };
      finalImage = categoryImages[category] || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80';
    }

    const newProduct: Product = {
      id: `prod-${Math.random().toString().slice(2, 9)}`,
      title,
      description: desc || 'Premium verified product listing uploaded to RentWise.',
      category,
      brand: brand || 'Generic',
      condition,
      rentPerDay: parseInt(rent),
      securityDeposit: parseInt(deposit) || parseInt(rent) * 10,
      address: address || 'Main Road',
      city,
      rating: 5.0,
      reviewsCount: 0,
      availability: 'Available',
      trustScore: invoiceUploaded ? 95 : 85,
      scamRisk: 'Low',
      scamReasons: ['Product owner Aadhaar verified.', 'Serial number uploaded.'],
      owner: { name: 'Rohan Sharma', contact: '+91 98765 43210', rating: 4.8, verified: true },
      serialNumber: serial,
      invoiceVerified: invoiceUploaded,
      rentHistory: [{ year: 2026, price: parseInt(rent) }],
      gradientTheme: randTheme,
      specifications: [
        { label: 'Brand Name', value: brand || 'Generic' },
        { label: 'Condition Class', value: condition }
      ],
      conditionReport: [
        'Device functional and passes initial self-test checks.',
        'Zero physical structural defects reported by lender.'
      ],
      image: finalImage
    };

    onAddProperty(newProduct);
    confetti({
      particleCount: 120,
      spread: 60,
      origin: { y: 0.6 }
    });

    // Reset Form
    setTitle('');
    setDesc('');
    setRent('');
    setDeposit('');
    setBrand('');
    setAddress('');
    setSerial('');
    setInvoiceUploaded(false);
    setImageUrl('');
    setShowAddForm(false);
  };

  const handleApprove = (propId: string) => {
    onApproveApplication(propId);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.5 }
    });
  };

  // Rohan Sharma is the mocked account owner
  const myProducts = properties.filter(p => p.owner.name === 'Rohan Sharma');

  return (
    <div className="animate-fade-in sidebar-layout" style={{ marginTop: '1rem' }}>
      
      {/* Sidebar - Add product & Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Statistics Widgets in ₹ */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>LENDING METRICS</h4>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
              <Landmark size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹64,850</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Earnings (June)</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
              <Percent size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>94%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lending Demand Rate</div>
            </div>
          </div>
        </div>

        {/* Add listing form */}
        {!showAddForm ? (
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
            style={{ width: '100%', padding: '0.8rem', justifyContent: 'center' }}
          >
            <Plus size={18} /> List Product for Rent
          </button>
        ) : (
          <div className="glass-panel animate-slide-in" style={{ padding: '1.5rem', background: 'var(--bg-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>Post Product Listing</h3>
              <button onClick={() => setShowAddForm(false)} style={{ border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="Product Name (e.g. DSLR Sony A7)" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea 
                className="glass-input" 
                placeholder="Specifications & details description" 
                style={{ height: '70px', resize: 'none' }}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="number" 
                    className="glass-input" 
                    placeholder="Product Value / Deposit (₹)" 
                    value={deposit}
                    onChange={(e) => {
                      const depVal = e.target.value;
                      setDeposit(depVal);
                      const parsed = parseInt(depVal);
                      if (!isNaN(parsed)) {
                        const calculated = parsed > 3000 ? Math.round(parsed * 0.05) : Math.round(parsed * 0.10);
                        setRent(calculated.toString());
                      } else {
                        setRent('');
                      }
                    }}
                    required
                    style={{ flex: 1 }}
                  />
                  <input 
                    type="number" 
                    className="glass-input" 
                    placeholder="Rent (₹/day)" 
                    value={rent}
                    readOnly
                    required
                    style={{ flex: 1, background: 'rgba(255, 255, 255, 0.05)', cursor: 'not-allowed' }}
                    title="Rental price automatically calculated based on product value"
                  />
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', paddingLeft: '0.2rem' }}>
                  * Daily rent is auto-calculated: 5% of value if above ₹3,000, else 10%.
                </span>
              </div>

              <select 
                className="glass-input" 
                value={category} 
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <option value="Electronics">Electronics</option>
                <option value="Sports">Sports & Fitness</option>
                <option value="Event">Event & Entertainment</option>
                <option value="Home">Home Essentials</option>
                <option value="Educational">Educational & Professional</option>
                <option value="Travel">Travel & Adventure</option>
              </select>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="Brand (e.g. Sony)" 
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
                <select 
                  className="glass-input" 
                  value={condition} 
                  onChange={(e) => setCondition(e.target.value as any)}
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <input 
                type="text" 
                className="glass-input" 
                placeholder="Product Serial Number" 
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                required
              />

              <select 
                className="glass-input" 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Delhi">Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
              </select>

              <input 
                type="text" 
                className="glass-input" 
                placeholder="Pickup Area Address" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <input 
                type="text" 
                className="glass-input" 
                placeholder="Product Image URL (optional)" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />

              {/* Simulated Purchase Receipt upload */}
              <label style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>VERIFICATION INVOICE PROOF</span>
                <div style={{ background: 'var(--bg-tertiary)', border: '1px dashed var(--glass-border)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  <Upload size={14} /> {invoiceUploaded ? 'InvoiceUploaded.pdf' : 'Attach Purchase Receipt (PDF)'}
                  <input type="file" style={{ display: 'none' }} onChange={() => setInvoiceUploaded(true)} />
                </div>
              </label>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                List Product for Review
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Main Panel: Analytics & requests queue */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Analytics Graphs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-2">
          {/* Revenue Chart */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Monthly Lending Revenue (₹)</h3>
            <div style={{ width: '100%', height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--glass-border)' }} />
                  <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Demand Chart */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Monthly Product Bookings (%)</h3>
            <div style={{ width: '100%', height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyData}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                  <XAxis dataKey="quarter" stroke="var(--text-muted)" fontSize={10} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} />
                  <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderColor: 'var(--glass-border)' }} />
                  <Area type="monotone" dataKey="rate" stroke="var(--success)" fillOpacity={1} fill="url(#colorRate)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Requests Queue */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={20} color="var(--primary)" /> Rental Booking Inquiries
          </h3>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.85rem' }}>No active booking requests for your products.</p>
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
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Evelyn Sterling wants to rent <span style={{ color: 'var(--primary)' }}>{app.propertyTitle}</span>
                    </h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Renter KYC Trust Score: 98% (Verified). Total Escrowed: {app.totalAmount || '₹4,500'}.
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {app.status === 'Booked (Verified)' || app.status === 'Under AI Review' ? (
                      <>
                        <button 
                          onClick={() => handleApprove(app.propertyId)}
                          className="btn-primary" 
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                        >
                          <Check size={14} /> Approve & Ship
                        </button>
                        <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                          <X size={14} /> Decline
                        </button>
                      </>
                    ) : (
                      <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <ShieldCheck size={12} /> {app.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Portfolios list */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Active Products Inventory ({myProducts.length})</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {myProducts.map(p => (
              <div key={p.id} style={{ display: 'flex', gap: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '12px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: p.gradientTheme, flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{p.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 'bold' }}>₹{p.rentPerDay}/day</span>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{p.city} • Serial: {p.serialNumber}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
export default OwnerDashboard;
