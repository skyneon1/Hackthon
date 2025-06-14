import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const FeaturesContainer = styled.div`
  padding: 5rem 2rem;
  background: #f8f9fa;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #1a1a1a;
`;

const FeaturesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: #4facfe;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
  font-size: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1a1a1a;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const features = [
  {
    title: 'Health Q&A',
    description: 'Get accurate, reassuring answers to your health questions—without the fear or confusion of endless online searches.',
    icon: '💬'
  },
  {
    title: 'Lab Report Analysis',
    description: 'Decode your lab results and prescriptions for actionable, easy-to-understand insights.',
    icon: '📊'
  },
  {
    title: 'Mental Health Support',
    description: 'Empathetic support to guide you through stress, anxiety, and emotional challenges.',
    icon: '🧠'
  },
  {
    title: 'Meal & Fitness Plans',
    description: 'Customized nutrition and fitness strategies to help you achieve your health goals.',
    icon: '🥗'
  },
  {
    title: 'Visual Symptom Checker',
    description: 'Analyze symptoms visually for faster, more accurate health assessments and relief.',
    icon: '👁️'
  },
  {
    title: 'Nutritional Insights',
    description: 'Analyze your meals with precision to make smarter dietary decisions effortlessly.',
    icon: '🍎'
  }
];

const Features = () => {
  return (
    <FeaturesContainer>
      <SectionTitle>Specialized Features at Your Fingertips</SectionTitle>
      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>
    </FeaturesContainer>
  );
};

export default Features; 