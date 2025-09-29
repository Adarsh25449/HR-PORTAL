
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import LeaveForm from './pages/LeaveForm';
import Attendance from './pages/Attendance';
import AdminDashboard from './pages/AdminDashboard'; 
import LeaveStatus from './pages/LeaveStatus';      

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/leave" element={<LeaveForm />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/admin" element={<AdminDashboard />} />     
      <Route path="/leave-status" element={<LeaveStatus />} /> 
    </Routes>
  );
}

export default App;






