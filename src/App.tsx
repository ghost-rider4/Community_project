import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { MentorDashboard } from './pages/MentorDashboard';
import { Explore } from './pages/Explore';
import { Upload } from './pages/Upload';
import { Opportunities } from './pages/Opportunities';
import { Mentors } from './pages/Mentors';
import { Clubs } from './pages/Clubs';
import { Progress } from './pages/Progress';
import { Account } from './pages/Account';
import { Profile } from './pages/Profile';
import { Onboarding } from './pages/Onboarding';
import { MentorOnboarding } from './pages/MentorOnboarding';
import { TalentSelection } from './pages/TalentSelection';
import { PsychometricAssessment } from './pages/PsychometricAssessment';
import { Achievements } from './pages/Achievements';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <img 
        src="/image.png" 
        alt="ElevatED" 
        className="w-16 h-16 object-contain animate-pulse"
      />
      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading ElevatED...</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Determine onboarding route based on user role and completion status
  const getOnboardingRoute = () => {
    if (!user) return '/signin';
    
    if (!user.onboardingCompleted) {
      return user.role === 'mentor' ? '/mentor-onboarding' : '/onboarding';
    }
    
    if (!user.profileSetup) {
      return '/profile';
    }
    
    // Route to appropriate dashboard based on role
    return user.role === 'mentor' ? '/mentor-dashboard' : '/dashboard';
  };

  const getDashboardRoute = () => {
    if (!user) return '/signin';
    return user.role === 'mentor' ? '/mentor-dashboard' : '/dashboard';
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <main>
        <Routes>
          <Route path="/signin" element={!isAuthenticated ? <SignIn /> : <Navigate to={getOnboardingRoute()} replace />} />
          <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to={getOnboardingRoute()} replace />} />
          
          {/* Student Onboarding Routes */}
          <Route path="/onboarding" element={
            <ProtectedRoute requiredRole="student">
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/talent-selection" element={
            <ProtectedRoute requiredRole="student">
              <TalentSelection />
            </ProtectedRoute>
          } />
          <Route path="/psychometric-assessment" element={
            <ProtectedRoute requiredRole="student">
              <PsychometricAssessment />
            </ProtectedRoute>
          } />
          <Route path="/achievements" element={
            <ProtectedRoute requiredRole="student">
              <Achievements />
            </ProtectedRoute>
          } />

          {/* Mentor Onboarding Routes */}
          <Route path="/mentor-onboarding" element={
            <ProtectedRoute requiredRole="mentor">
              <MentorOnboarding />
            </ProtectedRoute>
          } />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="student">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/mentor-dashboard" element={
            <ProtectedRoute requiredRole="mentor">
              <MentorDashboard />
            </ProtectedRoute>
          } />

          {/* Shared Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              {isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <Navigate to="/signin" replace />}
            </ProtectedRoute>
          } />
          <Route path="/explore" element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute requiredRole="student">
              <Upload />
            </ProtectedRoute>
          } />
          <Route path="/opportunities" element={
            <ProtectedRoute>
              <Opportunities />
            </ProtectedRoute>
          } />
          <Route path="/mentors" element={
            <ProtectedRoute requiredRole="student">
              <Mentors />
            </ProtectedRoute>
          } />
          <Route path="/clubs" element={
            <ProtectedRoute>
              <Clubs />
            </ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute requiredRole="student">
              <Progress />
            </ProtectedRoute>
          } />
          <Route path="/account" element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;