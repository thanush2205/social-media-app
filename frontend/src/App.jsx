import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FeedPage from './pages/FeedPage';
import CreatePostPage from './pages/CreatePostPage';

// Full-screen loading state while the auth session is being restored.
function SplashScreen() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
}

// Guards routes that require a logged-in user.
function Protected({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

// If already logged in, visiting /login or /signup redirects to the feed.
function GuestOnly({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { loading } = useAuth();

  if (loading) return <SplashScreen />;

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
          <Route path="/signup" element={<GuestOnly><SignupPage /></GuestOnly>} />
          <Route
            path="/"
            element={
              <Protected>
                <FeedPage />
              </Protected>
            }
          />
          <Route
            path="/create"
            element={
              <Protected>
                <CreatePostPage />
              </Protected>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </>
  );
}