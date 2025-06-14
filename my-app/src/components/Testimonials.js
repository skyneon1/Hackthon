import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const TestimonialsContainer = styled.div`
  padding: 5rem 2rem;
  background: white;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #1a1a1a;
`;

const TestimonialsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const TestimonialCard = styled(motion.div)`
  background: #f8f9fa;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #4facfe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  margin-right: 1rem;
`;

const UserName = styled.h4`
  font-size: 1.2rem;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
`;

const UserAge = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const TestimonialText = styled.p`
  color: #666;
  line-height: 1.6;
  font-style: italic;
`;

const testimonials = [
  {
    name: 'Aditi Verma',
    age: 29,
    text: 'As someone living in a rural area, Medo AI\'s instant medical guidance has been invaluable. It\'s like having a doctor on call.',
    avatar: 'AV'
  },
  {
    name: 'Sophia Miller',
    age: 22,
    text: 'Medo AI helped me understand my blood work results at 2 AM when I was anxious. Saved me an unnecessary ER visit!',
    avatar: 'SM'
  },
  {
    name: 'Emily Johnson',
    age: 31,
    text: 'I was skeptical at first, but Medo AI accurately flagged concerning symptoms that led to an early diagnosis. Truly grateful.',
    avatar: 'EJ'
  }
];

const Testimonials = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  return (
    <TestimonialsContainer>
      <SectionTitle>Trusted by Over 1.6 Mn+ Families Worldwide</SectionTitle>
      <TestimonialsGrid>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            onClick={() => setSelectedTestimonial(index)}
            animate={{
              scale: selectedTestimonial === index ? 1.05 : 1,
              backgroundColor: selectedTestimonial === index ? '#f0f7ff' : '#f8f9fa'
            }}
          >
            <UserInfo>
              <Avatar>{testimonial.avatar}</Avatar>
              <div>
                <UserName>{testimonial.name}</UserName>
                <UserAge>{testimonial.age} years</UserAge>
              </div>
            </UserInfo>
            <TestimonialText>{testimonial.text}</TestimonialText>
          </TestimonialCard>
        ))}
      </TestimonialsGrid>
    </TestimonialsContainer>
  );
};

export default Testimonials; 