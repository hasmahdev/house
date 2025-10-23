import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga4';
import { AuthContext } from './context/AuthContext';
import { CacheBusterProvider } from './context/CacheBusterContext.jsx';
import Home from './pages/Home.jsx';
import Weeks from './pages/Weeks.jsx';
import WeekDetail from './pages/WeekDetail.jsx';
import Login from './pages/Login.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AppLayout from './layouts/AppLayout.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';

// Admin Pages
import AdminIndexRedirect from './pages/admin/AdminIndexRedirect.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import WeekManagement from './pages/admin/WeekManagement.jsx';
import PointsManagement from './pages/admin/PointsManagement.jsx';
import Analytics from './pages/admin/Analytics.jsx';

// Student Pages
import StudentPoints from './pages/student/StudentPoints.jsx';

const App = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (gaMeasurementId) {
      ReactGA.initialize(gaMeasurementId);
    }
  }, []);

  useEffect(() => {
    const path = location.pathname;
    let title;

    const keyMap = {
      '/login': 'Login',
      '/weeks': 'Weeks',
      '/leaderboard': 'Leaderboard',
      '/dashboard': 'Dashboard',
      '/admin': 'Admin Panel',
    };

    if (path === '/') {
      title = 'مشروع غرس';
    } else {
      const pageKey = Object.keys(keyMap).find(key => path.startsWith(key));
      const pageName = pageKey ? t(keyMap[pageKey]) : t('Ghars');
      title = `غرس - ${pageName}`;
    }

    document.title = title;
  }, [location, t]);

  return (
    <CacheBusterProvider>
      <Routes>
        {/* Standalone Login Page */}
        <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} /> : <Login />} />

        {/* Main application layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/weeks" element={<Weeks />} />
          <Route path="/weeks/:id" element={<WeekDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Protected Routes for Students */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/dashboard" element={<StudentPoints />} />
          </Route>
        </Route>

        {/* Protected Routes for Admin */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminIndexRedirect />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="weeks" element={<WeekManagement />} />
            <Route path="points" element={<PointsManagement />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </CacheBusterProvider>
  );
};

export default App;
