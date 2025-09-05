import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Assessment = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Career Assessment
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page will provide comprehensive assessments including personality, skills, interests, and aptitude tests.
      </Typography>
    </Container>
  );
};

export default Assessment;
