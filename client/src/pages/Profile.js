import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Profile = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile Management
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page will allow users to manage their profile information, skills, interests, and career goals.
      </Typography>
    </Container>
  );
};

export default Profile;
