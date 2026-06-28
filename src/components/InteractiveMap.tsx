'use client';

import { useState } from 'react';
import type { Product } from '../data/mockProducts';
import { Shield, MapPin, Eye, Compass, Package, Award, Truck } from 'lucide-react';

interface InteractiveMapProps {
  product: Product;
}

interface HubLandmark {
  name: string;
  type: 'hub' | 'locker' | 'transit' | 'verification';
  x: number;
  y: number;
  distance: number;
}

export const InteractiveMap = ({ product }: InteractiveMapProps) => {
  const [hoveredHub, setHoveredHub] = useState<HubLandmark | null>(null);

  // Generate hubs dynamically around the product collection point
  const hubs: HubLandmark[] = [
    {
      name: `${product.city} Central Verification Desk`,
      type: 'verification',
      x: 180,
      y: 120,
      distance: 0.5
    },
    {
      name: 'RentWise Smart Lockers',
      type: 'locker',
      x: 350,
      y: 90,
      distance: 1.2
    },
    {
      name: 'Delhi/Mumbai Express Courier Point',
      type: 'transit',
      x: 130,
      y: 220,
      distance: 0.8
    },
    {
      name: 'Local Collection Hub',
      type: 'hub',
      x: 290,
      y: 240,
      distance: 0.3
    }
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case 'verification': return '#10b981';
      case 'locker': return '#3b82f6';
      case 'transit': return '#ea580c';
      case 'hub': return '#a855f7';
      default: return 'var(--primary)';
    }
  };

  const getHubIcon = (type: string, size = 16) => {
    switch (type) {
      case 'verification': return <Award size={size} />;
      case 'locker': return <Package size={size} />;
      case 'transit': return <Truck size={size} />;
      case 'hub': return <MapPin size={size} />;
      default: return <Compass size={size} />;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Compass size={20} color="var(--primary)" /> Pickup & Hub Map
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Interactive pickup lockboxes and verify centers</span>
        </div>

        {/* Safety/Trust Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: product.trustScore >= 80 ? 'var(--success-light)' : 'var(--warning-light)',
          padding: '0.4rem 0.8rem',
          borderRadius: '10px',
          border: `1px solid ${product.trustScore >= 80 ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 191, 36, 0.2)'}`
        }}>
          <Shield size={16} color={product.trustScore >= 80 ? 'var(--success)' : 'var(--warning)'} />
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Trust Rating: {product.trustScore}%
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              Verification Cleared
            </div>
          </div>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '300px',
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid var(--glass-border)',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <svg width="100%" height="100%" viewBox="0 0 500 300" style={{ pointerEvents: 'auto' }}>
          {/* Park Area */}
          <rect x="20" y="20" width="100" height="80" rx="12" fill="rgba(16, 185, 129, 0.07)" />
          <text x="35" y="65" fill="rgba(16, 185, 129, 0.4)" fontSize="10" fontWeight="bold">LOCKER PARK</text>

          {/* Streets Drawing */}
          <line x1="250" y1="0" x2="250" y2="300" stroke="var(--glass-border)" strokeWidth="18" strokeLinecap="square" />
          <line x1="250" y1="0" x2="250" y2="300" stroke="var(--bg-primary)" strokeWidth="1" strokeDasharray="6,6" />
          
          <line x1="0" y1="180" x2="500" y2="180" stroke="var(--glass-border)" strokeWidth="14" strokeLinecap="square" />
          <line x1="0" y1="180" x2="500" y2="180" stroke="var(--bg-primary)" strokeWidth="1" strokeDasharray="6,6" />

          <line x1="0" y1="80" x2="500" y2="80" stroke="var(--glass-border)" strokeWidth="10" strokeLinecap="square" />
          <line x1="130" y1="80" x2="130" y2="180" stroke="var(--glass-border)" strokeWidth="10" strokeLinecap="square" />
          <line x1="380" y1="180" x2="380" y2="300" stroke="var(--glass-border)" strokeWidth="10" strokeLinecap="square" />

          {/* Hub Dots */}
          {hubs.map((hub, idx) => {
            const isHovered = hoveredHub?.name === hub.name;
            return (
              <g 
                key={idx}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredHub(hub)}
                onMouseLeave={() => setHoveredHub(null)}
              >
                <circle 
                  cx={hub.x} 
                  cy={hub.y} 
                  r={isHovered ? 16 : 12} 
                  fill={getIconColor(hub.type)} 
                  fillOpacity="0.15"
                  style={{ transition: 'all 0.2s ease' }}
                />
                <circle 
                  cx={hub.x} 
                  cy={hub.y} 
                  r={isHovered ? 10 : 8} 
                  fill={getIconColor(hub.type)} 
                  style={{ transition: 'all 0.2s ease' }}
                />
                <foreignObject 
                  x={hub.x - 7} 
                  y={hub.y - 7} 
                  width="14" 
                  height="14" 
                  style={{ color: '#fff', pointerEvents: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getHubIcon(hub.type, 11)}
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Pulsing Product Location Pin */}
          <g>
            <circle cx="250" cy="180" r="22" fill="var(--primary)" fillOpacity="0.15">
              <animate attributeName="r" values="16;25;16" dur="2s" repeatCount="indefinite" />
              <animate attributeName="fill-opacity" values="0.25;0.05;0.25" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="250" cy="180" r="10" fill="var(--primary)" stroke="#ffffff" strokeWidth="2" />
          </g>
        </svg>

        {/* Hover Tooltip */}
        {hoveredHub && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--primary)',
            padding: '0.4rem 0.8rem',
            borderRadius: '8px',
            boxShadow: 'var(--modal-shadow)',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-primary)',
            zIndex: 10
          }}>
            <span style={{ color: getIconColor(hoveredHub.type) }}>
              {getHubIcon(hoveredHub.type, 14)}
            </span>
            <strong>{hoveredHub.name}</strong> 
            <span style={{ color: 'var(--text-muted)' }}>({hoveredHub.distance} km)</span>
          </div>
        )}

        {/* Legend */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '0.5rem',
          fontSize: '0.65rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          pointerEvents: 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></span> Product Point
          </div>
          {hubs.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: getIconColor(h.type) }}></span> 
              <span style={{ textTransform: 'capitalize' }}>{h.type}</span> ({h.distance} km)
            </div>
          ))}
        </div>
      </div>

      {/* AI Pick-up analysis */}
      <div className="glass-panel" style={{
        background: 'var(--bg-tertiary)',
        border: 'none',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        fontSize: '0.85rem'
      }}>
        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>
          <Eye size={15} color="var(--primary)" />
          AI Pickup Insights
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.4 }}>
          This product is verified at <strong>{product.city}</strong> collection hub. Verification checks confirm it has passed serial checks and is ready in express lockboxes. Courier dispatch is available within {hubs[2].distance} km.
        </p>
      </div>
    </div>
  );
};
export default InteractiveMap;
