import React from 'react';
import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupIcon from '@mui/icons-material/Group'; // <--- 1. NEW IMPORT
import { useNavigate, Outlet } from 'react-router-dom';

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
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            NTMI Ticketing System
          </Typography>
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

                {/* NEW: MAILBOX BUTTON */}
                <ListItem button onClick={() => navigate('/inbox')}>
                  <ListItemIcon><MailIcon /></ListItemIcon>
                  <ListItemText primary="Inbox (New Tickets)" />
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
        {/* Router injects content here */}
        <Outlet /> 
      </Box>
    </Box>
  );
}