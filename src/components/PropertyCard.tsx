'use client';

import type { Product } from '../data/mockProducts';
import { ShieldCheck, ShieldAlert, Heart, BarChart3, Star, Tag, CheckSquare, Layers } from 'lucide-react';

interface PropertyCardProps {
  product: Product;
  onSelect: () => void;
  isWishlisted: boolean;
  toggleWishlist: () => void;
  isCompared: boolean;
  toggleCompare: () => void;
  userFilters: {
    budget: number;
    category: string;
    condition: string;
    city: string;
  };
}

export const PropertyCard = ({
  product,
  onSelect,
  isWishlisted,
  toggleWishlist,
  isCompared,
  toggleCompare,
  userFilters
}: PropertyCardProps) => {
  // Dynamically calculate the matching score based on user search parameters
  const calculateMatchScore = (): number => {
    let score = 98;

    // Budget deduction
    if (product.rentPerDay > userFilters.budget) {
      const diff = product.rentPerDay - userFilters.budget;
      score -= Math.min(35, Math.round(diff / 10));
    }

    // Category deduction
    if (userFilters.category && product.category !== userFilters.category) {
      score -= 20;
    }

    // Condition deduction
    if (userFilters.condition && product.condition !== userFilters.condition) {
      score -= 15;
    }

    // City mismatch
    if (userFilters.city && product.city.toLowerCase() !== userFilters.city.toLowerCase()) {
      score -= 30;
    }

    return Math.max(35, Math.min(99, score));
  };

  const matchScore = calculateMatchScore();

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div 
      className="glass-card animate-slide-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
      onClick={onSelect}
    >
      {/* Product Image Theme Area */}
      <div style={{
        height: '160px',
        background: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.55)), url('${product.image || "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80"}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        padding: '1rem'
      }}>
        {/* Floating Icons Overlays */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          {/* Trust Badge */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            color: product.trustScore >= 80 ? 'var(--success)' : 'var(--danger)',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            padding: '3px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            border: `1px solid ${product.trustScore >= 80 ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            {product.trustScore >= 80 ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
            <span>{product.trustScore}% Trust</span>
          </div>

          {/* Scam Alert Badging */}
          {product.scamRisk === 'High' && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.9)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 'bold',
              padding: '3px 8px',
              borderRadius: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}>
              <ShieldAlert size={12} /> Scam Alert
            </div>
          )}
        </div>

        {/* Favorite & Compare Actions */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          gap: '0.4rem',
          zIndex: 5
        }}>
          {/* Heart Wishlist */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist();
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem',
              color: isWishlisted ? 'var(--danger)' : '#fff',
              cursor: 'pointer',
              display: 'flex'
            }}
          >
            <Heart size={16} fill={isWishlisted ? 'var(--danger)' : 'none'} />
          </button>

          {/* Compare Selector */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare();
            }}
            style={{
              background: isCompared ? 'var(--primary)' : 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.4rem',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex'
            }}
            title="Add to Compare"
          >
            <BarChart3 size={16} />
          </button>
        </div>

        {/* Product Brand and Title */}
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
            {product.category}
          </span>
          <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800, marginTop: '0.4rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {product.title}
          </h3>
        </div>

        {/* AI Smart Match Bubble */}
        <div style={{
          position: 'absolute',
          bottom: '-15px',
          right: '12px',
          background: 'var(--bg-secondary)',
          border: `2px solid ${getMatchColor(matchScore)}`,
          borderRadius: '50px',
          padding: '0.25rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          zIndex: 4
        }}>
          <span style={{ color: getMatchColor(matchScore) }}>●</span> {matchScore}% Match
        </div>
      </div>

      {/* Body Metadata details */}
      <div style={{ padding: '1.25rem 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        {/* Pricing line */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>₹{product.rentPerDay}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/day</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Deposit: ₹{product.securityDeposit}
          </div>
        </div>

        {/* Address and City */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {product.address}, {product.city}
        </div>

        {/* Layout Icons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          background: 'var(--bg-tertiary)',
          padding: '0.5rem 0.75rem',
          borderRadius: '8px',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Tag size={14} color="var(--text-muted)" /> {product.brand}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <CheckSquare size={14} color="var(--text-muted)" /> {product.condition}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Layers size={14} color="var(--text-muted)" /> Serial Checked
          </span>
        </div>

        {/* Safety and Review rating line */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          marginTop: 'auto'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <strong>{product.rating}</strong> 
            <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount} reviews)</span>
          </span>

          <span style={{ color: 'var(--text-secondary)' }}>
            Trust Index: <strong style={{ color: product.trustScore >= 80 ? 'var(--success)' : 'var(--danger)' }}>{product.trustScore}%</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
export default PropertyCard;
