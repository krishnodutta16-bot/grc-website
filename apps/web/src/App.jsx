import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';

import HomePage from '@/pages/HomePage.jsx';
import WorkshopsPage from '@/pages/WorkshopsPage.jsx';
import WorkshopDetailPage from '@/pages/WorkshopDetailPage.jsx';
import PartnersPage from '@/pages/PartnersPage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import PasswordResetPage from '@/pages/PasswordResetPage.jsx';
import ResearcherDashboard from '@/pages/ResearcherDashboard.jsx';
import CertificateVerificationPage from '@/pages/CertificateVerificationPage.jsx';
import NewsPage from '@/pages/NewsPage.jsx';
import NewsDetailPage from '@/pages/NewsDetailPage.jsx';
import ResearchPage from '@/pages/ResearchPage.jsx';
import ResearchDetailPage from '@/pages/ResearchDetailPage.jsx';

import AdminDashboard from '@/pages/AdminDashboard.jsx';
import AdminPartnerManagement from '@/pages/AdminPartnerManagement.jsx';
import AdminWorkshopManagement from '@/pages/AdminWorkshopManagement.jsx';
import AdminUserManagement from '@/pages/AdminUserManagement.jsx';
import AdminEnrollmentManagement from '@/pages/AdminEnrollmentManagement.jsx';
import AdminCertificateManagement from '@/pages/AdminCertificateManagement.jsx';
import AdminNewsManagement from '@/pages/AdminNewsManagement.jsx';
import AdminResearchManagement from '@/pages/AdminResearchManagement.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workshops" element={<WorkshopsPage />} />
          <Route path="/workshops/:id" element={<WorkshopDetailPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/password-reset" element={<PasswordResetPage />} />
          <Route path="/verify-certificate" element={<CertificateVerificationPage />} />
          
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/research/:id" element={<ResearchDetailPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <ResearcherDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/partners" 
            element={
              <ProtectedRoute adminOnly>
                <AdminPartnerManagement />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/workshops" 
            element={
              <ProtectedRoute adminOnly>
                <AdminWorkshopManagement />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute adminOnly>
                <AdminUserManagement />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/enrollments" 
            element={
              <ProtectedRoute adminOnly>
                <AdminEnrollmentManagement />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/certificates" 
            element={
              <ProtectedRoute adminOnly>
                <AdminCertificateManagement />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/news" 
            element={
              <ProtectedRoute adminOnly>
                <AdminNewsManagement />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/research" 
            element={
              <ProtectedRoute adminOnly>
                <AdminResearchManagement />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;