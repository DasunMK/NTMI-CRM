import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Alert, Box, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = async () => {
    // 1. Basic Validation
    if (!formData.username || !formData.email || !formData.phone || !formData.newPassword) {
        setMessage({ type: 'error', text: "Please fill in all fields to verify it's you." });
        return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: "New passwords do not match." });
        return;
    }

    // 2. Send to Backend
    try {
      await api.put('/users/reset-password', { 
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        newPassword: formData.newPassword
      });

      setMessage({ type: 'success', text: "Identity Verified! Password Reset Successfully." });
      
      // Redirect to Login after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
      
    } catch (error) {
      // Show the specific error (e.g., "Phone number does not match")
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || "Verification Failed. Details are incorrect." 
      });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f0f2f5' }}>
      <CssBaseline />
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          <Typography variant="h5" align="center" fontWeight="bold" color="primary">
            Reset Password
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 1 }}>
            Verify your identity to set a new password.
          </Typography>
          
          {message.text && <Alert severity={message.type}>{message.text}</Alert>}

          <TextField 
            label="Username" name="username" size="small" fullWidth 
            value={formData.username} onChange={handleChange} 
          />
          
          {/* SECURITY QUESTIONS */}
          <TextField 
            label="Registered Email" name="email" size="small" fullWidth 
            value={formData.email} onChange={handleChange} 
            placeholder="e.g. user@ntmi.lk"
          />
          <TextField 
            label="Registered Phone" name="phone" size="small" fullWidth 
            value={formData.phone} onChange={handleChange} 
            placeholder="e.g. 0771234567"
          />
          
          <Typography variant="caption" sx={{ mt: 1, color: '#555', fontWeight: 'bold' }}>
            New Credentials
          </Typography>
          <TextField 
            label="New Password" name="newPassword" type="password" size="small" fullWidth 
            value={formData.newPassword} onChange={handleChange} 
          />
          <TextField 
            label="Confirm Password" name="confirmPassword" type="password" size="small" fullWidth 
            value={formData.confirmPassword} onChange={handleChange} 
          />

          <Button variant="contained" fullWidth size="large" onClick={handleReset} sx={{ mt: 2 }}>
            Verify & Reset
          </Button>
          <Button onClick={() => navigate('/login')}>Back to Login</Button>
        </Paper>
      </Container>
    </Box>
  );
}