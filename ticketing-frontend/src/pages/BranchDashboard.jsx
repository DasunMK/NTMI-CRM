import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function BranchDashboard() {
  const [tickets, setTickets] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tickets ONLY for this branch
    // Note: You might need to update Backend TicketController to support this filter
    // For now, let's fetch all and filter in JS (Simple way)
    api.get('/tickets/all').then(res => {
        if(user.role === 'OPS') {
             setTickets(res.data);
        } else {
             // Filter: Show only MY branch tickets
             const myTickets = res.data.filter(t => t.branchName === user.branchName);
             setTickets(myTickets);
        }
    });
  }, []);

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Typography variant="h4">My Branch Tickets ({user.branchName})</Typography>
          <Button variant="contained" onClick={() => navigate('/create')}>+ Raise New Ticket</Button>
      </div>

      <Paper elevation={2}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#f5f5f5' }}>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Issue</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                    <Typography variant="subtitle2">{row.errorCategory}</Typography>
                    <Typography variant="caption">{row.errorType}</Typography>
                </TableCell>
                <TableCell>{new Date(row.createdDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    color={row.status === 'COMPLETED' ? 'success' : row.status === 'IN_PROGRESS' ? 'warning' : 'error'} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}