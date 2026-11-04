import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import EventDetails from './pages/EventDetails';
import MyRegistrations from './pages/MyRegistrations';
import AdminDashboard from './pages/AdminDashboard';
import AdminEvents from './pages/AdminEvents';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#000',
              color: '#fff',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#fff', secondary: '#000' },
            },
            error: {
              style: {
                background: '#171717',
                color: '#fff',
              },
            },
          }}
        />
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/events/:id" element={
            <ProtectedRoute><EventDetails /></ProtectedRoute>
          } />
          <Route path="/my-registrations" element={
            <ProtectedRoute><MyRegistrations /></ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/events" element={
            <ProtectedRoute adminOnly><AdminEvents /></ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
