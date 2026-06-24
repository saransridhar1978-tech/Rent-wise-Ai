import { useState, useEffect } from 'react';
import { mockProducts } from './data/mockProducts';
import type { Product } from './data/mockProducts';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetail } from './components/PropertyDetail';
import { CompareModal } from './components/CompareModal';
import { AuthModal } from './components/AuthModal';
import { TenantDashboard } from './components/TenantDashboard';
import { OwnerDashboard } from './components/OwnerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AiChatbox } from './components/AiChatbox';
import { Sparkles, LayoutGrid, Heart } from 'lucide-react';

function App() {
  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Authentication & Role
  const [userRole, setUserRole] = useState<'Renter' | 'Owner' | 'Admin' | null>('Renter');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Tab & Selection Navigation
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Products Database State
  const [products, setProducts] = useState<Product[]>(mockProducts);

  // Wishlist & Comparison arrays
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Rental Applications State (represented as bookings in product marketplace)
  const [applications, setApplications] = useState<{ propertyId: string, propertyTitle: string, status: string, date: string, totalAmount?: string, deposit?: string }[]>([
    {
      propertyId: 'prod-2',
      propertyTitle: 'DJI Mavic 3 Pro Drone Kit',
      status: 'AI Check Approved',
      date: '2026-06-20',
      totalAmount: '₹8,997',
      deposit: '₹30,000'
    }
  ]);

  // Language translation support
  const [language, setLanguage] = useState<string>('English');

  // Search and Filter States aligned to products
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [budgetRange, setBudgetRange] = useState<[number, number]>([100, 6000]);
  const [productCategory, setProductCategory] = useState('');
  const [productCondition, setProductCondition] = useState('');
  const [invoiceVerified, setInvoiceVerified] = useState(false);

  // Apply Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Wishlist Management
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // Compare List Management
  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare a maximum of 3 products at once.');
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareList(prev => prev.filter(p => p.id !== id));
  };

  // Submit Rent Application
  const handleApply = (newApp: { propertyId: string, propertyTitle: string, status: string, date: string, totalAmount?: string, deposit?: string }) => {
    setApplications(prev => [newApp, ...prev]);
  };

  // Owner approves application
  const handleApproveApplication = (prodId: string) => {
    setApplications(prev => prev.map(app => 
      app.propertyId === prodId ? { ...app, status: 'Booked (Verified)' } : app
    ));
  };

  // Owner adds product listing
  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
  };

  // Admin deletes product
  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    // Clear selection if deleted
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
  };

  // Admin overrides Trust Score
  const handleUpdateProductTrust = (id: string, score: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        let risk: 'Low' | 'Medium' | 'High' = 'Low';
        let reasons = [...p.scamReasons];
        if (score < 50) {
          risk = 'High';
          if (!reasons.includes('Trust score manually demoted by platform administrator.')) {
            reasons.unshift('Trust score manually demoted by platform administrator.');
          }
        } else if (score < 80) {
          risk = 'Medium';
        } else {
          risk = 'Low';
          reasons = reasons.filter(r => !r.includes('demoted'));
        }
        return {
          ...p,
          trustScore: score,
          scamRisk: risk,
          scamReasons: reasons
        };
      }
      return p;
    }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setBudgetRange([100, 6000]);
    setProductCategory('');
    setProductCondition('');
    setInvoiceVerified(false);
  };

  // Filtering products list based on search criteria
  const filteredProducts = products.filter(p => {
    // Search query keyword check
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = (p.title + ' ' + p.description + ' ' + p.address + ' ' + p.category + ' ' + p.brand).toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // City constraint
    if (selectedCity && p.city.toLowerCase() !== selectedCity.toLowerCase()) return false;

    // Budget constraints
    if (p.rentPerDay > budgetRange[1]) return false;

    // Category
    if (productCategory && p.category !== productCategory) return false;

    // Condition
    if (productCondition && p.condition !== productCondition) return false;

    // Invoice Verified
    if (invoiceVerified && !p.invoiceVerified) return false;

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Navigation Header */}
      <Navbar 
        userRole={userRole}
        setUserRole={setUserRole}
        theme={theme}
        toggleTheme={toggleTheme}
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSelectedProduct(null); // Reset selection on tab transitions
        }}
        wishlistCount={wishlist.length}
        compareCount={compareList.length}
        openAuth={() => setIsAuthOpen(true)}
        openCompare={() => setIsCompareOpen(true)}
      />

      {/* Main content body */}
      <main className="container" style={{ flex: 1, padding: '2rem 1.5rem', position: 'relative' }}>
        
        {currentTab === 'home' ? (
          <>
            {selectedProduct ? (
              // Detailed product view
              <PropertyDetail 
                product={selectedProduct}
                onBack={() => setSelectedProduct(null)}
                isWishlisted={wishlist.some(w => w.id === selectedProduct.id)}
                toggleWishlist={() => toggleWishlist(selectedProduct)}
                onApply={handleApply}
              />
            ) : (
              // Browsing search view
              <>
                <Hero 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  budgetRange={budgetRange}
                  setBudgetRange={setBudgetRange}
                  productCategory={productCategory}
                  setProductCategory={setProductCategory}
                  productCondition={productCondition}
                  setProductCondition={setProductCondition}
                  invoiceVerified={invoiceVerified}
                  setInvoiceVerified={setInvoiceVerified}
                  onResetFilters={handleResetFilters}
                />

                {/* Section Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <LayoutGrid size={22} color="var(--primary)" /> Verified Product Matches ({filteredProducts.length})
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI-driven protection badge filters active</span>
                  </div>
                  
                  {wishlist.length > 0 && (
                    <button 
                      onClick={() => {
                        setUserRole('Renter');
                        setCurrentTab('dashboard');
                      }}
                      className="btn-secondary" 
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', gap: '0.3rem' }}
                    >
                      <Heart size={14} fill="var(--danger)" color="var(--danger)" /> Saved Products ({wishlist.length})
                    </button>
                  )}
                </div>

                {/* Listings Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Sparkles size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5, color: 'var(--text-muted)' }} />
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Products Found</h3>
                    <p style={{ fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto' }}>
                      Try relaxing your search limits, expanding your budget, or clearing active filters using the reset button.
                    </p>
                    <button onClick={handleResetFilters} className="btn-primary" style={{ marginTop: '1.25rem' }}>Clear All Filters</button>
                  </div>
                ) : (
                  <div className="grid-3">
                    {filteredProducts.map(p => (
                      <PropertyCard 
                        key={p.id}
                        product={p}
                        onSelect={() => setSelectedProduct(p)}
                        isWishlisted={wishlist.some(w => w.id === p.id)}
                        toggleWishlist={() => toggleWishlist(p)}
                        isCompared={compareList.some(c => c.id === p.id)}
                        toggleCompare={() => toggleCompare(p)}
                        userFilters={{
                          budget: budgetRange[1],
                          category: productCategory,
                          condition: productCondition,
                          city: selectedCity
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          // Role Dashboards Portal routing
          <>
            {userRole === 'Renter' && (
              <TenantDashboard 
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                applications={applications}
                onSelectProperty={(p) => {
                  setSelectedProduct(p);
                  setCurrentTab('home');
                }}
                setCurrentTab={setCurrentTab}
              />
            )}
            {userRole === 'Owner' && (
              <OwnerDashboard 
                properties={products}
                onAddProperty={handleAddProduct}
                applications={applications}
                onApproveApplication={handleApproveApplication}
              />
            )}
            {userRole === 'Admin' && (
              <AdminDashboard 
                products={products}
                onDeleteProduct={handleDeleteProduct}
                onUpdateProductTrust={handleUpdateProductTrust}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentTab('home');
                }}
                setCurrentTab={setCurrentTab}
              />
            )}
          </>
        )}

        {/* Floating AI chat bubble */}
        <AiChatbox 
          onSelectProduct={(p) => setSelectedProduct(p)} 
          setCurrentTab={setCurrentTab} 
        />
      </main>

      {/* Global Modals */}
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(role) => {
          setUserRole(role);
          setCurrentTab('dashboard');
        }}
      />

      <CompareModal 
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        compareList={compareList}
        removeFromCompare={removeFromCompare}
      />

      {/* Responsive Footer */}
      <Footer language={language} setLanguage={setLanguage} />

    </div>
  );
}

export default App;
