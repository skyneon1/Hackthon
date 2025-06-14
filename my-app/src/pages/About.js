import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const AboutContainer = styled.div`
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  color: #1a1a1a;
  margin-bottom: 3rem;
  text-align: center;
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Section = styled(motion.section)`
  margin-bottom: 4rem;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    width: 32px;
    height: 32px;
    color: #4facfe;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TextContent = styled.div`
  p {
    color: #666;
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  img {
    width: 100%;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const TeamMember = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }

  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 1rem;
    object-fit: cover;
  }

  h3 {
    color: #1a1a1a;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    margin-bottom: 0.5rem;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const StatItem = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 2.5rem;
    color: #4facfe;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

const Timeline = styled.div`
  position: relative;
  padding: 2rem 0;
  margin-top: 2rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: #4facfe;
  }
`;

const TimelineItem = styled(motion.div)`
  position: relative;
  margin-bottom: 2rem;
  width: 50%;
  padding: 1.5rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  &:nth-child(odd) {
    margin-left: auto;
    text-align: right;
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    right: ${props => props.isEven ? 'auto' : '-10px'};
    left: ${props => props.isEven ? '-10px' : 'auto'};
    width: 20px;
    height: 20px;
    background: #4facfe;
    border-radius: 50%;
    transform: translateY(-50%);
  }

  h3 {
    color: #1a1a1a;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    margin-bottom: 0.5rem;
  }

  span {
    color: #4facfe;
    font-weight: 500;
  }
`;

const CarouselSection = styled(motion.section)`
  margin: 4rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
`;

const CarouselContainer = styled.div`
  position: relative;
  height: 400px;
  perspective: 1000px;
`;

const CarouselSlide = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const CarouselContent = styled.div`
  text-align: center;
  color: white;
  max-width: 600px;
  
  h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
`;

const CarouselControls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
`;

const CarouselDot = styled(motion.div)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureItem = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #4facfe, #00f2fe);
  }
  
  h3 {
    color: #1a1a1a;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    
    svg {
      width: 24px;
      height: 24px;
      color: #4facfe;
    }
  }
  
  p {
    color: #666;
    line-height: 1.6;
  }
`;

const InteractiveGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(6, 100px);
  gap: 20px;
  margin: 4rem 0;
  perspective: 1000px;
`;

const GridItem = styled(motion.div)`
  background: ${props => props.background || 'white'};
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 254, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #1a1a1a;
    position: relative;
    z-index: 1;
  }
  
  p {
    color: #666;
    text-align: center;
    position: relative;
    z-index: 1;
  }
`;

const FeatureHighlight = styled(motion.div)`
  grid-column: span 4;
  grid-row: span 2;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  
  h3 {
    color: white;
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.2rem;
  }
`;

const StatsCard = styled(motion.div)`
  grid-column: span 3;
  grid-row: span 2;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  h2 {
    font-size: 3rem;
    color: #4facfe;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

const InteractiveCard = styled(motion.div)`
  grid-column: span 4;
  grid-row: span 2;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
  
  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
    color: #4facfe;
  }
`;

const ParallaxSection = styled(motion.section)`
  height: 400px;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=400&fit=crop') center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4rem 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(79, 172, 254, 0.3), rgba(0, 242, 254, 0.3));
    animation: gradientShift 10s ease infinite;
  }
  
  @keyframes gradientShift {
    0% { opacity: 0.3; }
    50% { opacity: 0.6; }
    100% { opacity: 0.3; }
  }
`;

const ParallaxContent = styled.div`
  text-align: center;
  color: white;
  z-index: 1;
  
  h2 {
    font-size: 3rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  p {
    font-size: 1.5rem;
    max-width: 800px;
    margin: 0 auto;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }
`;

const carouselItems = [
  {
    title: 'AI-Powered Health Insights',
    content: 'Our advanced AI algorithms analyze your health data to provide personalized recommendations and insights.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
  },
  {
    title: '24/7 Health Support',
    content: 'Access reliable health information and support anytime, anywhere through our AI-powered platform.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 8v4l3 3"/></svg>
  },
  {
    title: 'Personalized Care Plans',
    content: 'Get customized health plans tailored to your specific needs and goals.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  }
];

const features = [
  {
    title: 'Advanced AI Technology',
    description: 'Our platform uses cutting-edge AI to provide accurate health insights and recommendations.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
  },
  {
    title: 'Secure Data Protection',
    description: 'Your health data is protected with industry-leading security measures and encryption.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 8v4l3 3"/></svg>
  },
  {
    title: 'User-Friendly Interface',
    description: 'Our intuitive design makes it easy to access and understand your health information.',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  }
];

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Medical Officer',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&h=500&fit=crop&q=80',
      bio: 'Board-certified physician with 15+ years of experience in healthcare technology.'
    },
    {
      name: 'Michael Chen',
      role: 'AI Research Lead',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&fit=crop&q=80',
      bio: 'PhD in Machine Learning, specializing in healthcare applications.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'User Experience Director',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop&q=80',
      bio: 'Healthcare UX expert with a focus on accessibility and patient engagement.'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Foundation',
      description: 'Medo AI was founded with a vision to revolutionize healthcare accessibility.',
      isEven: true,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop'
    },
    {
      year: '2021',
      title: 'First Release',
      description: 'Launched our initial AI health assistant with basic symptom checking capabilities.',
      isEven: false,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop'
    },
    {
      year: '2022',
      title: 'Partnerships',
      description: 'Established partnerships with major healthcare providers and research institutions.',
      isEven: true,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop'
    },
    {
      year: '2023',
      title: 'Expansion',
      description: 'Expanded our services to include personalized health recommendations and chronic condition management.',
      isEven: false,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop'
    }
  ];

  return (
    <AboutContainer>
      <Title
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        About Medo AI
      </Title>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <SectionTitle>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="M12 8v4l3 3"/>
          </svg>
          Our Mission
        </SectionTitle>
        <Content>
          <TextContent>
            <p>
              Medo AI is your personal health assistant, designed to provide accurate and reliable health information
              whenever you need it. Our platform combines advanced AI technology with medical expertise to help you
              make informed decisions about your health.
            </p>
            <p>
              Founded by a team of expert physicians and technology leaders, Medo AI is committed to making
              healthcare more accessible and understandable for everyone. We believe that everyone deserves access
              to reliable health information, 24/7.
            </p>
            <p>
              Our mission is to simplify healthcare by providing instant, accurate, and personalized health guidance
              through our AI-powered platform. Whether you need help understanding medical reports, managing chronic
              conditions, or making lifestyle changes, Medo AI is here to support you.
            </p>
          </TextContent>
          <ImageContainer>
            <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop" alt="Healthcare Technology" />
          </ImageContainer>
        </Content>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <SectionTitle>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Our Team
        </SectionTitle>
        <TeamGrid>
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img src={member.image} alt={member.name} />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <p>{member.bio}</p>
            </TeamMember>
          ))}
        </TeamGrid>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <SectionTitle>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <path d="M12 8v4l3 3"/>
          </svg>
          Our Impact
        </SectionTitle>
        <StatsContainer>
          <StatItem
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3>1.5M+</h3>
            <p>Users Helped</p>
          </StatItem>
          <StatItem
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3>98%</h3>
            <p>Accuracy Rate</p>
          </StatItem>
          <StatItem
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3>24/7</h3>
            <p>Availability</p>
          </StatItem>
          <StatItem
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3>50+</h3>
            <p>Health Topics</p>
          </StatItem>
        </StatsContainer>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <SectionTitle>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          Our Journey
        </SectionTitle>
        <Timeline>
          {milestones.map((milestone, index) => (
            <TimelineItem
              key={index}
              isEven={milestone.isEven}
              initial={{ opacity: 0, x: milestone.isEven ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img src={milestone.image} alt={milestone.title} style={{ width: '100%', borderRadius: '10px', marginBottom: '1rem' }} />
              <span>{milestone.year}</span>
              <h3>{milestone.title}</h3>
              <p>{milestone.description}</p>
            </TimelineItem>
          ))}
        </Timeline>
      </Section>

      <CarouselSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <CarouselContainer>
          <AnimatePresence mode="wait">
            <CarouselSlide
              key={currentSlide}
              initial={{ opacity: 0, x: 100, rotateY: 90 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -100, rotateY: -90 }}
              transition={{ duration: 0.5 }}
            >
              <CarouselContent>
                <h2>{carouselItems[currentSlide].title}</h2>
                <p>{carouselItems[currentSlide].content}</p>
              </CarouselContent>
            </CarouselSlide>
          </AnimatePresence>
          <CarouselControls>
            {carouselItems.map((_, index) => (
              <CarouselDot
                key={index}
                active={index === currentSlide}
                onClick={() => setCurrentSlide(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </CarouselControls>
        </CarouselContainer>
      </CarouselSection>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <SectionTitle>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          Key Features
        </SectionTitle>
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)' }}
            >
              <h3>
                {feature.icon}
                {feature.title}
              </h3>
              <p>{feature.description}</p>
            </FeatureItem>
          ))}
        </FeatureGrid>
      </Section>
    </AboutContainer>
  );
};

export default About; 