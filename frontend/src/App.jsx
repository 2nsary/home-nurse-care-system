import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Notification from './components/Notification';
import Loader from './components/Loader';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/patient/PatientDashboard';
import NurseSearch from './pages/patient/NurseSearch';
import BookingPage from './pages/patient/BookingPage';
import BookingHistory from './pages/patient/BookingHistory';
import PaymentPage from './pages/patient/PaymentPage';
import NurseDashboard from './pages/nurse/NurseDashboard';
import ManageSchedule from './pages/nurse/ManageSchedule';
import NurseProfile from './pages/nurse/NurseProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import Reports from './pages/admin/Reports';

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <Navbar />
      <main className="dashboard-content">{children}</main>
    </div>
  );
}

export default function App() {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (loading) return <Loader text="Loading application..." />;

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);
  const showDashboard = isAuthenticated && !isPublicPage;

  return (
    <>
      <Notification />
      {showDashboard ? (
        <DashboardLayout>
          <Routes>
            {/* Patient */}
            <Route path="/patient" element={<ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute>} />
            <Route path="/patient/search" element={<ProtectedRoute roles={['patient']}><NurseSearch /></ProtectedRoute>} />
            <Route path="/patient/book/:nurseId" element={<ProtectedRoute roles={['patient']}><BookingPage /></ProtectedRoute>} />
            <Route path="/patient/bookings" element={<ProtectedRoute roles={['patient']}><BookingHistory /></ProtectedRoute>} />
            <Route path="/patient/payments" element={<ProtectedRoute roles={['patient']}><PaymentPage /></ProtectedRoute>} />
            {/* Nurse */}
            <Route path="/nurse" element={<ProtectedRoute roles={['nurse']}><NurseDashboard /></ProtectedRoute>} />
            <Route path="/nurse/schedule" element={<ProtectedRoute roles={['nurse']}><ManageSchedule /></ProtectedRoute>} />
            <Route path="/nurse/profile" element={<ProtectedRoute roles={['nurse']}><NurseProfile /></ProtectedRoute>} />
            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><Reports /></ProtectedRoute>} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to={`/${user?.role || ''}`} replace />} />
          </Routes>
        </DashboardLayout>
      ) : (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to={`/${user.role}`} replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to={`/${user.role}`} replace /> : <Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  );
}
