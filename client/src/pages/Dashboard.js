import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  LinearProgress,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Assessment,
  School,
  TrendingUp,
  Psychology,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from 'react-query';
import { assessmentAPI, careerAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch user's assessment history
  const { data: assessmentHistory, isLoading: assessmentLoading } = useQuery(
    'assessmentHistory',
    assessmentAPI.getHistory,
    {
      enabled: !!user,
    }
  );

  // Fetch career recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery(
    'careerRecommendations',
    careerAPI.getRecommendations,
    {
      enabled: !!user && !!user.assessmentResults?.personalityType,
    }
  );

  const getCompletionPercentage = () => {
    if (!user) return 0;
    
    let completed = 0;
    let total = 4;
    
    if (user.skills && user.skills.length > 0) completed++;
    if (user.interests && user.interests.length > 0) completed++;
    if (user.careerGoals?.shortTerm) completed++;
    if (user.assessmentResults?.personalityType) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const getNextSteps = () => {
    const steps = [];
    
    if (!user.assessmentResults?.personalityType) {
      steps.push({
        title: 'Complete Assessment',
        description: 'Take our comprehensive assessment to discover your personality and strengths',
        action: () => navigate('/assessment'),
        icon: <Assessment />,
        color: 'primary',
      });
    }
    
    if (!user.skills || user.skills.length === 0) {
      steps.push({
        title: 'Add Your Skills',
        description: 'Tell us about your current skills to get personalized recommendations',
        action: () => navigate('/profile'),
        icon: <TrendingUp />,
        color: 'secondary',
      });
    }
    
    if (!user.interests || user.interests.length === 0) {
      steps.push({
        title: 'Define Your Interests',
        description: 'Share your interests to find matching career paths',
        action: () => navigate('/profile'),
        icon: <Psychology />,
        color: 'success',
      });
    }
    
    if (!user.careerGoals?.shortTerm) {
      steps.push({
        title: 'Set Career Goals',
        description: 'Define your short and long-term career objectives',
        action: () => navigate('/profile'),
        icon: <School />,
        color: 'warning',
      });
    }
    
    return steps.slice(0, 3); // Show max 3 next steps
  };

  const getRecentActivity = () => {
    const activities = [];
    
    if (assessmentHistory?.assessments?.length > 0) {
      const recentAssessment = assessmentHistory.assessments[0];
      activities.push({
        title: `Completed ${recentAssessment.type} Assessment`,
        time: new Date(recentAssessment.createdAt).toLocaleDateString(),
        icon: <CheckCircle color="success" />,
      });
    }
    
    return activities;
  };

  if (assessmentLoading || recommendationsLoading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's your personalized career development overview
        </Typography>
      </Box>

      {/* Profile Completion */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              Profile Completion
            </Typography>
            <Chip 
              label={`${getCompletionPercentage()}% Complete`} 
              color={getCompletionPercentage() === 100 ? 'success' : 'primary'}
              sx={{ ml: 2 }}
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={getCompletionPercentage()} 
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            Complete your profile to get more personalized recommendations
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <Assessment />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {assessmentHistory?.assessments?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Assessments Completed
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                      <TrendingUp />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {user?.skills?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Skills Added
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                      <School />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {recommendations?.recommendations?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Career Recommendations
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                      <Schedule />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {user?.assessmentResults?.lastAssessmentDate 
                          ? Math.ceil((new Date() - new Date(user.assessmentResults.lastAssessmentDate)) / (1000 * 60 * 60 * 24))
                          : 'N/A'
                        }
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Days Since Last Assessment
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {getRecentActivity().length > 0 ? (
                getRecentActivity().map((activity, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {activity.icon}
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="body2">
                        {activity.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recent activity
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Next Steps */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Next Steps
          </Typography>
          <Grid container spacing={3}>
            {getNextSteps().map((step, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: `${step.color}.main`, mr: 2 }}>
                        {step.icon}
                      </Avatar>
                      <Typography variant="h6">
                        {step.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {step.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color={step.color}
                      onClick={step.action}
                    >
                      Get Started
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<Assessment />}
                onClick={() => navigate('/assessment')}
                sx={{ py: 2 }}
              >
                Take Assessment
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<School />}
                onClick={() => navigate('/career-paths')}
                sx={{ py: 2 }}
              >
                Explore Careers
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<TrendingUp />}
                onClick={() => navigate('/skills')}
                sx={{ py: 2 }}
              >
                Skills Analysis
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<Psychology />}
                onClick={() => navigate('/recommendations')}
                sx={{ py: 2 }}
              >
                Get Recommendations
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
