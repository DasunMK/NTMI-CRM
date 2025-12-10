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

// --- 1. VALIDATION REGEX ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // UX States
  const [loading, setLoading] = useState(false); 
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' }); 

  // --- 2. UPDATED STATE WITH NEW FIELDS ---
  const [currentUser, setCurrentUser] = useState({
    id: '', 
    username: '', 
    password: '', 
    role: 'BRANCH', 
    branchName: '',
    fullName: '',  // New
    email: '',     // New
    phone: ''      // New
  });

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const fetchUsers = async () => {
    setLoading(true); 
    try {
      const res = await api.get('/users/all');
      setUsers(res.data);
    } catch (error) {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpenAdd = () => {
    setEditMode(false);
    // Reset all fields
    setCurrentUser({ 
        id: '', username: '', password: '', role: 'BRANCH', branchName: '', 
        fullName: '', email: '', phone: '' 
    });
    setOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditMode(true);
    setCurrentUser(user);
    setOpen(true);
  };

  // --- 3. SAVE WITH VALIDATION ---
  const handleSave = async () => {
    // A. VALIDATION CHECKS
    if (!currentUser.username || !currentUser.password || !currentUser.fullName) {
      showToast("Please fill in all required fields (Name, User, Pass)", "error");
      return;
    }
    if (currentUser.email && !emailRegex.test(currentUser.email)) {
      showToast("Invalid Email Address", "error");
      return;
    }
    if (currentUser.phone && !phoneRegex.test(currentUser.phone)) {
      showToast("Phone number must be exactly 10 digits", "error");
      return;
    }

    // B. SEND TO BACKEND
    setLoading(true); 
    try {
      if (editMode) {
        await api.put(`/users/update/${currentUser.id}`, currentUser);
        showToast("User updated successfully!", "success");
      } else {
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
      setLoading(false); 
    }
  };

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
      
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={6000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
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
              <TableCell>Full Name</TableCell> {/* Changed from Username to Full Name for better display */}
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName || "N/A"}</TableCell>
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

      {/* --- 4. UPDATED DIALOG FORM --- */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          
          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>Login Details</Typography>
          <div style={{ display: 'flex', gap: 10 }}>
             <TextField required label="Username" fullWidth size="small" value={currentUser.username} onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})} />
             <TextField required label="Password" type="password" fullWidth size="small" value={currentUser.password} onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})} />
          </div>

          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold', mt: 1 }}>Personal Info</Typography>
          <TextField required label="Full Name" fullWidth size="small" value={currentUser.fullName} onChange={(e) => setCurrentUser({...currentUser, fullName: e.target.value})} />
          
          <div style={{ display: 'flex', gap: 10 }}>
             <TextField label="Email" fullWidth size="small" value={currentUser.email} onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})} />
             <TextField label="Phone (10 digits)" fullWidth size="small" value={currentUser.phone} onChange={(e) => setCurrentUser({...currentUser, phone: e.target.value})} />
          </div>

          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold', mt: 1 }}>Role & Branch</Typography>
          <div style={{ display: 'flex', gap: 10 }}>
            <TextField select label="Role" fullWidth size="small" value={currentUser.role} onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}>
                <MenuItem value="BRANCH">Branch User</MenuItem>
                <MenuItem value="OPS">Operations (Admin)</MenuItem>
            </TextField>
            
            {/* Show Branch ONLY if Role is BRANCH */}
            {currentUser.role === 'BRANCH' && (
                <TextField select label="Branch Name" fullWidth size="small" value={currentUser.branchName} onChange={(e) => setCurrentUser({...currentUser, branchName: e.target.value})}>
                {['Gampaha', 'Kandy', 'Galle', 'Nugegoda'].map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                </TextField>
            )}
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save User"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}