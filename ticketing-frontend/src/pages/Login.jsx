import React, { useState } from 'react';
import { 
  Container, Paper, TextField, Button, Typography, Alert, Box, CssBaseline 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

import logoImg from '../assets/logo.png'; 
import bgImg from '../assets/ntmi_bg.png'; // <--- 1. IMPORT BACKGROUND

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post('/users/login', credentials);
      const user = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role === 'OPS') navigate('/dashboard'); 
      else navigate('/my-tickets'); 
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
      
      // --- 2. ADD BACKGROUND IMAGE STYLES HERE ---
      backgroundImage: `url(${bgImg})`,
      backgroundSize: 'cover',        // Ensures image covers full screen
      backgroundPosition: 'center',   // Centers the image
      backgroundRepeat: 'no-repeat',
      
      position: 'absolute', top: 0, left: 0
    }}>
      <CssBaseline />

      {/* Optional: Dark Overlay to make text readable */}
      <Box sx={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // 40% dark tint
        zIndex: 1
      }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 2 }}> 
        <Paper elevation={6} sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.95)' // Slight transparency on the card
        }}>
          
          <Box sx={{ mb: 3, textAlign: 'center', width: '100%' }}>
            <img 
              src={logoImg} 
              alt="NTMI Logo" 
              style={{ width: '200px', maxWidth: '80%', height: 'auto', objectFit: 'contain' }} 
            />
          </Box>
          
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
            NTMI CRM Login
          </Typography>
          
          {/* ... Rest of your form (TextFields, Buttons) stays exactly the same ... */}
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

          <Box component="form" sx={{ mt: 1, width: '100%' }}>
             <TextField fullWidth label="Username" variant="outlined" margin="normal" onChange={(e) => setCredentials({...credentials, username: e.target.value})} />
             <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" onChange={(e) => setCredentials({...credentials, password: e.target.value})} onKeyPress={(e) => e.key === 'Enter' && handleLogin()} />
             
             <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="button" variant="text" size="small" onClick={() => navigate('/forgot-password')} sx={{ textTransform: 'none' }}>Forgot Password?</Button>
             </Box>

             <Button fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2, bgcolor: '#1976d2', fontWeight: 'bold', py: 1.5 }} onClick={handleLogin}>Secure Login</Button>
          </Box>

        </Paper>
      </Container>
    </Box>
  );
}