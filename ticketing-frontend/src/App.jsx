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


// Helper: Guard that checks if user is logged in
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  // If no user, redirect to /login immediately
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Login Page (Open to everyone) */}
        <Route path="/login" element={<Login />} />

        {/* 2. Protected Routes (Must be logged in) */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            
            {/* If user opens root "/", check their role and redirect accordingly */}
            <Route index element={<RoleBasedRedirect />} />
            
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

// Small component to handle the root "/" redirect if they are already logged in
function RoleBasedRedirect() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.role === 'OPS') return <Navigate to="/dashboard" replace />;
  if (user?.role === 'BRANCH') return <Navigate to="/my-tickets" replace />;
  return <Navigate to="/login" replace />;
}

export default App;