import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import SupabaseSetupBanner from './components/common/SupabaseSetupBanner';

// Pages
import HomePage from './pages/HomePage';
import AlumniDirectoryPage from './pages/AlumniDirectoryPage';
import AlumniProfilePage from './pages/AlumniProfilePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfileEditPage from './pages/ProfileEditPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-[#F8F9FA] text-[#202124]">
          {/* Informative setup notice */}
          <SupabaseSetupBanner />

          {/* Section 1: Header / Navbar */}
          <Navbar />

          {/* Main View Area */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/alumni" element={<AlumniDirectoryPage />} />
              <Route path="/alumni/:slug" element={<AlumniProfilePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile/edit" element={<ProfileEditPage />} />
              <Route path="/settings" element={<AccountSettingsPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Section 8: Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
