import { useState } from 'react';
import { Search, Mic, MicOff, Filter, Sparkles } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  budgetRange: [number, number];
  setBudgetRange: (range: [number, number]) => void;
  productCategory: string;
  setProductCategory: (category: string) => void;
  productCondition: string;
  setProductCondition: (cond: string) => void;
  invoiceVerified: boolean;
  setInvoiceVerified: (val: boolean) => void;
  onResetFilters: () => void;
}

export const Hero = ({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  budgetRange,
  setBudgetRange,
  productCategory,
  setProductCategory,
  productCondition,
  setProductCondition,
  invoiceVerified,
  setInvoiceVerified,
  onResetFilters
}: HeroProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState('');

  // Web Speech API voice capture
  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechFeedback('Voice recognition not supported in this browser.');
      setTimeout(() => setSpeechFeedback(''), 3000);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-IN'; // Set to Indian English
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechFeedback('Listening for rental item (e.g. DSLR Camera in Mumbai)...');
    };

    recognition.onerror = () => {
      setIsListening(false);
      setSpeechFeedback('Voice recognition error. Try speaking again.');
      setTimeout(() => setSpeechFeedback(''), 3000);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setSpeechFeedback(`Searching for: "${transcript}"`);
      setTimeout(() => setSpeechFeedback(''), 4000);

      // Parse voice criteria for filters
      const qLower = transcript.toLowerCase();
      if (qLower.includes('mumbai') || qLower.includes('bombay')) {
        setSelectedCity('Mumbai');
      } else if (qLower.includes('bangalore') || qLower.includes('bengaluru')) {
        setSelectedCity('Bangalore');
      } else if (qLower.includes('delhi')) {
        setSelectedCity('Delhi');
      } else if (qLower.includes('pune')) {
        setSelectedCity('Pune');
      } else if (qLower.includes('hyderabad')) {
        setSelectedCity('Hyderabad');
      }

      if (qLower.includes('camera') || qLower.includes('dslr') || qLower.includes('sony') || qLower.includes('electronics')) {
        setProductCategory('Electronics');
      } else if (qLower.includes('cycle') || qLower.includes('sports') || qLower.includes('decathlon')) {
        setProductCategory('Sports');
      } else if (qLower.includes('tent') || qLower.includes('trekking') || qLower.includes('camping')) {
        setProductCategory('Travel');
      } else if (qLower.includes('printer') || qLower.includes('educational')) {
        setProductCategory('Educational');
      }

      if (qLower.includes('invoice') || qLower.includes('verified')) {
        setInvoiceVerified(true);
      }
    };

    recognition.start();
  };

  const handleSuggestionClick = (query: string, category: string, city: string, verified: boolean) => {
    setSearchQuery(query);
    setProductCategory(category);
    setSelectedCity(city);
    setInvoiceVerified(verified);
  };

  return (
    <section className="glass-panel" style={{
      padding: '3rem 2rem',
      borderRadius: '24px',
      marginBottom: '2rem',
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Glow Rings */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        right: '-150px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-150px',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(6, 182, 212, 0) 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
        {/* Banner Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          fontSize: '0.8rem',
          fontWeight: 700,
          padding: '0.35rem 0.75rem',
          borderRadius: '9999px',
          marginBottom: '1rem'
        }}>
          <Sparkles size={14} /> AI Product Verification & Trust Scores active
        </div>

        {/* Catchy Headers */}
        <h1 style={{
          fontSize: '3.2rem',
          lineHeight: 1.15,
          fontWeight: 800,
          marginBottom: '1rem',
          letterSpacing: '-0.04em'
        }}>
          Rent Products. <br />
          <span style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>AI-Powered Indian Rental Shield</span>
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
          fontWeight: 400
        }}>
          Search cameras, drones, appliances, and fitness gear with real-time fair pricing recommendations, serial verification and scam alerts.
        </p>

        {/* Search Panel Bar */}
        <div className="glass-panel animate-slide-in" style={{
          background: 'var(--bg-secondary)',
          borderRadius: '16px',
          padding: '1rem',
          boxShadow: 'var(--modal-shadow)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* Top Search Input Row */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="glass-input" 
                style={{ paddingLeft: '2.5rem' }} 
                placeholder="Search products (e.g. Sony, DJI, Tent, Cycle, Dyson...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* City Selector */}
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              className="glass-input"
              style={{ width: '160px', fontWeight: 600, cursor: 'pointer' }}
            >
              <option value="">All Cities</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Delhi">Delhi</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
            </select>

            {/* Voice Command Button */}
            <button 
              onClick={startVoiceSearch}
              className={`btn-secondary ${isListening ? 'animate-float' : ''}`}
              title="Voice Search"
              style={{
                background: isListening ? 'var(--danger-light)' : 'var(--bg-secondary)',
                borderColor: isListening ? 'var(--danger)' : 'var(--glass-border)',
                color: isListening ? 'var(--danger)' : 'var(--text-primary)'
              }}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Toggle Advanced Filters */}
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="btn-secondary"
              style={{
                borderColor: showAdvanced ? 'var(--primary)' : 'var(--glass-border)',
                color: showAdvanced ? 'var(--primary)' : 'var(--text-primary)'
              }}
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>

          {/* Voice Search Feedback text */}
          {speechFeedback && (
            <div style={{
              fontSize: '0.8rem',
              color: 'var(--primary)',
              fontWeight: 600,
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Sparkles size={14} className="animate-float" />
              <span>{speechFeedback}</span>
            </div>
          )}

          {/* Advanced Dropdown Options */}
          {showAdvanced && (
            <div className="animate-slide-in" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              borderTop: '1px solid var(--glass-border)',
              paddingTop: '1rem',
              textAlign: 'left'
            }}>
              {/* Rent Budget Slider */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  MAX RENT RATE: ₹{budgetRange[1]}/day
                </label>
                <input 
                  type="range" 
                  min="100" 
                  max="6000" 
                  step="100" 
                  value={budgetRange[1]} 
                  onChange={(e) => setBudgetRange([budgetRange[0], parseInt(e.target.value)])}
                  style={{
                    width: '100%',
                    accentColor: 'var(--primary)',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Product Category Selector */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  CATEGORY
                </label>
                <select 
                  value={productCategory} 
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="glass-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Any Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Sports">Sports & Fitness</option>
                  <option value="Event">Event & Entertainment</option>
                  <option value="Home">Home Essentials</option>
                  <option value="Educational">Educational & Professional</option>
                  <option value="Travel">Travel & Adventure</option>
                </select>
              </div>

              {/* Product Condition Selector */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  CONDITION RATING
                </label>
                <select 
                  value={productCondition} 
                  onChange={(e) => setProductCondition(e.target.value)}
                  className="glass-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Any Condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              {/* Boolean Toggles */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  background: invoiceVerified ? 'var(--primary-light)' : 'transparent',
                  border: `1px solid ${invoiceVerified ? 'var(--primary)' : 'var(--glass-border)'}`
                }}>
                  <input type="checkbox" checked={invoiceVerified} onChange={(e) => setInvoiceVerified(e.target.checked)} style={{ accentColor: 'var(--primary)' }} />
                  Invoice Verified
                </label>
              </div>

              {/* Reset button */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <button 
                  onClick={onResetFilters}
                  className="btn-secondary"
                  style={{ padding: '0.5rem 1rem', width: '100%', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.15)' }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginTop: '1.5rem',
          fontSize: '0.8rem'
        }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Smart Suggestions:</span>
          <button 
            onClick={() => handleSuggestionClick('Sony Alpha', 'Electronics', 'Mumbai', true)}
            style={{ padding: '4px 12px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            Sony DSLR 📸
          </button>
          <button 
            onClick={() => handleSuggestionClick('DJI Mavic', 'Electronics', 'Bangalore', true)}
            style={{ padding: '4px 12px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            DJI Drone 🛸
          </button>
          <button 
            onClick={() => handleSuggestionClick('Camping Tent', 'Travel', 'Hyderabad', true)}
            style={{ padding: '4px 12px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            Camping Tent 🏕️
          </button>
          <button 
            onClick={() => handleSuggestionClick('Cheap', 'Electronics', 'Mumbai', false)}
            style={{ padding: '4px 12px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            Fraud Alert Check ⚠️
          </button>
        </div>
      </div>
    </section>
  );
};
export default Hero;
