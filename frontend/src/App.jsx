import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import FindNGOs from './pages/FindNGOs';
import OrganizationDetails from './pages/OrganizationDetails';
import VolunteerRecommendations from './pages/VolunteerRecommendations';
import EventBooking from './pages/EventBooking';
import DonationPage from './pages/DonationPage';
import Certificates from './pages/Certificates';
import NgoDashboard from './pages/NgoDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['volunteer']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ngos" 
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                <FindNGOs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orgs/:id" 
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                <OrganizationDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recommendations" 
            element={
              <ProtectedRoute allowedRoles={['volunteer']}>
                <VolunteerRecommendations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events" 
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'organization', 'admin']}>
                <EventBooking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/donate" 
            element={
              <ProtectedRoute allowedRoles={['volunteer']}>
                <DonationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/certificates" 
            element={
              <ProtectedRoute allowedRoles={['volunteer']}>
                <Certificates />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ngo-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['organization']}>
                <NgoDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/submit-complaint" 
            element={
              <ProtectedRoute allowedRoles={['volunteer', 'organization']}>
                <SubmitComplaint />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
