import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, 
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Backdrop, CircularProgress, Snackbar, Alert 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import api from '../api/axiosConfig';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // --- 1. NEW STATES FOR UX ---
  const [loading, setLoading] = useState(false); // Controls the spinner
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' }); // Controls the popup

  const [currentUser, setCurrentUser] = useState({
    id: '', username: '', password: '', role: 'BRANCH', branchName: ''
  });

  // Helper to show messages
  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  // Load Users
  const fetchUsers = async () => {
    setLoading(true); // Start Spinner
    try {
      const res = await api.get('/users/all');
      setUsers(res.data);
    } catch (error) {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false); // Stop Spinner (whether success or fail)
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpenAdd = () => {
    setEditMode(false);
    setCurrentUser({ id: '', username: '', password: '', role: 'BRANCH', branchName: '' });
    setOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditMode(true);
    setCurrentUser(user);
    setOpen(true);
  };

  // Handle Save (Add/Edit)
  const handleSave = async () => {
    setLoading(true); // Start Spinner
    try {
      if (editMode) {
        await api.put(`/users/update/${currentUser.id}`, currentUser);
        showToast("User updated successfully!", "success");
      } else {
        // Remove empty ID for create
        const { id, ...userToSend } = currentUser; 
        await api.post('/users/create', userToSend);
        showToast("User created successfully!", "success");
      }
      setOpen(false);
      fetchUsers(); 
    } catch (error) {
      console.error("Save failed:", error);
      showToast("Error saving user. Check data.", "error");
    } finally {
      setLoading(false); // Stop Spinner
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setLoading(true);
      try {
        await api.delete(`/users/delete/${id}`);
        showToast("User deleted successfully", "success");
        fetchUsers();
      } catch (error) {
        showToast("Failed to delete user", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      
      {/* --- 2. LOADING SPINNER (Overlay) --- */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* --- 3. POP-UP MESSAGE (Snackbar) --- */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={6000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Shows at bottom-right
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Typography variant="h4" color="primary">Manage Users</Typography>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={handleOpenAdd}>
          Add User
        </Button>
      </div>

      <Paper elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#eee' }}>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                    {user.role === 'OPS' ? 
                        <Typography color="primary" fontWeight="bold">Admin</Typography> : 
                        "Branch User"}
                </TableCell>
                <TableCell>{user.branchName || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenEdit(user)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(user.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog Form */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editMode ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400, mt: 1 }}>
          <TextField label="Username" fullWidth value={currentUser.username} onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})} />
          <TextField label="Password" fullWidth value={currentUser.password} onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})} />
          <TextField select label="Role" fullWidth value={currentUser.role} onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}>
            <MenuItem value="BRANCH">Branch User</MenuItem>
            <MenuItem value="OPS">Operations (Admin)</MenuItem>
          </TextField>
          {currentUser.role === 'BRANCH' && (
            <TextField select label="Branch Name" fullWidth value={currentUser.branchName} onChange={(e) => setCurrentUser({...currentUser, branchName: e.target.value})}>
               {['Gampaha', 'Kandy', 'Galle', 'Nugegoda'].map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}