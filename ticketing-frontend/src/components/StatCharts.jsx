import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Pie } from 'react-chartjs-2';
import { Box, Paper, Typography, Grid } from '@mui/material';

// Register the chart tools
ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatCharts({ tickets }) {
  
  // 1. Calculate Status Counts (Pending vs Completed)
  const statusCounts = { PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0 };
  tickets.forEach(t => {
    if (statusCounts[t.status] !== undefined) statusCounts[t.status]++;
  });

  // 2. Calculate Branch Counts (Gampaha vs Kandy etc.)
  const branchCounts = {};
  tickets.forEach(t => {
    branchCounts[t.branchName] = (branchCounts[t.branchName] || 0) + 1;
  });

  // Data for Status Chart (Doughnut)
  const statusData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [statusCounts.PENDING, statusCounts.IN_PROGRESS, statusCounts.COMPLETED],
        backgroundColor: ['#d32f2f', '#ed6c02', '#2e7d32'], // Red, Orange, Green
        borderWidth: 1,
      },
    ],
  };

  // Data for Branch Chart (Pie)
  const branchData = {
    labels: Object.keys(branchCounts),
    datasets: [
      {
        data: Object.values(branchCounts),
        backgroundColor: ['#1976d2', '#9c27b0', '#ff9800', '#009688'], // Blue, Purple, Orange, Teal
        borderWidth: 1,
      },
    ],
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Chart 1: Status */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>Ticket Status</Typography>
          <Box sx={{ width: '250px' }}>
            <Doughnut data={statusData} />
          </Box>
        </Paper>
      </Grid>

      {/* Chart 2: Branches */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>Tickets by Branch</Typography>
          <Box sx={{ width: '250px' }}>
            <Pie data={branchData} />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}