import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
} from '@mui/material';
import {
  School,
  Psychology,
  TrendingUp,
  Support,
  AutoGraph,
  Assessment,
} from '@mui/icons-material';

const About = () => {
  const team = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Lead AI Researcher',
      expertise: 'Machine Learning, Career Psychology',
      avatar: 'PS',
    },
    {
      name: 'Rajesh Kumar',
      role: 'Product Manager',
      expertise: 'EdTech, User Experience',
      avatar: 'RK',
    },
    {
      name: 'Anita Patel',
      role: 'Career Counselor',
      expertise: 'Indian Job Market, Student Guidance',
      avatar: 'AP',
    },
  ];

  const values = [
    {
      icon: <School sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Accessibility',
      description: 'Making quality career guidance accessible to every Indian student, regardless of their background or location.',
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Personalization',
      description: 'Using advanced AI to provide truly personalized recommendations based on individual strengths and aspirations.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Innovation',
      description: 'Continuously evolving with the latest technology and job market trends to stay ahead of the curve.',
    },
    {
      icon: <Support sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Support',
      description: 'Providing ongoing support and guidance throughout the entire career development journey.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          About Career Advisor
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
          We're revolutionizing career guidance for Indian students through 
          AI-powered personalized assessments and recommendations.
        </Typography>
      </Box>

      {/* Mission Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Our Mission
        </Typography>
        <Card sx={{ p: 4 }}>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, textAlign: 'center' }}>
            To empower every Indian student with personalized, data-driven career guidance that helps them 
            discover their true potential and navigate the evolving job market with confidence. We believe 
            that every student deserves access to quality career counseling, regardless of their economic 
            background or geographical location.
          </Typography>
        </Card>
      </Box>

      {/* Problem Statement */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          The Problem We Solve
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <Typography variant="h6" gutterBottom color="error">
                Generic Guidance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Traditional career counseling often provides one-size-fits-all advice that doesn't 
                account for individual strengths, interests, and aspirations.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <Typography variant="h6" gutterBottom color="error">
                Outdated Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Career guidance often relies on outdated job market information and doesn't keep 
                pace with rapidly evolving industries and emerging roles.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
              <Typography variant="h6" gutterBottom color="error">
                Limited Access
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quality career counseling is often expensive and inaccessible to students from 
                smaller cities and rural areas.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Our Solution */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Our Solution
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Assessment sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">
                  AI-Powered Assessment
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Comprehensive evaluation of personality, skills, interests, and aptitudes using 
                advanced AI algorithms and psychological frameworks.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AutoGraph sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">
                  Personalized Recommendations
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Tailored career path suggestions based on individual profiles, current market trends, 
                and future job prospects in India.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">
                  Skills Gap Analysis
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Identify skill gaps and provide personalized learning paths with specific courses, 
                projects, and certifications.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Support sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h6">
                  Continuous Support
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Ongoing guidance and support throughout the career development journey with 
                regular updates and progress tracking.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Our Values */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Our Values
        </Typography>
        <Grid container spacing={3}>
          {values.map((value, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {value.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {value.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {value.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Team Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Our Team
        </Typography>
        <Grid container spacing={3}>
          {team.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                  {member.avatar}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="primary.main" gutterBottom>
                  {member.role}
                </Typography>
                <Chip 
                  label={member.expertise} 
                  size="small" 
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Technology Stack */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Technology Stack
        </Typography>
        <Card sx={{ p: 4 }}>
          <Grid container spacing={2} sx={{ textAlign: 'center' }}>
            <Grid item xs={6} sm={4} md={2}>
              <Chip label="Google Cloud AI" color="primary" />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Chip label="React.js" color="secondary" />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Chip label="Node.js" color="success" />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Chip label="MongoDB" color="warning" />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Chip label="Material-UI" color="info" />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Chip label="Machine Learning" color="error" />
            </Grid>
          </Grid>
        </Card>
      </Box>

      {/* Contact Section */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Get in Touch
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Have questions or want to learn more about our platform?
        </Typography>
        <Typography variant="h6" color="primary.main" sx={{ mb: 2 }}>
          contact@careeradvisor.in
        </Typography>
        <Typography variant="h6" color="primary.main" sx={{ mb: 2 }}>
          Mobile: +91 7378948397
        </Typography>
        <Typography variant="h6" color="primary.main">
          Location: Pune, India
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
