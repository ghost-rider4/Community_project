import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
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
    
    return '/dashboard';
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      <main>
        <Routes>
          <Route path="/signin" element={!isAuthenticated ? <SignIn /> : <Navigate to={getOnboardingRoute()} replace />} />
          <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to={getOnboardingRoute()} replace />} />
          <Route path="/onboarding" element={isAuthenticated && user?.role === 'student' ? <Onboarding /> : <Navigate to="/signin" replace />} />
          <Route path="/mentor-onboarding" element={isAuthenticated && user?.role === 'mentor' ? <MentorOnboarding /> : <Navigate to="/signin" replace />} />
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/signin" replace />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" replace />} />
          <Route path="/explore" element={isAuthenticated ? <Explore /> : <Navigate to="/signin" replace />} />
          <Route path="/upload" element={isAuthenticated ? <Upload /> : <Navigate to="/signin" replace />} />
          <Route path="/opportunities" element={isAuthenticated ? <Opportunities /> : <Navigate to="/signin" replace />} />
          <Route path="/mentors" element={isAuthenticated ? <Mentors /> : <Navigate to="/signin" replace />} />
          <Route path="/clubs" element={isAuthenticated ? <Clubs /> : <Navigate to="/signin" replace />} />
          <Route path="/progress" element={isAuthenticated ? <Progress /> : <Navigate to="/signin" replace />} />
          <Route path="/account" element={isAuthenticated ? <Account /> : <Navigate to="/signin" replace />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/signin" replace />} />
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