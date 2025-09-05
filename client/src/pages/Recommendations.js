import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Recommendations = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Career Recommendations
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page will display personalized career recommendations based on user assessments and preferences.
      </Typography>
    </Container>
  );
};

export default Recommendations;
