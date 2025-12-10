import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Typography, Paper, MenuItem, Box, Container, 
  Backdrop, CircularProgress, Snackbar, Alert // Combined imports
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import api from '../api/axiosConfig';

export default function CreateTicket() {
  const [formData, setFormData] = useState({
    branchName: '',
    errorCategory: '',
    errorType: '',
    description: ''
  });

  // UX States
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Settings Data
  const [settings, setSettings] = useState({ 
    branches: [],
    errorCategories: [], 
    errorTypes: [] 
  });

  // Fetch Settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        setSettings({
          branches: response.data.branches || [],
          errorCategories: response.data.errorCategories || [],
          errorTypes: response.data.errorTypes || []
        });
      } catch (error) {
        console.error("Error loading settings", error);
      }
    };
    fetchSettings();
  }, []);

  // Filter Logic
  const filteredTypes = settings.errorTypes.filter(
    (type) => type.category === formData.errorCategory
  );

  const handleChange = (e) => {
    if (e.target.name === 'errorCategory') {
        setFormData({ ...formData, errorCategory: e.target.value, errorType: '' });
    } else {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleCloseToast = () => setToast({ ...toast, open: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start Spinner

    try {
      const response = await api.post('/tickets/create', {
        ...formData,
        status: "PENDING"
      });
      
      setToast({ open: true, message: `Ticket Raised! ID: ${response.data.id}`, severity: 'success' });
      setFormData({ branchName: '', errorCategory: '', errorType: '', description: '' }); 
      
    } catch (error) {
      console.error("Error:", error);
      setToast({ open: true, message: 'Failed to submit ticket.', severity: 'error' });
    } finally {
      setLoading(false); // Stop Spinner
    }
  };

  return (
    <Container maxWidth="sm">
      
      {/* LOADING SPINNER */}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* SUCCESS/ERROR POPUP */}
      <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>

      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom align="center">Raise New Ticket</Typography>
        <Typography variant="body2" gutterBottom align="center" color="textSecondary">NTMI Branch Support</Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          <TextField select label="Branch Name" name="branchName" value={formData.branchName} onChange={handleChange} required>
            {settings.branches.length > 0 ? (
                settings.branches.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)
            ) : <MenuItem disabled>Loading...</MenuItem>}
          </TextField>

          <TextField select label="Error Category" name="errorCategory" value={formData.errorCategory} onChange={handleChange} required>
            {settings.errorCategories.length > 0 ? (
                settings.errorCategories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)
            ) : <MenuItem disabled>Loading...</MenuItem>}
          </TextField>

          <TextField select label="Error Type" name="errorType" value={formData.errorType} onChange={handleChange} required disabled={!formData.errorCategory}>
             {filteredTypes.length > 0 ? (
                filteredTypes.map((t) => <MenuItem key={t.name} value={t.name}>{t.name}</MenuItem>)
             ) : <MenuItem disabled>Select Category First</MenuItem>}
          </TextField>

          <TextField label="Description" name="description" multiline rows={4} value={formData.description} onChange={handleChange} placeholder="Describe the issue..." />

          <Button type="submit" variant="contained" size="large" endIcon={<SendIcon />} disabled={loading}>
            {loading ? "Sending..." : "Submit Ticket"}
          </Button>

        </Box>
      </Paper>
    </Container>
  );
}