'use client';

import { useState, useEffect, useRef } from 'react';
import { mockProducts, type Product } from '../data/mockProducts';
import { MessageSquare, X, Send, Sparkles, ArrowRight } from 'lucide-react';

interface AiChatboxProps {
  onSelectProduct: (product: Product) => void;
  setCurrentTab: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  links?: { title: string, product: Product }[];
}

export const AiChatbox = ({ onSelectProduct, setCurrentTab }: AiChatboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Namaste! I am your RentWise AI Assistant. Ask me to find cameras, tents, cycles, or other products under your budget, or explain product verification and rental agreements!'
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollChat = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollChat();
  }, [messages, typing]);

  const quickPrompts = [
    'Find items under ₹500/day',
    'How do you verify camera invoices?',
    'What happens if I damage a product?',
    'Explain Renter Trust Score'
  ];

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      setTyping(false);
      const query = textToSend.toLowerCase();
      let botResponse = '';
      let productLinks: { title: string, product: Product }[] = [];

      if (query.includes('under') || query.includes('budget') || query.includes('cheap') || query.includes('₹') || query.includes('rupees') || query.includes('rs')) {
        const match = query.match(/\d+/);
        const limit = match ? parseInt(match[0]) : 500;
        
        const matchedList = mockProducts.filter(p => p.rentPerDay <= limit);
        if (matchedList.length > 0) {
          botResponse = `I located ${matchedList.length} items matching your rental budget of under ₹${limit} per day:`;
          productLinks = matchedList.map(p => ({ title: `${p.title} (₹${p.rentPerDay}/day)`, product: p }));
        } else {
          botResponse = `I couldn't locate any products under ₹${limit}/day in our current inventory. Try widening your price filter range.`;
        }
      } else if (query.includes('camera') || query.includes('dslr') || query.includes('lens') || query.includes('drone') || query.includes('sony')) {
        const matchedList = mockProducts.filter(p => p.category === 'Electronics' || p.title.toLowerCase().includes('camera') || p.title.toLowerCase().includes('drone'));
        botResponse = 'Here are our verified electronics, DSLR cameras, and drones ready for pick-up:';
        productLinks = matchedList.map(p => ({ title: `${p.title} (₹${p.rentPerDay}/day)`, product: p }));
      } else if (query.includes('invoice') || query.includes('verify') || query.includes('scam') || query.includes('serial')) {
        botResponse = 'Our AI Product Fraud Shield verifies owners via Aadhaar/PAN checks, scans serial numbers against global manufacturer databases to ensure they are not stolen, and validates original purchase invoices. High-risk items are flagged immediately.';
      } else if (query.includes('damage') || query.includes('break') || query.includes('repair') || query.includes('agreement')) {
        botResponse = 'Under our standard RentWise Rental Agreement: 1) Normal wear and tear is fully covered, 2) Accidental structural damages should be reported via the dashboard with pictures within 24 hours, and 3) Security deposits are held securely in a Razorpay escrow account and returned immediately upon damage-free return check.';
      } else if (query.includes('trust') || query.includes('score') || query.includes('eligibility')) {
        botResponse = 'The AI Renter Trust Score (0-100) measures your profile verification depth (Aadhaar/PAN verification adds +45, bank linkage adds +25) and your history of on-time returns. A high score decreases your required security deposit amounts!';
      } else {
        const matching = mockProducts.filter(p => query.split(' ').some(word => word.length > 3 && p.title.toLowerCase().includes(word)));
        if (matching.length > 0) {
          botResponse = 'I located matching items from our verified lenders:';
          productLinks = matching.map(p => ({ title: p.title, product: p }));
        } else {
          botResponse = "I can guide you on product rentals. Try asking for 'cameras under 2000' or 'how invoice verification works'!";
        }
      }

      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        sender: 'bot',
        text: botResponse,
        links: productLinks.length > 0 ? productLinks : undefined
      }]);
    }, 1000);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 900 }}>
      {/* Floating Chat Trigger button */}
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn-primary animate-float"
          style={{
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)'
          }}
        >
          <MessageSquare size={26} />
        </button>
      ) : (
        /* Chat Window */
        <div 
          className="glass-panel animate-slide-in"
          style={{
            background: 'var(--bg-secondary)',
            width: '360px',
            height: '480px',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--modal-shadow)',
            border: '1px solid var(--primary)',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            padding: '1rem',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={18} />
              <div>
                <strong style={{ fontSize: '0.9rem', display: 'block' }}>RentWise AI Assistant</strong>
                <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>Online • Shield Protection Active</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {messages.map(m => (
              <div 
                key={m.id}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem'
                }}
              >
                <div style={{
                  background: m.sender === 'user' ? 'var(--primary)' : 'var(--bg-tertiary)',
                  color: m.sender === 'user' ? '#fff' : 'var(--text-primary)',
                  padding: '0.6rem 0.8rem',
                  borderRadius: m.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  fontSize: '0.82rem',
                  lineHeight: 1.4
                }}>
                  {m.text}
                </div>

                {/* Optional Links */}
                {m.links && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.2rem' }}>
                    {m.links.map((link, lIdx) => (
                      <div 
                        key={lIdx}
                        onClick={() => {
                          onSelectProduct(link.product);
                          setCurrentTab('home');
                        }}
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--glass-border)',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          color: 'var(--primary)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                        }}
                      >
                        <span>{link.title}</span>
                        <ArrowRight size={12} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {typing && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--bg-tertiary)', padding: '0.5rem 0.8rem', borderRadius: '10px', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'float 1s infinite' }}></span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'float 1s infinite 0.2s' }}></span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'float 1s infinite 0.4s' }}></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Questions chips */}
          <div style={{
            padding: '0.5rem 0.75rem',
            borderTop: '1px solid var(--glass-border)',
            background: 'var(--bg-tertiary)',
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Footer Input form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            style={{
              padding: '0.75rem',
              display: 'flex',
              gap: '0.5rem',
              borderTop: '1px solid var(--glass-border)'
            }}
          >
            <input 
              type="text" 
              className="glass-input" 
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem' }}
              placeholder="Ask about cameras, UPI, damage policies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ padding: '0.5rem', borderRadius: '8px', boxShadow: 'none' }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default AiChatbox;
