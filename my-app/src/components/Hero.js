import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HeroContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4rem 2rem;
  background: #ffffff;
  color: #111827;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2rem;
  z-index: 1;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const Logo = styled(motion.img)`
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 4px 6px rgba(79, 172, 254, 0.2));

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const Title = styled(motion.h1)`
  font-size: 5.5rem;
  font-weight: 800;
  color: #111827;
  line-height: 1.1;
  margin: 0;
  letter-spacing: -0.03em;
  
  span {
    display: block;
    background: linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: #4B5563;
  max-width: 800px;
  line-height: 1.6;
  margin: 0;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 3rem;
  margin: 2rem 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const StatItem = styled(motion.div)`
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  min-width: 200px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatNumber = styled.h3`
  font-size: 2.5rem;
  color: #4facfe;
  margin-bottom: 0.5rem;
  font-family: 'Poppins', sans-serif;
`;

const StatLabel = styled.p`
  color: #666;
  font-size: 1rem;
  font-weight: 500;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 3rem 0;
  width: 100%;
  max-width: 1000px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: left;
  transition: all 0.3s ease;
  border: 1px solid #E5E7EB;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  h3 {
    color: #111827;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  p {
    color: #4B5563;
    line-height: 1.6;
    margin: 0;
    font-size: 1.1rem;
  }
`;

const CTAButton = styled(motion.button)`
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  background: linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
  letter-spacing: -0.01em;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(59, 130, 246, 0.3);
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
  }
`;

const ChatButton = styled(motion.button)`
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  background: ${props => props.variant === 'docs' ? '#3B82F6' : '#10B981'};
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.01em;
  margin: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
    background: ${props => props.variant === 'docs' ? '#2563EB' : '#059669'};
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    padding: 0.8rem 2rem;
    font-size: 1rem;
  }
`;

const TestimonialsPreview = styled.div`
  margin: 4rem 0;
  width: 100%;
  max-width: 1000px;
`;

const TestimonialCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin: 1rem;
  position: relative;

  &::before {
    content: '"';
    position: absolute;
    top: 1rem;
    left: 1rem;
    font-size: 4rem;
    color: #4facfe;
    opacity: 0.2;
    font-family: serif;
  }
`;

const TestimonialText = styled.p`
  font-size: 1.1rem;
  color: #333;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4facfe;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const AuthorInfo = styled.div`
  h4 {
    margin: 0;
    color: #333;
    font-size: 1rem;
  }
  p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const DemoSection = styled.div`
  margin: 4rem 0;
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DemoVideo = styled.div`
  width: 100%;
  max-width: 800px;
  height: 450px;
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/demo-pattern.svg') repeat;
    opacity: 0.1;
  }
`;

const BenefitsSection = styled.div`
  margin: 4rem 0;
  width: 100%;
  max-width: 1000px;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const BenefitCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  svg {
    width: 48px;
    height: 48px;
    color: #4facfe;
    margin-bottom: 1rem;
  }

  h3 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
`;

const InteractiveSection = styled.div`
  margin: 4rem 0;
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SymptomChecker = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const SymptomInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4facfe;
  }
`;

const SymptomButton = styled(motion.button)`
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const HealthTipsCarousel = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const TipCard = styled(motion.div)`
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TipIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #4facfe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const TipContent = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
  }
`;

const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
  }
`;

const ChatbotWindow = styled(motion.div)`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #E5E7EB;
`;

const ChatbotHeader = styled.div`
  padding: 1rem;
  background: linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 20px;
    height: 20px;
  }

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }
`;

const ChatbotMessages = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #F3F4F6;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 3px;
  }
`;

const ChatbotMessage = styled.div`
  padding: 0.8rem 1rem;
  border-radius: 12px;
  max-width: 80%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  background: ${props => props.isUser ? 'linear-gradient(90deg, #3B82F6 0%, #10B981 100%)' : '#F3F4F6'};
  color: ${props => props.isUser ? 'white' : '#111827'};
  font-size: 0.9rem;
  line-height: 1.4;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ChatbotInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #E5E7EB;
  display: flex;
  gap: 0.5rem;

  input {
    flex: 1;
    padding: 0.8rem;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #3B82F6;
    }

    &:disabled {
      background: #F3F4F6;
      cursor: not-allowed;
    }
  }

  button {
    padding: 0.8rem 1.5rem;
    background: linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
    border: none;
    border-radius: 12px;
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
    }

    &:disabled {
      cursor: not-allowed;
      background: #9CA3AF;
    }
  }
`;

const ChatbotButton = styled(motion.button)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(59, 130, 246, 0.3);
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const CarouselSection = styled.div`
  margin: 3rem 0;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    margin: 2rem 0;
  }
`;

const CarouselContainer = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  gap: 2rem;
  padding: 1rem;
`;

const CarouselItem = styled(motion.div)`
  flex: 0 0 350px;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(45deg, #4facfe, #00f2fe);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);

    &::before {
      transform: scaleX(1);
    }
  }
`;

const CarouselImage = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 15px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const CarouselTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: 600;
  position: relative;
  padding-bottom: 0.5rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 2px;
    background: #4facfe;
  }
`;

const CarouselDescription = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const CarouselControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const CarouselButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #4facfe;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
    background: #4facfe;
    color: white;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const CarouselDots = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0 1rem;
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? '#4facfe' : '#e0e0e0'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  height: 90%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  z-index: 2;
  
  &:hover {
    color: #000;
  }
`;

const GradioIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 8px;
  margin-top: 10px;
`;

const Hero = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI health assistant. How can I help you today?", isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', { message: userMessage });
      
      setMessages(prev => [...prev, { 
        text: response.data.message?.content || response.data.message || 'No response received', 
        isUser: false 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error. Please try again.', 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const healthTips = [
    {
      icon: '💧',
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water daily for optimal health.'
    },
    {
      icon: '🏃',
      title: 'Regular Exercise',
      description: 'Aim for 30 minutes of moderate exercise most days of the week.'
    },
    {
      icon: '😴',
      title: 'Quality Sleep',
      description: 'Get 7-9 hours of sleep each night for better health.'
    }
  ];

  const testimonials = [
    {
      text: "Medo AI helped me understand my symptoms and provided accurate information that led to an early diagnosis. The 24/7 availability is a game-changer for healthcare access.",
      author: "Sarah Mitchell",
      role: "Healthcare Professional",
      avatar: "SM"
    }
  ];

  const handleStartChat = () => {
    navigate('/chat');
  };

  const handleChatWithImages = () => {
    navigate('/gradio-interface');
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIframeKey(prev => prev + 1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <HeroContainer>
      <ContentWrapper>
        <Logo
          src="/logo.svg"
          alt="Medo AI Logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Your Personal
          <span>AI Health Assistant</span>
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Get accurate information about health issues, big and small. Available 24/7.
        </Subtitle>
        
        <div style={{ 
          display: 'flex', 
          gap: '1.5rem', 
          marginTop: '2.5rem',
          marginBottom: '3rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <ChatButton
            variant="docs"
            onClick={() => navigate('/chat-docs')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ minWidth: '200px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Chat with Docs
          </ChatButton>
          
          <ChatButton
            onClick={handleOpenModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ minWidth: '200px' }}
            variant="images"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Chat with Images
          </ChatButton>
        </div>

        <FeaturesGrid>
          <FeatureCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3>Simplify Your Health Decisions</h3>
            <p>From report analysis to second opinions, we've got you covered.</p>
          </FeatureCard>
          <FeatureCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3>Your Health, Your Way</h3>
            <p>Chat via text, voice, or upload reports for support.</p>
          </FeatureCard>
          <FeatureCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3>24/7 Personalized Guidance</h3>
            <p>Get instant answers, anytime, anywhere.</p>
          </FeatureCard>
        </FeaturesGrid>
      </ContentWrapper>

      <ChatbotContainer>
        {isChatOpen && (
          <ChatbotWindow
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <ChatbotHeader>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <h3>Medo AI Assistant</h3>
            </ChatbotHeader>
            <ChatbotMessages>
              {messages.map((message, index) => (
                <ChatbotMessage key={index} isUser={message.isUser}>
                  {message.text}
                </ChatbotMessage>
              ))}
              {isLoading && (
                <ChatbotMessage isUser={false}>
                  Thinking...
                </ChatbotMessage>
              )}
            </ChatbotMessages>
            <ChatbotInput>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your health question..."
                disabled={isLoading}
              />
              <button onClick={handleSubmit} disabled={isLoading}>
                Send
              </button>
            </ChatbotInput>
          </ChatbotWindow>
        )}
        <ChatbotButton
          onClick={() => setIsChatOpen(!isChatOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </ChatbotButton>
      </ChatbotContainer>

      <Modal isOpen={isModalOpen} onClick={handleCloseModal}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <CloseButton onClick={handleCloseModal}>×</CloseButton>
          <GradioIframe 
            key={iframeKey}
            src="http://127.0.0.1:7860"
            title="AI Medical Assistant"
            allow="microphone; camera"
            onError={(e) => console.error('Iframe error:', e)}
          />
        </ModalContent>
      </Modal>
    </HeroContainer>
  );
};

export default Hero;
