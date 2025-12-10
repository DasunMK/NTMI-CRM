import React from 'react';
import { 
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Button, Avatar 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupIcon from '@mui/icons-material/Group';
import MailIcon from '@mui/icons-material/Mail'; // Mailbox Icon
import { useNavigate, Outlet } from 'react-router-dom';

// 1. IMPORT THE LOGO
import logoImg from '../assets/logo.png'; 

const drawerWidth = 240;

export default function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Top Header */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#1976d2' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          
          {/* 2. LOGO + TITLE SECTION */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img 
              src={logoImg} 
              alt="NTMI Logo" 
              style={{ 
                height: '40px', // Adjust height to fit the bar
                width: 'auto',
                backgroundColor: 'white', // Optional: White background if logo is transparent
                padding: '4px',
                borderRadius: '4px' 
              }} 
            />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
              NTMI Ticketing System
            </Typography>
          </Box>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Typography variant="body2">
              {user ? `${user.username} (${user.role})` : 'Guest'}
            </Typography>
            <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      {/* Sidebar Menu */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            
            {/* --- ADMIN (OPS) MENU --- */}
            {user?.role === 'OPS' && (
              <>
                <ListItem button onClick={() => navigate('/dashboard')}>
                  <ListItemIcon><DashboardIcon /></ListItemIcon>
                  <ListItemText primary="Ops Dashboard" />
                </ListItem>
                
                <ListItem button onClick={() => navigate('/inbox')}>
                  <ListItemIcon><MailIcon /></ListItemIcon>
                  <ListItemText primary="Inbox (New)" />
                </ListItem>
                
                <ListItem button onClick={() => navigate('/users')}>
                  <ListItemIcon><GroupIcon /></ListItemIcon>
                  <ListItemText primary="Manage Users" />
                </ListItem>

                <ListItem button onClick={() => navigate('/settings')}>
                  <ListItemIcon><SettingsIcon /></ListItemIcon>
                  <ListItemText primary="Admin Settings" />
                </ListItem>
              </>
            )}

            {/* --- BRANCH MENU --- */}
            {user?.role === 'BRANCH' && (
              <>
                <ListItem button onClick={() => navigate('/my-tickets')}>
                  <ListItemIcon><ListAltIcon /></ListItemIcon>
                  <ListItemText primary="My Tickets" />
                </ListItem>
                
                <ListItem button onClick={() => navigate('/create')}>
                  <ListItemIcon><AddCircleIcon /></ListItemIcon>
                  <ListItemText primary="Raise Ticket" />
                </ListItem>
              </>
            )}

          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet /> 
      </Box>
    </Box>
  );
}