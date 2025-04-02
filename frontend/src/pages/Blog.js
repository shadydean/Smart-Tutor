import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, CardActionArea, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.9), rgba(17, 25, 40, 0.7))',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 30px rgba(0, 242, 254, 0.2)',
    border: '1px solid rgba(0, 242, 254, 0.2)',
  },
}));

function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: 'How to Prepare for College Entrance Exams',
      excerpt: 'Essential tips and strategies for acing your college entrance exams...',
      image: '/blog1.jpg',
      date: '2025-02-13',
    },
    {
      id: 2,
      title: 'The Benefits of One-on-One Tutoring',
      excerpt: 'Discover why personalized tutoring can accelerate your learning...',
      image: '/blog2.jpg',
      date: '2025-02-12',
    },
    {
      id: 3,
      title: 'Study Techniques That Actually Work',
      excerpt: 'Science-backed study methods to help you learn more effectively...',
      image: '/blog3.jpg',
      date: '2025-02-11',
    },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1724 0%, #1a1f2c 100%)',
      pt: 8,
      pb: 12,
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 700,
            textAlign: 'center',
            mb: 2,
            color: '#fff',
            fontFamily: '"Poppins", sans-serif',
            background: 'linear-gradient(to right, #00f2fe, #4facfe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
          }}
        >
          Blog
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          sx={{
            textAlign: 'center',
            mb: 8,
            color: '#9fafef',
            fontSize: '1.1rem',
            maxWidth: '600px',
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          Latest insights, tips, and news from our tutoring experts
        </Typography>
        
        <Grid container spacing={4}>
          {blogPosts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <StyledCard>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="240"
                    image={post.image}
                    alt={post.title}
                    sx={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      component="h2"
                      sx={{
                        color: '#fff',
                        fontFamily: '"Poppins", sans-serif',
                        fontWeight: 600,
                        fontSize: '1.35rem',
                        mb: 2,
                        lineHeight: 1.4,
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{
                        color: '#9fafef',
                        mb: 2,
                        lineHeight: 1.6,
                        fontSize: '0.95rem',
                      }}
                    >
                      {post.excerpt}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{
                        color: '#00f2fe',
                        display: 'block',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                      }}
                    >
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Blog;
