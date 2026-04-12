import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FindNGOs from './pages/FindNGOs';
import OrganizationDetails from './pages/OrganizationDetails';
import VolunteerRecommendations from './pages/VolunteerRecommendations';
import EventBooking from './pages/EventBooking';
import DonationPage from './pages/DonationPage';
import Certificates from './pages/Certificates';
import ImpactDashboard from './pages/ImpactDashboard';
import NgoDashboard from './pages/NgoDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import ProtectedRoute from './components/ProtectedRoute';
import SOSButton from './components/SOSButton';
import Chatbot from './components/Chatbot';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';
import SkillDevelopment from './pages/SkillDevelopment';
import BeneficiaryDashboard from './pages/BeneficiaryDashboard';
import VerifyOtp from './pages/VerifyOtp';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" reverseOrder={false} />
        <SOSButton />
        <Chatbot />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ngos" 
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <FindNGOs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orgs/:id" 
            element={
              <ProtectedRoute allowedRoles={['user', 'admin']}>
                <OrganizationDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recommendations" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <VolunteerRecommendations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events" 
            element={
              <ProtectedRoute allowedRoles={['user', 'ngo', 'organization', 'admin']}>
                <EventBooking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/donate" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <DonationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/certificates" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Certificates />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ngo-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ngo', 'organization']}>
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
            path="/beneficiary-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <BeneficiaryDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/impact" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <ImpactDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/skills" 
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <SkillDevelopment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/submit-complaint" 
            element={
              <ProtectedRoute allowedRoles={['user', 'ngo', 'organization']}>
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
