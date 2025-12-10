import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, TextField, Button, List, ListItem, ListItemText, 
  IconButton, Grid, Divider, MenuItem, Select, FormControl, InputLabel, Chip 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../api/axiosConfig';

export default function AdminSettings() {
  const [settings, setSettings] = useState({ branches: [], errorCategories: [], errorTypes: [] });
  
  // Inputs
  const [newBranch, setNewBranch] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newType, setNewType] = useState({ name: '', category: '' });

  // Load
  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchSettings(); }, []);

  // --- ACTIONS ---
  
  // Branches
  const addBranch = async () => {
    if(!newBranch) return;
    await api.post('/settings/branch', { value: newBranch });
    setNewBranch(''); fetchSettings();
  };
  const deleteBranch = async (name) => {
    await api.delete(`/settings/branch/${name}`);
    fetchSettings();
  };

  // Categories
  const addCategory = async () => {
    if(!newCategory) return;
    await api.post('/settings/category', { value: newCategory });
    setNewCategory(''); fetchSettings();
  };
  const deleteCategory = async (name) => {
    await api.delete(`/settings/category/${name}`);
    fetchSettings();
  };

  // Error Types (Complex)
  const addType = async () => {
    if(!newType.name || !newType.category) return;
    await api.post('/settings/type', newType);
    setNewType({ name: '', category: '' }); 
    fetchSettings();
  };
  const deleteType = async (name) => {
    await api.delete(`/settings/type/${name}`);
    fetchSettings();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
        System Configuration
      </Typography>

      <Grid container spacing={3}>
        
        {/* 1. BRANCHES MANAGER */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6">Manage Branches</Typography>
            <Divider sx={{ my: 2 }} />
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <TextField size="small" label="New Branch" value={newBranch} onChange={(e)=>setNewBranch(e.target.value)} fullWidth />
              <Button variant="contained" onClick={addBranch}><AddIcon/></Button>
            </div>
            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
              {settings.branches?.map((b) => (
                <ListItem key={b} secondaryAction={
                  <IconButton edge="end" color="error" onClick={()=>deleteBranch(b)}><DeleteIcon /></IconButton>
                }>
                  <ListItemText primary={b} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* 2. CATEGORIES MANAGER */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6">Error Categories</Typography>
            <Divider sx={{ my: 2 }} />
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <TextField size="small" label="New Category" value={newCategory} onChange={(e)=>setNewCategory(e.target.value)} fullWidth />
              <Button variant="contained" onClick={addCategory}><AddIcon/></Button>
            </div>
            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
              {settings.errorCategories?.map((c) => (
                <ListItem key={c} secondaryAction={
                  <IconButton edge="end" color="error" onClick={()=>deleteCategory(c)}><DeleteIcon /></IconButton>
                }>
                  <ListItemText primary={c} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* 3. ERROR TYPES MANAGER (Linked) */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6">Error Types</Typography>
            <Divider sx={{ my: 2 }} />
            
            {/* Add Type Form */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select label="Category" value={newType.category} onChange={(e)=>setNewType({...newType, category: e.target.value})}>
                {settings.errorCategories?.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <TextField size="small" label="New Type Name" value={newType.name} onChange={(e)=>setNewType({...newType, name: e.target.value})} fullWidth />
              <Button variant="contained" onClick={addType}><AddIcon/></Button>
            </div>

            {/* List */}
            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
              {settings.errorTypes?.map((t) => (
                <ListItem key={t.name} secondaryAction={
                  <IconButton edge="end" color="error" onClick={()=>deleteType(t.name)}><DeleteIcon /></IconButton>
                }>
                  <ListItemText primary={t.name} secondary={
                      <Chip label={t.category} size="small" color="primary" variant="outlined" />
                  } />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
}