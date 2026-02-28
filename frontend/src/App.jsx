import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HairstylePage from './pages/HairstylePage';
import SalonPage from './pages/SalonPage';
import SchedulePage from './pages/SchedulePage';
import AppointmentsPage from './pages/AppointmentsPage';
import LandingPage from './pages/LandingPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: 24 }}>✨</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/hairstyles" /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/hairstyles" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/hairstyles" /> : <RegisterPage />} />
        <Route path="/hairstyles" element={<ProtectedRoute><HairstylePage /></ProtectedRoute>} />
        <Route path="/salons" element={<ProtectedRoute><SalonPage /></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
