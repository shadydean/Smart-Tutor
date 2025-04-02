import React, { useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
  Avatar,
  Rating,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import Typed from 'typed.js';

const Hero = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #0f1724 0%, #1a1f2c 100%)',
  height: '85vh',
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(33, 150, 243, 0.1) 0%, transparent 50%)',
    zIndex: 1,
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.9), rgba(17, 25, 40, 0.7))',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 30px rgba(0, 242, 254, 0.2)',
  },
}));

const blogPosts = [
  {
    title: 'How to Excel in Online Learning',
    description: 'Tips and strategies for successful online education',
    image: './blog1.jpg',
  },
  {
    title: 'Time Management for Students',
    description: 'Master the art of balancing studies and life',
    image: './blog2.jpg',
  },
  {
    title: 'Choosing the Right Study Method',
    description: 'Find the perfect study technique for your learning style',
    image: './blog3.jpg',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Computer Science Student',
    avatar: './avatar1.jpg',
    rating: 5,
    text: 'The tutoring service has been invaluable for my programming courses. My tutor helped me understand complex concepts and improve my coding skills significantly.',
  },
  {
    name: 'Michael Chen',
    role: 'Engineering Student',
    avatar: './avatar2.jpg',
    rating: 5,
    text: 'I was struggling with advanced calculus until I found this platform. The personalized attention and clear explanations made all the difference.',
  },
  {
    name: 'Emily Brown',
    role: 'Biology Student',
    avatar: './avatar3.jpg',
    rating: 5,
    text: 'The assignment help service is fantastic! I received detailed explanations and learned so much from the solutions provided.',
  },
  {
    name: 'David Wilson',
    role: 'Physics Student',
    avatar: './avatar4.jpg',
    rating: 5,
    text: 'The tutors here are not just knowledgeable but also very patient. They ensure you understand the fundamentals before moving to advanced topics.',
  },
];

function Home() {
  const typedRef = useRef(null);

  useEffect(() => {
    const options = {
      strings: ['Your path to academic excellence'],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 3000,
      loop: true,
    };

    const typed = new Typed(typedRef.current, options);

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <Box sx={{ background: 'linear-gradient(135deg, #0f1724 0%, #1a1f2c 100%)' }}>
      <Hero>
        <Container>
          <Box 
            sx={{ 
              maxWidth: '800px',
              background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.86), rgba(17, 25, 40, 0.64))',
              padding: { xs: 4, md: 5 },
              borderRadius: '24px',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              mx: 'auto',
              textAlign: 'center',
              position: 'relative',
              zIndex: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                background: 'linear-gradient(45deg, #00f2fe, #4facfe)',
                zIndex: -1,
                borderRadius: '26px',
                opacity: 0.13,
              }
            }}
          >
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.2rem', md: '4rem' },
                fontWeight: 800,
                letterSpacing: '0.02em',
                mb: 3,
                fontFamily: '"Poppins", sans-serif',
                background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                lineHeight: 1.2,
                filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
              }}
            >
              Smart Tutor
            </Typography>
            
            <Typography
              component="div"
              sx={{
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
                fontWeight: 600,
                fontFamily: '"Poppins", sans-serif',
                background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
              }}
            >
              <span ref={typedRef}></span>
            </Typography>

            <Typography 
              variant="h5" 
              gutterBottom
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                mb: 4,
                fontWeight: 400,
                letterSpacing: '0.3px',
                color: '#9fafef',
                fontFamily: '"Poppins", sans-serif',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.5,
                opacity: 0.95,
                textShadow: '0 0 20px rgba(159, 175, 239, 0.2)',
              }}
            >
              Connect with experts and unlock your true potential
            </Typography>

            <Button 
              variant="contained" 
              size="large" 
              component={Link}
              to="/book-online"
              sx={{
                background: 'linear-gradient(45deg, #00f2fe 30%, #4facfe 90%)',
                borderRadius: '12px',
                padding: '12px 32px',
                fontSize: '1.1rem',
                textTransform: 'none',
                fontWeight: 500,
                letterSpacing: '0.3px',
                boxShadow: '0 4px 15px rgba(0, 242, 254, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#0f1724',
                '&:hover': {
                  background: 'linear-gradient(45deg, #00f2fe 50%, #4facfe 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 242, 254, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Hero>

      <Container sx={{ py: 12 }}>
        <Typography 
          variant="h2" 
          component="h2" 
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            textAlign: 'center',
            mb: 6,
            color: 'white',
            fontFamily: '"Poppins", sans-serif',
            background: 'linear-gradient(to right, #00f2fe, #4facfe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
          }}
        >
          Latest Blog Posts
        </Typography>
        <Grid container spacing={4}>
          {blogPosts.map((post, index) => (
            <Grid item xs={12} md={4} key={index}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="200"
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
                      mb: 2,
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{
                      color: '#9fafef',
                      lineHeight: 1.6,
                    }}
                  >
                    {post.description}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ 
        py: 12, 
        background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.9), rgba(17, 25, 40, 0.7))',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <Container>
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            align="center"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 6,
              fontFamily: '"Poppins", sans-serif',
              background: 'linear-gradient(to right, #00f2fe, #4facfe)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
            }}
          >
            What Our Students Say
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index}>
                <StyledCard sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        src={testimonial.avatar}
                        sx={{
                          width: 64,
                          height: 64,
                          border: '2px solid rgba(0, 242, 254, 0.3)',
                          boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)',
                        }}
                      />
                      <Box sx={{ ml: 2 }}>
                        <Typography 
                          variant="h6" 
                          sx={{
                            color: '#fff',
                            fontFamily: '"Poppins", sans-serif',
                            fontWeight: 600,
                          }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography 
                          variant="subtitle2" 
                          sx={{
                            color: '#9fafef',
                            opacity: 0.9,
                          }}
                        >
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating 
                      value={testimonial.rating} 
                      readOnly 
                      sx={{ 
                        mb: 2,
                        '& .MuiRating-iconFilled': {
                          color: '#00f2fe',
                        },
                      }} 
                    />
                    <Typography 
                      variant="body1" 
                      sx={{
                        color: '#9fafef',
                        lineHeight: 1.8,
                        fontStyle: 'italic',
                        opacity: 0.9,
                      }}
                    >
                      "{testimonial.text}"
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: 12 }}>
        <Typography 
          variant="h2" 
          component="h2" 
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            textAlign: 'center',
            mb: 6,
            color: 'white',
            fontFamily: '"Poppins", sans-serif',
            background: 'linear-gradient(to right, #00f2fe, #4facfe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
          }}
        >
          Video Library
        </Typography>
        <StyledCard sx={{ p: 4 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              color: '#fff',
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 600,
              mb: 3,
            }}
          >
            Featured Tutorial
          </Typography>
          <Box
            sx={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Box
              component="iframe"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              src="https://www.youtube.com/embed/9-nSwHbVc7s?si=juJuDlj_v9ewd-oL"
              title="Featured Tutorial"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        </StyledCard>
      </Container>
    </Box>
  );
}

export default Home;
