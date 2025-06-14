import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const AIDoctorContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IFrameContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 800px;
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LoadingMessage = styled.div`
  font-size: 1.5rem;
  color: #4B5563;
  text-align: center;
  margin-top: 2rem;
`;

const AIDoctor = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the AI doctor server is running
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:7862');
        if (response.ok) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('AI Doctor server not running:', error);
        // You might want to show an error message to the user here
      }
    };

    checkServer();
  }, []);

  return (
    <AIDoctorContainer>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#111827' }}>
        AI Doctor Consultation
      </h1>
      
      {isLoading ? (
        <LoadingMessage>
          Loading AI Doctor interface...
        </LoadingMessage>
      ) : (
        <IFrameContainer>
          <iframe
            src="http://localhost:7862"
            title="AI Doctor Interface"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
          />
        </IFrameContainer>
      )}
    </AIDoctorContainer>
  );
};

export default AIDoctor; 