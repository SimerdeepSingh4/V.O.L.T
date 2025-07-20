import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

const features = [
  {
    title: 'Speech-to-Text Conversion',
    description: 'Easily convert speech into accurate text in real-time. Capture conversations, lectures, and meetings with seamless transcription.',
    image: process.env.PUBLIC_URL + '/images/image1.png',
  },
  {
    title: 'Emotion Detection',
    description: 'Detect emotions in speech and adjust text tone accordingly. Experience conversations with emotional depth in every language.',
    image: process.env.PUBLIC_URL + '/images/image2.png',
  },
  {
    title: 'Multilingual Support',
    description: 'Translate speech in multiple languages instantly. Break language barriers and communicate effectively across cultures.',
    image: process.env.PUBLIC_URL + '/images/image3.png',
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '92vh', background: 'linear-gradient(120deg, #f4f6fb 0%, #F8FFAE 100%)', py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" sx={{ fontWeight: 800, color: '#222', mb: 2, letterSpacing: 2 }}>
          Welcome to Volt
        </Typography>
        <Typography variant="h5" sx={{ color: '#555', mb: 4, fontWeight: 400 }}>
          The modern way to transcribe, translate, and understand speech in any language.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 5, py: 1.5, fontWeight: 700, fontSize: '1.1rem', borderRadius: 8, boxShadow: 2, mr: 2 }}
          onClick={() => navigate('/register')}
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          sx={{ px: 5, py: 1.5, fontWeight: 700, fontSize: '1.1rem', borderRadius: 8 }}
          onClick={() => navigate('/TranscribePage')}
        >
          Try as Guest
        </Button>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, idx) => (
          <Grid item xs={12} sm={6} md={4} key={feature.title}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-8px) scale(1.03)' } }}>
              <CardMedia
                component="img"
                height="300"
                image={feature.image}
                alt={feature.title}
                sx={{ objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" sx={{ color: '#444' }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sign In Section */}
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
          Already have an account?
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          sx={{ px: 5, py: 1.5, fontWeight: 700, fontSize: '1.1rem', borderRadius: 8 }}
          onClick={() => navigate('/login')}
        >
          Sign In
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
