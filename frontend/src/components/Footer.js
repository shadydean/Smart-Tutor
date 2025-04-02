import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Stack,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { styled } from '@mui/material/styles';

const StyledLink = styled(Link)(({ theme }) => ({
  color: '#9fafef',
  textDecoration: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#00f2fe',
    textDecoration: 'none',
  },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: '#9fafef',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: '#00f2fe',
    transform: 'translateY(-2px)',
    background: 'rgba(0, 242, 254, 0.1)',
  },
}));

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.95), rgba(17, 25, 40, 0.85))',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.1)',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 600,
                background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
              }}
            >
              About SmartTutor
            </Typography>
            <Typography 
              variant="body2"
              sx={{
                color: '#9fafef',
                lineHeight: 1.8,
              }}
            >
              We are dedicated to providing high-quality tutoring services to help students
              achieve their academic goals. Our platform connects students with expert tutors
              for personalized learning experiences.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 600,
                background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
              }}
            >
              Quick Links
            </Typography>
            <Stack spacing={1.5}>
              <StyledLink href="/">Home</StyledLink>
              <StyledLink href="/services">Services</StyledLink>
              <StyledLink href="/blog">Blog</StyledLink>
              <StyledLink href="/book-online">Book Online</StyledLink>
              <StyledLink href="/contact">Contact Us</StyledLink>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 600,
                background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
              }}
            >
              Contact Info
            </Typography>
            <Typography 
              variant="body2" 
              paragraph
              sx={{
                color: '#9fafef',
                lineHeight: 1.8,
              }}
            >
              Email: contact@smarttutor.com
            </Typography>
            <Typography 
              variant="body2" 
              paragraph
              sx={{
                color: '#9fafef',
                lineHeight: 1.8,
              }}
            >
              Phone: +1 (555) 123-4567
            </Typography>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                mt: 2,
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 600,
                background: 'linear-gradient(to right, #00f2fe, #4facfe)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
              }}
            >
              Follow Us
            </Typography>
            <Box>
              <SocialIconButton>
                <FacebookIcon />
              </SocialIconButton>
              <SocialIconButton>
                <TwitterIcon />
              </SocialIconButton>
              <SocialIconButton>
                <InstagramIcon />
              </SocialIconButton>
              <SocialIconButton>
                <LinkedInIcon />
              </SocialIconButton>
            </Box>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          align="center"
          sx={{ 
            mt: 4,
            color: '#9fafef',
            opacity: 0.8,
            fontFamily: '"Poppins", sans-serif',
          }}
        >
          © {new Date().getFullYear()} SmartTutor. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
