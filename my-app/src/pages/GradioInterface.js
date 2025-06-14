import React from 'react';
import { Box, Container } from '@chakra-ui/react';

const GradioInterface = () => {
  return (
    <Container maxW="100%" p={0}>
      <Box 
        as="iframe"
        src="http://127.0.0.1:7860"
        width="100%"
        height="100vh"
        border="none"
      />
    </Container>
  );
};

export default GradioInterface; 