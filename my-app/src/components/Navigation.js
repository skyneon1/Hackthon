import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { Link, useLocation } from 'react-router-dom';

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #4facfe;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  img {
    width: 40px;
    height: 40px;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
    }
  }

  span {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const NavLink = styled(motion(Link))`
  color: ${props => props.isActive ? '#4facfe' : '#1a1a1a'};
  text-decoration: none;
  font-weight: 500;
  position: relative;
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.isActive ? '100%' : '0'};
    height: 2px;
    background: #4facfe;
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CTAButton = styled(motion(Link))`
  padding: 0.5rem 1.5rem;
  background: #4facfe;
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #3a8fd9;
    transform: scale(1.05);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const MenuButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #1a1a1a;

  @media (max-width: 768px) {
    display: block;
  }
`;

const navItems = [
  { 
    label: 'Home', 
    path: '/',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
  },
  { 
    label: 'About', 
    path: '/about',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  },
  { 
    label: 'Health Library', 
    path: '/health-library',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  },
  { 
    label: 'Blog', 
    path: '/blog',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
  },
  { 
    label: 'Tools', 
    path: '/tools',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  },
  { 
    label: 'FAQ', 
    path: '/faq',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
  }
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <NavContainer>
      <NavContent>
        <Logo
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          as={Link}
          to="/"
        >
          <img src="/logo.svg" alt="Medo AI Logo" />
          <span>Medo AI</span>
        </Logo>
        
        <MenuButton 
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? '✕' : '☰'}
        </MenuButton>

        <AnimatePresence>
          <NavLinks isOpen={isOpen}>
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                isActive={location.pathname === item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
            <CTAButton
              to="/chat"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Talk to Medo
            </CTAButton>
          </NavLinks>
        </AnimatePresence>
      </NavContent>
    </NavContainer>
  );
};

export default Navigation; 