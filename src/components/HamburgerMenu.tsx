import React, { useState, useEffect, useRef } from 'react';
import TouchOptimizedButton from './TouchOptimizedButton';

interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: string;
  badge?: string;
}

interface HamburgerMenuProps {
  items: NavigationItem[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  position?: 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  items,
  isOpen,
  onToggle,
  onClose,
  position = 'left',
  className = '',
  style = {}
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Handle menu toggle animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Handle item click
  const handleItemClick = (item: NavigationItem) => {
    if (item.onClick) {
      item.onClick();
    }
    onClose();
  };
  
  // Get menu styles
  const getMenuStyles = (): React.CSSProperties => ({
    position: 'fixed',
    top: 0,
    [position]: 0,
    width: '280px',
    height: '100vh',
    backgroundColor: '#E8E3DA', // Light beige background to match theme
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    zIndex: 1002, // High z-index to ensure visibility on mobile
    transform: isOpen 
      ? 'translateX(0)' 
      : `translateX(${position === 'left' ? '-100%' : '100%'})`,
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    visibility: isOpen ? 'visible' : 'hidden', // Ensure proper visibility on mobile
    display: 'flex',
    flexDirection: 'column',
    ...style
  });
  
  // Get overlay styles
  const getOverlayStyles = (): React.CSSProperties => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    zIndex: 1001, // Above menu but below button
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transition: 'all 0.3s ease',
    pointerEvents: isOpen ? 'auto' : 'none' // Prevent blocking when closed
  });
  
  // Get hamburger button styles - Modern design
  const getButtonStyles = (): React.CSSProperties => ({
    position: 'fixed',
    top: '20px',
    left: '15px', // Moved closer to left edge
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    zIndex: 1003, // Higher than menu (1002) and TitleSection (1001) to ensure visibility
    display: isOpen ? 'none' : 'flex', // Hide button when menu is open to prevent overlap
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    gap: '6px', // Increased gap for better spacing
    pointerEvents: 'auto', // Ensure only direct touches work
    touchAction: 'manipulation' // Prevent double-tap zoom
  });
  
  // Get hamburger line styles - Modern design with rounded ends
  const getLineStyles = (lineNumber: number): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      height: '1px',
      backgroundColor: '#000000',
      borderRadius: '1px', // Rounded ends
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      // Don't transform when menu is open since button will be hidden
      transform: 'none'
    };

    // Progressive width design - each line shorter than the previous, all left-aligned
    if (!isOpen) {
      if (lineNumber === 1) {
        // Top line - longest
        baseStyles.width = '24px';
        baseStyles.alignSelf = 'flex-start';
      } else if (lineNumber === 2) {
        // Middle line - shorter than top
        baseStyles.width = '20px';
        baseStyles.alignSelf = 'flex-start';
      } else {
        // Bottom line - shortest
        baseStyles.width = '16px';
        baseStyles.alignSelf = 'flex-start';
      }
    } else {
      // When open, all lines have same width for animation
      baseStyles.width = '24px';
    }

    return baseStyles;
  };
  
  // Get menu header styles
  const getHeaderStyles = (): React.CSSProperties => ({
    padding: '20px',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  });
  
  // Get menu items styles
  const getItemsStyles = (): React.CSSProperties => ({
    flex: 1,
    padding: '20px 0',
    overflowY: 'auto'
  });
  
  // Get item styles
  const getItemStyles = (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    color: '#333333',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    borderLeft: '3px solid transparent'
  });
  
  return (
    <>
      {/* Overlay */}
      <div
        className="menu-overlay"
        style={getOverlayStyles()}
        onClick={onClose}
      />
      
       {/* Hamburger Button */}
       <TouchOptimizedButton
         onClick={onToggle}
         className="hamburger-button"
         style={getButtonStyles()}
         enableHapticFeedback={true}
         touchTargetSize={48}
         deadzoneSize={12}
       >
         <div style={getLineStyles(1)} />
         <div style={getLineStyles(2)} />
         <div style={getLineStyles(3)} />
       </TouchOptimizedButton>
      
      {/* Menu */}
      <div
        ref={menuRef}
        className={`hamburger-menu ${className}`}
        style={getMenuStyles()}
      >
        {/* Header */}
        <div style={getHeaderStyles()}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#333333' }}>
            Menu
          </h3>
          <TouchOptimizedButton
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#666666',
              padding: '0',
              boxSizing: 'border-box'
            }}
            enableHapticFeedback={true}
            touchTargetSize={32}
          >
            ×
          </TouchOptimizedButton>
        </div>
        
        {/* Menu Items */}
        <div style={getItemsStyles()}>
          {items.map((item, index) => (
            <div
              key={item.id}
              className="menu-item"
              style={{
                ...getItemStyles(),
                animationDelay: `${index * 50}ms`,
                ...(isAnimating && {
                  opacity: 0,
                  transform: 'translateX(-20px)',
                  animation: 'slideInFromLeft 0.3s ease forwards'
                })
              }}
              onClick={() => handleItemClick(item)}
            >
              <span style={{ flex: 1, fontSize: '16px', fontWeight: '500' }}>
                {item.label}
              </span>
              {item.badge && (
                <span style={{
                  backgroundColor: '#667eea',
                  color: '#ffffff',
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}
          
          {/* Social Links Section */}
          <div style={{
            padding: '20px',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            marginTop: 'auto'
          }}>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#666666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Follow Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href="https://www.instagram.com/ostrometfils"
                target="_blank"
                rel="noopener noreferrer"
                className="menu-item"
                style={{
                  ...getItemStyles(),
                  padding: '10px 20px',
                  textDecoration: 'none'
                }}
                onClick={() => onClose()}
              >
                <span style={{ flex: 1, fontSize: '16px', fontWeight: '500' }}>Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/ostrometfils"
                target="_blank"
                rel="noopener noreferrer"
                className="menu-item"
                style={{
                  ...getItemStyles(),
                  padding: '10px 20px',
                  textDecoration: 'none'
                }}
                onClick={() => onClose()}
              >
                <span style={{ flex: 1, fontSize: '16px', fontWeight: '500' }}>Facebook</span>
              </a>
              <a
                href="https://twitter.com/ostrometfils"
                target="_blank"
                rel="noopener noreferrer"
                className="menu-item"
                style={{
                  ...getItemStyles(),
                  padding: '10px 20px',
                  textDecoration: 'none'
                }}
                onClick={() => onClose()}
              >
                <span style={{ flex: 1, fontSize: '16px', fontWeight: '500' }}>Twitter</span>
              </a>
              <a
                href="https://www.linkedin.com/company/ostrometfils"
                target="_blank"
                rel="noopener noreferrer"
                className="menu-item"
                style={{
                  ...getItemStyles(),
                  padding: '10px 20px',
                  textDecoration: 'none'
                }}
                onClick={() => onClose()}
              >
                <span style={{ flex: 1, fontSize: '16px', fontWeight: '500' }}>LinkedIn</span>
              </a>
            </div>
          </div>
          
          {/* Email Section */}
          <div style={{
            padding: '20px',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)'
          }}>
            <h4 style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#666666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Contact
            </h4>
            <a
              href="mailto:contact@ostrometfils.com"
              className="menu-item"
              style={{
                ...getItemStyles(),
                padding: '10px 20px',
                textDecoration: 'none'
              }}
              onClick={() => onClose()}
            >
              <span style={{ flex: 1, fontSize: '14px', fontWeight: '500', color: '#000000' }}>contact@ostrometfils.com</span>
            </a>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
          fontSize: '12px',
          color: '#999999',
          textAlign: 'center'
        }}>
          © {new Date().getFullYear()} Ostrom et Fils
        </div>
      </div>
      
       {/* Enhanced styles */}
       <style>{`
        .menu-item:hover {
          background-color: rgba(0, 0, 0, 0.05) !important;
          border-left-color: #000000 !important;
          transform: translateX(4px);
        }
        
        .hamburger-button {
          isolation: isolate; /* Create new stacking context */
          touch-action: manipulation; /* Prevent double-tap zoom */
          -webkit-touch-callout: none; /* Disable iOS callout */
          -webkit-user-select: none; /* Disable text selection */
          user-select: none;
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        .hamburger-button:focus,
        .hamburger-button:active {
          background-color: transparent !important;
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
          transform: none !important;
        }
        
        .hamburger-button:hover {
          background-color: transparent !important;
          transform: none;
        }
        
        .hamburger-button:hover > div {
          background-color: #000000 !important;
        }
        
        @keyframes slideInFromLeft {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          .hamburger-menu {
            width: 85vw !important;
            max-width: 320px !important;
            z-index: 1002 !important;
            visibility: visible !important;
          }
          
          .menu-overlay {
            z-index: 1001 !important;
          }
          
          .hamburger-button {
            top: 7px !important;
            left: -4px !important; /* Moved closer to left edge on mobile */
            width: 36px !important;
            height: 36px !important;
            gap: 4px !important; /* Slightly smaller gap on mobile */
          }
          
          /* Ensure button is hidden when menu is open on mobile */
          .hamburger-menu[style*="transform: translateX(0)"] ~ .hamburger-button,
          .hamburger-menu:not([style*="transform: translateX(-100%)"]) ~ .hamburger-button {
            display: none !important;
          }
          
          .hamburger-button > div {
            height: 1px !important; /* Thinner on mobile */
          }
        }
        
        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .hamburger-menu,
          .menu-overlay,
          .hamburger-button,
          .menu-item {
            transition: none !important;
            animation: none !important;
          }
        }
        
        /* High contrast mode */
        @media (prefers-contrast: high) {
          .hamburger-menu {
            background-color: #ffffff !important;
            border: 2px solid #000000 !important;
          }
          
          .hamburger-button {
            background-color: #ffffff !important;
            border: 2px solid #000000 !important;
          }
          
          .menu-item {
            border-bottom: 1px solid #000000;
          }
        }
      `}</style>
    </>
  );
};

export default HamburgerMenu;
