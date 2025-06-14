import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: #f8fafc;
`;

const IframeContainer = styled(motion.div)`
  width: 100%;
  height: 90vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const FlaskIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const ScanAnalyzer = () => {
  return (
    <Container>
      <IframeContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FlaskIframe
          src="http://localhost:5000"
          title="Medical Document Scanner"
          allow="microphone; camera"
        />
      </IframeContainer>
    </Container>
  );
};

export default ScanAnalyzer; 