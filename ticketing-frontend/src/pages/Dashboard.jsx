import React, { useEffect, useState } from 'react';
import { 
  Grid, Paper, Typography, Button, Chip, Box, Container, IconButton, TextField, ToggleButton, ToggleButtonGroup 
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import api from '../api/axiosConfig';
import StatCharts from '../components/StatCharts';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [viewMode, setViewMode] = useState('today'); // 'today' or 'history'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get current Logged in Admin
  const currentUser = JSON.parse(localStorage.getItem('user'));

  // Load tickets
  const loadTickets = async () => {
    try {
      const response = await api.get('/tickets/all');
      setTickets(response.data);
    } catch (error) {
      console.error("Error loading tickets:", error);
    }
  };

  useEffect(() => { loadTickets(); }, []);

  // --- SMART UPDATE FUNCTION ---
  const updateStatus = async (id, status) => {
    try {
      // We send both the new Status AND the Admin's Username
      await api.put(`/tickets/update/${id}`, {
        status: status,
        username: currentUser.username 
      });
      loadTickets(); // Refresh UI
    } catch (error) {
      alert("Error updating ticket");
    }
  };

  const downloadPDF = (ticket) => {
    const doc = new jsPDF();
    doc.text("NTMI Job Card", 10, 10);
    doc.text(`Ticket ID: ${ticket.id}`, 10, 20);
    doc.text(`Branch: ${ticket.branchName}`, 10, 30);
    doc.text(`Fixed By: ${ticket.fixedBy || 'Pending'}`, 10, 40);
    doc.save(`ticket_${ticket.id}.pdf`);
  };

  // --- FILTERING LOGIC (The Brains) ---
  const getFilteredTickets = () => {
    const todayStr = new Date().toISOString().split('T')[0]; // "2023-12-09"

    return tickets.filter(ticket => {
      // 1. Search Filter (by ID or Branch)
      if (searchTerm && !ticket.branchName.toLowerCase().includes(searchTerm.toLowerCase()) && !ticket.id.includes(searchTerm)) {
        return false;
      }

      // 2. View Mode Filter
      if (viewMode === 'today') {
        // Show if Status is PENDING OR Created Today
        const createdDate = ticket.createdDate ? ticket.createdDate.split('T')[0] : '';
        return ticket.status === 'PENDING' || ticket.status === 'IN_PROGRESS' || createdDate === todayStr;
      } 
      
      // If 'history', show EVERYTHING (that matches search)
      return true;
    });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: '#0056b3' }}>
        Operations Dashboard
      </Typography>
      
      <StatCharts tickets={tickets} />

      {/* --- TOOLBAR: Search & Filters --- */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        
        {/* Toggle: Today vs History */}
        <ToggleButtonGroup
          color="primary"
          value={viewMode}
          exclusive
          onChange={(e, newView) => { if(newView) setViewMode(newView); }}
        >
          <ToggleButton value="today">Today's Jobs</ToggleButton>
          <ToggleButton value="history">Full History</ToggleButton>
        </ToggleButtonGroup>

        {/* Search Box (Only shows in History mode or always if you prefer) */}
        <TextField 
          size="small" 
          placeholder="Search by Branch or ID..." 
          InputProps={{ startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Paper>

      {/* --- TICKET LIST --- */}
      <Grid container spacing={3}>
        {getFilteredTickets().map((ticket) => (
          <Grid item xs={12} md={6} lg={4} key={ticket.id}>
             <Paper sx={{ p: 2, borderLeft: `6px solid ${ticket.status === 'PENDING' ? '#d32f2f' : ticket.status === 'IN_PROGRESS' ? '#ed6c02' : '#2e7d32'}` }}>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">{ticket.branchName}</Typography>
                  <IconButton onClick={() => downloadPDF(ticket)}><PrintIcon /></IconButton>
              </Box>
              
              <Typography variant="caption" display="block" gutterBottom>
                 {new Date(ticket.createdDate).toLocaleString()}
              </Typography>

              <Typography color="textSecondary" fontWeight="bold">{ticket.errorCategory} - {ticket.errorType}</Typography>
              <Typography variant="body2" sx={{ my: 1, fontStyle: 'italic' }}>"{ticket.description}"</Typography>
              
              {/* Show who fixed it if started */}
              {ticket.fixedBy && (
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'blue' }}>
                   🔧 Fixed By: {ticket.fixedBy}
                </Typography>
              )}

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip label={ticket.status} color={ticket.status === 'PENDING' ? 'error' : ticket.status === 'IN_PROGRESS' ? 'warning' : 'success'} />
                
                {ticket.status === 'PENDING' && (
                    <Button variant="contained" color="warning" size="small" 
                      onClick={() => updateStatus(ticket.id, 'IN_PROGRESS')}>Start Job</Button>
                )}
                {ticket.status === 'IN_PROGRESS' && (
                    <Button variant="contained" color="success" size="small" 
                      onClick={() => updateStatus(ticket.id, 'COMPLETED')}>Complete</Button>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
        
        {getFilteredTickets().length === 0 && (
            <Typography variant="h6" color="textSecondary" sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
                No active jobs found for today. Good work! ☕
            </Typography>
        )}
      </Grid>
    </Container>
  );
}