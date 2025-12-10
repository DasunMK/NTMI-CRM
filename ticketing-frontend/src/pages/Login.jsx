import React, { useState } from 'react';
import { 
  Container, Paper, TextField, Button, Typography, Alert, Box, CssBaseline 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

// 1. IMPORT YOUR LOGO HERE
// Make sure the filename matches exactly what is in src/assets/
import logoImg from '../assets/logo.png'; 

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post('/users/login', credentials);
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'OPS') {
        navigate('/dashboard'); 
      } else {
        navigate('/my-tickets'); 
      }
    } catch (err) {
      setError('Invalid Username or Password');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f0f2f5',
      position: 'absolute', top: 0, left: 0
    }}>
      <CssBaseline />

      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          borderRadius: 3 
        }}>
          
          {/* 2. REPLACE AVATAR WITH IMAGE */}
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img 
              src={logoImg} 
              alt="NTMI Logo" 
              style={{ width: '200px', maxWidth:'80%' , height: 'auto', objectFit: 'contain', marginBottom: '10px' }} 
            />
          </Box>
          
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
            NTMI CRM
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Ticketing Portal
          </Typography>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <Box component="form" sx={{ mt: 1, width: '100%' }}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              autoFocus
            />

            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              margin="normal"
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, bgcolor: '#1976d2', fontWeight: 'bold', py: 1.5 }}
              onClick={handleLogin}
            >
              Secure Login
            </Button>

            {/* <Box sx={{ textAlign: 'center', mt: 2, p: 2, bgcolor: '#f7f7f7', borderRadius: 2 }}>
              <Typography variant="caption" display="block" color="textSecondary">
                <strong>Demo Credentials:</strong>
              </Typography>
              <Typography variant="caption" display="block" color="textSecondary">
                Admin: <code>admin</code> / <code>admin123</code>
              </Typography>
              <Typography variant="caption" display="block" color="textSecondary">
                Branch: <code>gampaha_user</code> / <code>1234</code>
              </Typography>
            </Box> */}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}