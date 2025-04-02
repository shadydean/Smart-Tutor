import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  VideoCall as VideoCallIcon,
  Message as MessageIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { styled } from '@mui/material/styles';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.9), rgba(17, 25, 40, 0.7))',
  backdropFilter: 'blur(16px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0, 242, 254, 0.15)',
    border: '1px solid rgba(0, 242, 254, 0.2)',
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(145deg, rgba(17, 25, 40, 0.9), rgba(17, 25, 40, 0.7))',
  backdropFilter: 'blur(16px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  padding: theme.spacing(3),
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0, 242, 254, 0.15)',
    border: '1px solid rgba(0, 242, 254, 0.2)',
  },
}));

function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalEarnings: 0,
    averageRating: 0,
    completionRate: 0,
  });
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [earningsData, setEarningsData] = useState({
    labels: [],
    data: []
  });
  const [sessionsData, setSessionsData] = useState({
    labels: [],
    data: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, sessionsRes, activityRes, earningsRes, sessionsDataRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/upcoming-sessions'),
          api.get('/dashboard/recent-activity'),
          api.get('/dashboard/earnings-data'),
          api.get('/dashboard/sessions-data'),
        ]);

        setStats(statsRes.data);
        setUpcomingSessions(sessionsRes.data);
        setRecentActivity(activityRes.data);
        setEarningsData(earningsRes.data);
        setSessionsData(sessionsDataRes.data);
        setError('');
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const earningsChartData = {
    labels: earningsData.labels,
    datasets: [
      {
        label: 'Monthly Earnings ($)',
        data: earningsData.data,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const sessionsChartData = {
    labels: sessionsData.labels,
    datasets: [
      {
        label: 'Monthly Sessions',
        data: sessionsData.data,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#9fafef',
          font: {
            family: '"Poppins", sans-serif',
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(159, 175, 239, 0.1)',
        },
        ticks: {
          color: '#9fafef',
          font: {
            family: '"Poppins", sans-serif',
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(159, 175, 239, 0.1)',
        },
        ticks: {
          color: '#9fafef',
          font: {
            family: '"Poppins", sans-serif',
          },
        },
      },
    },
  };

  const StatCard = ({ icon, title, value, subtitle }) => (
    <StyledCard>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {React.cloneElement(icon, { 
            sx: { 
              color: '#00f2fe',
              filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
            } 
          })}
          <Typography 
            variant="h6" 
            sx={{ 
              ml: 1,
              color: '#fff',
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            {title}
          </Typography>
        </Box>
        <Typography 
          variant="h4" 
          component="div" 
          gutterBottom
          sx={{
            color: '#fff',
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            background: 'linear-gradient(to right, #00f2fe, #4facfe)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.3))',
          }}
        >
          {value}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#9fafef',
            fontFamily: '"Poppins", sans-serif',
          }}
        >
          {subtitle}
        </Typography>
      </CardContent>
    </StyledCard>
  );

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh',
          background: 'linear-gradient(135deg, #0f1724 0%, #1a1f2c 100%)',
        }}
      >
        <CircularProgress sx={{ color: '#00f2fe' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1724 0%, #1a1f2c 100%)',
      pt: 4,
      pb: 8,
    }}>
      <Container maxWidth="lg">
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: '12px',
              background: 'rgba(211, 47, 47, 0.1)',
              border: '1px solid rgba(211, 47, 47, 0.3)',
              color: '#ff8a80',
            }}
          >
            {error}
          </Alert>
        )}
        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<CalendarIcon />}
              title="Total Sessions"
              value={stats.totalSessions}
              subtitle="All time"
            />
          </Grid>
          {user?.role === 'tutor' && (
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<MoneyIcon />}
                title="Total Earnings"
                value={`$${stats.totalEarnings}`}
                subtitle="All time"
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<StarIcon />}
              title="Average Rating"
              value={stats.averageRating.toFixed(1)}
              subtitle="Out of 5.0"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<TimeIcon />}
              title="Completion Rate"
              value={`${stats.completionRate.toFixed(1)}%`}
              subtitle="Sessions completed"
            />
          </Grid>

          {/* Charts */}
          {user?.role === 'tutor' && (
            <Grid item xs={12} md={6}>
              <StyledPaper>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    color: '#fff',
                    fontFamily: '"Poppins", sans-serif',
                    mb: 3,
                  }}
                >
                  Earnings Overview
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line data={earningsChartData} options={chartOptions} />
                </Box>
              </StyledPaper>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  color: '#fff',
                  fontFamily: '"Poppins", sans-serif',
                  mb: 3,
                }}
              >
                Sessions Overview
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={sessionsChartData} options={chartOptions} />
              </Box>
            </StyledPaper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  color: '#fff',
                  fontFamily: '"Poppins", sans-serif',
                  mb: 3,
                }}
              >
                Recent Activity
              </Typography>
              <List>
                {recentActivity.map((activity) => (
                  <ListItem 
                    key={activity.id}
                    sx={{
                      borderRadius: '12px',
                      mb: 1,
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography 
                          sx={{ 
                            color: '#fff',
                            fontFamily: '"Poppins", sans-serif',
                          }}
                        >
                          {activity.title}
                        </Typography>
                      }
                      secondary={
                        <Typography 
                          sx={{ 
                            color: '#9fafef',
                            fontFamily: '"Poppins", sans-serif',
                            fontSize: '0.875rem',
                          }}
                        >
                          {`${activity.description} - ${new Date(activity.date).toLocaleDateString()} ${activity.time}`}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={activity.status}
                        color={
                          activity.status === 'completed'
                            ? 'success'
                            : activity.status === 'cancelled'
                            ? 'error'
                            : 'primary'
                        }
                        size="small"
                        sx={{
                          fontFamily: '"Poppins", sans-serif',
                          background: activity.status === 'completed'
                            ? 'rgba(46, 125, 50, 0.2)'
                            : activity.status === 'cancelled'
                            ? 'rgba(211, 47, 47, 0.2)'
                            : 'rgba(0, 242, 254, 0.2)',
                          border: `1px solid ${
                            activity.status === 'completed'
                              ? 'rgba(46, 125, 50, 0.5)'
                              : activity.status === 'cancelled'
                              ? 'rgba(211, 47, 47, 0.5)'
                              : 'rgba(0, 242, 254, 0.5)'
                          }`,
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </StyledPaper>
          </Grid>

          {/* Upcoming Sessions */}
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  color: '#fff',
                  fontFamily: '"Poppins", sans-serif',
                  mb: 3,
                }}
              >
                Upcoming Sessions
              </Typography>
              <List>
                {upcomingSessions.map((session) => (
                  <ListItem 
                    key={session._id}
                    sx={{
                      borderRadius: '12px',
                      mb: 1,
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography 
                          sx={{ 
                            color: '#fff',
                            fontFamily: '"Poppins", sans-serif',
                          }}
                        >
                          {session.service.title}
                        </Typography>
                      }
                      secondary={
                        <Typography 
                          sx={{ 
                            color: '#9fafef',
                            fontFamily: '"Poppins", sans-serif',
                            fontSize: '0.875rem',
                          }}
                        >
                          {`${new Date(session.date).toLocaleDateString()} ${session.startTime}`}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Join Meeting">
                        <IconButton 
                          edge="end" 
                          aria-label="join"
                          sx={{
                            color: '#00f2fe',
                            '&:hover': {
                              background: 'rgba(0, 242, 254, 0.1)',
                            },
                          }}
                        >
                          <VideoCallIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </StyledPaper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Dashboard;
