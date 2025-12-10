import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import Login from './pages/Login';
import BranchDashboard from './pages/BranchDashboard';
import AdminSettings from './pages/AdminSettings';
import UserManagement from './pages/UserManagement';
import TicketInbox from './pages/TicketInbox';
import ForgotPassword from './pages/ForgotPassword'; // Import this

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES (No Login Required) --- */}
        <Route path="/login" element={<Login />} />
        
        {/* MOVED HERE: This must be outside the PrivateRoute! */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* --- PROTECTED ROUTES (Login Required) --- */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />       
            <Route path="create" element={<CreateTicket />} />       
            <Route path="my-tickets" element={<BranchDashboard />} /> 
            <Route path="settings" element={<AdminSettings />} />    
            <Route path="users" element={<UserManagement />} />
            <Route path="inbox" element={<TicketInbox />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;