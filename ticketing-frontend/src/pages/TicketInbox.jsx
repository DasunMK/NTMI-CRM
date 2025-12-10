import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, 
  Avatar, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip 
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import DraftsIcon from '@mui/icons-material/Drafts'; // For read/open tickets
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import api from '../api/axiosConfig';

export default function TicketInbox() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null); // Which email is open?
  const currentUser = JSON.parse(localStorage.getItem('user'));

  // Load ONLY Pending Tickets
  const loadInbox = async () => {
    try {
      const response = await api.get('/tickets/all');
      // Filter: Show only PENDING tickets in the Inbox
      const pendingTickets = response.data.filter(t => t.status === 'PENDING');
      setTickets(pendingTickets);
    } catch (error) {
      console.error("Error loading inbox", error);
    }
  };

  useEffect(() => { loadInbox(); }, []);

  // Action: Start Job (Accept Ticket)
  const handleAcceptJob = async () => {
    if (!selectedTicket) return;
    try {
      await api.put(`/tickets/update/${selectedTicket.id}`, {
        status: 'IN_PROGRESS',
        username: currentUser.username
      });
      setSelectedTicket(null); // Close email
      loadInbox(); // Refresh inbox (ticket will disappear)
    } catch (error) {
      alert("Error starting job");
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ color: '#0056b3', mb: 3 }}>
        Incoming Tickets ({tickets.length})
      </Typography>

      <Paper elevation={2}>
        {tickets.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
            <Typography variant="h6">Inbox is Empty</Typography>
            <p>No new tickets waiting for action.</p>
          </div>
        ) : (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {tickets.map((ticket, index) => (
              <React.Fragment key={ticket.id}>
                <ListItem 
                  alignItems="flex-start" 
                  button 
                  onClick={() => setSelectedTicket(ticket)}
                  sx={{ '&:hover': { backgroundColor: '#f0f7ff' } }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#d32f2f' }}>
                      <EmailIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {ticket.branchName} - {ticket.errorCategory}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(ticket.createdDate).toLocaleDateString()}
                        </Typography>
                      </div>
                    }
                    secondary={
                      <Typography variant="body2" color="text.primary" noWrap>
                        {ticket.errorType}: {ticket.description}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < tickets.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* --- EMAIL READER POPUP --- */}
      <Dialog open={Boolean(selectedTicket)} onClose={() => setSelectedTicket(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#f5f5f5' }}>
           <DraftsIcon color="primary"/> 
           Ticket Details #{selectedTicket?.id}
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          {selectedTicket && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip label={selectedTicket.branchName} color="primary" />
                    <Chip label="URGENT" color="error" size="small" variant="outlined"/>
                </div>
                
                <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                    <Typography variant="subtitle2" color="textSecondary">Category</Typography>
                    <Typography variant="body1" fontWeight="bold">{selectedTicket.errorCategory} &gt; {selectedTicket.errorType}</Typography>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2, minHeight: '100px' }}>
                    <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                    <Typography variant="body1">{selectedTicket.description}</Typography>
                </Paper>

                <Typography variant="caption" color="textSecondary">
                    Raised on: {new Date(selectedTicket.createdDate).toLocaleString()}
                </Typography>
            </div>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Button onClick={() => setSelectedTicket(null)}>Close</Button>
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<AssignmentIndIcon />}
            onClick={handleAcceptJob}
          >
            Accept & Start Job
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}