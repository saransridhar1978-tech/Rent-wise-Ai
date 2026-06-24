import { Home, Sun, Moon, LogIn, LogOut, Heart, BarChart3, User, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  userRole: 'Renter' | 'Owner' | 'Admin' | null;
  setUserRole: (role: 'Renter' | 'Owner' | 'Admin' | null) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  wishlistCount: number;
  compareCount: number;
  openAuth: () => void;
  openCompare: () => void;
}

export const Navbar = ({
  userRole,
  setUserRole,
  theme,
  toggleTheme,
  currentTab,
  setCurrentTab,
  wishlistCount,
  compareCount,
  openAuth,
  openCompare
}: NavbarProps) => {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: '0 0 16px 16px',
      borderTop: 'none',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(16px)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '70px'
      }}>
        {/* Logo */}
        <div 
          onClick={() => setCurrentTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            padding: '0.5rem',
            borderRadius: '10px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Home size={22} />
          </div>
          <span style={{
            fontFamily: 'Outfit',
            fontSize: '1.4rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em'
          }}>
            RentWise <span style={{ color: 'var(--primary)', WebkitTextFillColor: 'initial', fontSize: '0.8rem', fontWeight: 600, verticalAlign: 'super', background: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>Market</span>
          </span>
        </div>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Main Tabs */}
          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setCurrentTab('home')}
              className="btn-secondary"
              style={{
                padding: '0.4rem 0.8rem',
                border: 'none',
                background: currentTab === 'home' ? 'var(--primary-light)' : 'transparent',
                color: currentTab === 'home' ? 'var(--primary)' : 'var(--text-secondary)'
              }}
            >
              Marketplace
            </button>
            {userRole && (
              <button 
                onClick={() => setCurrentTab('dashboard')}
                className="btn-secondary"
                style={{
                  padding: '0.4rem 0.8rem',
                  border: 'none',
                  background: currentTab === 'dashboard' ? 'var(--primary-light)' : 'transparent',
                  color: currentTab === 'dashboard' ? 'var(--primary)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                {userRole === 'Admin' && <ShieldCheck size={16} />}
                {userRole === 'Owner' && <BarChart3 size={16} />}
                {userRole === 'Renter' && <User size={16} />}
                {userRole === 'Owner' ? 'Lender Portal' : userRole === 'Renter' ? 'Renter Portal' : 'Admin Portal'}
              </button>
            )}
          </nav>

          {/* Quick Select Roles for Demo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: 'var(--bg-tertiary)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid var(--glass-border)'
          }}>
            <span style={{ fontSize: '0.75rem', padding: '0 4px', fontWeight: 600, color: 'var(--text-muted)' }}>Role:</span>
            <select 
              value={userRole || ''} 
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  setUserRole(val as any);
                  setCurrentTab('dashboard');
                } else {
                  setUserRole(null);
                  setCurrentTab('home');
                }
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Guest (Logout)</option>
              <option value="Renter" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Renter</option>
              <option value="Owner" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Lender / Owner</option>
              <option value="Admin" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Administrator</option>
            </select>
          </div>

          {/* Utility Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Wishlist */}
            <button 
              onClick={() => {
                if (userRole === 'Renter') {
                  setCurrentTab('dashboard');
                } else {
                  setUserRole('Renter');
                  setCurrentTab('dashboard');
                }
              }}
              className="btn-secondary"
              title="View Wishlist"
              style={{ padding: '0.5rem', borderRadius: '10px', position: 'relative' }}
            >
              <Heart size={18} fill={wishlistCount > 0 ? 'var(--danger)' : 'none'} color={wishlistCount > 0 ? 'var(--danger)' : 'var(--text-primary)'} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'var(--danger)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>{wishlistCount}</span>
              )}
            </button>

            {/* Compare Toggle */}
            <button 
              onClick={openCompare}
              className="btn-secondary"
              title="Compare Products"
              style={{ padding: '0.5rem', borderRadius: '10px', position: 'relative' }}
            >
              <BarChart3 size={18} />
              {compareCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  background: 'var(--primary)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>{compareCount}</span>
              )}
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="btn-secondary"
              style={{ padding: '0.5rem', borderRadius: '10px' }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Auth / Profile */}
            {userRole ? (
              <button 
                onClick={() => {
                  setUserRole(null);
                  setCurrentTab('home');
                }}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', borderRadius: '10px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
              >
                <LogOut size={16} />
                <span style={{ fontSize: '0.85rem' }}>Logout</span>
              </button>
            ) : (
              <button 
                onClick={openAuth}
                className="btn-primary"
                style={{ padding: '0.5rem 1rem', borderRadius: '10px' }}
              >
                <LogIn size={16} />
                <span style={{ fontSize: '0.85rem' }}>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
