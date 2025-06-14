import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const FooterContainer = styled.footer`
  background: #1a1a1a;
  color: white;
  padding: 4rem 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: #4facfe;
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled(motion.li)`
  margin-bottom: 0.75rem;
  
  a {
    color: #a0a0a0;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: white;
    }
  }
`;

const ContactInfo = styled.div`
  p {
    color: #a0a0a0;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SocialLink = styled(motion.a)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2d2d2d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: #4facfe;
    transform: scale(1.1);
  }
`;

const BottomBar = styled.div`
  max-width: 1200px;
  margin: 3rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid #2d2d2d;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Copyright = styled.p`
  color: #a0a0a0;
  font-size: 0.9rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 1rem;
  
  a {
    color: #a0a0a0;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.3s ease;
    
    &:hover {
      color: white;
    }
  }
`;

const Footer = () => {
  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Health Library', href: '/health-library' },
        { label: 'Blog', href: '/blog' },
        { label: 'Tools', href: '/tools' },
        { label: 'FAQ', href: '/faq' }
      ]
    },
    {
      title: 'Services',
      links: [
        { label: 'Health Q&A', href: '#health-qa' },
        { label: 'Lab Report Analysis', href: '#lab-analysis' },
        { label: 'Mental Health Support', href: '#mental-health' },
        { label: 'Meal & Fitness Plans', href: '#fitness' },
        { label: 'Visual Symptom Checker', href: '#symptom-checker' }
      ]
    },
    {
      title: 'Contact Us',
      content: (
        <ContactInfo>
          <p>📍 506/507, 1st Main Rd, Murugeshpalya, K R Garden, Bengaluru, Karnataka 560075</p>
          <p>📞 +(91) 74831 27040</p>
          <p>✉️ support@medoai.com</p>
          <SocialLinks>
            <SocialLink href="#" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>f</SocialLink>
            <SocialLink href="#" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>t</SocialLink>
            <SocialLink href="#" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>in</SocialLink>
          </SocialLinks>
        </ContactInfo>
      )
    }
  ];

  return (
    <FooterContainer>
      <FooterContent>
        {footerSections.map((section, index) => (
          <FooterSection key={index}>
            <h3>{section.title}</h3>
            {section.links ? (
              <FooterLinks>
                {section.links.map((link, linkIndex) => (
                  <FooterLink
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <a href={link.href}>{link.label}</a>
                  </FooterLink>
                ))}
              </FooterLinks>
            ) : (
              section.content
            )}
          </FooterSection>
        ))}
      </FooterContent>
      <BottomBar>
        <Copyright>© 2024 Medo AI. All rights reserved.</Copyright>
        <LegalLinks>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
        </LegalLinks>
      </BottomBar>
    </FooterContainer>
  );
};

export default Footer; 