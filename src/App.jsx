import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { sendWelcomeEmail } from './services/monitorService';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BusinessAnalytics from './pages/BusinessAnalytics';
import IncidentDetails from './pages/IncidentDetails';
import Incidents from './pages/Incidents';
import About from './pages/About';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import StatusPage from './pages/StatusPage';
import MonitorTypePage from './pages/MonitorTypePage';
import ResourcePage from './pages/ResourcePage';
import ToolPage from './pages/ToolPage';
import Register from './pages/Register';

// Layout wrapper for authenticated pages
const AppLayout = ({ children }) => (
  <div className="flex bg-slate-50 min-h-screen">
    <Sidebar />
    <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
      {children}
    </main>
  </div>
);

// Protected Route Logic
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Send welcome email on first-ever login
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const welcomeKey = `sentinel_welcome_${user.email}`;
      if (!localStorage.getItem(welcomeKey)) {
        sendWelcomeEmail({ email: user.email, name: user.email.split('@')[0] })
          .then((response) => {
            if (response && response.includes('sent')) {
              localStorage.setItem(welcomeKey, 'true');
              console.log('Welcome email sent successfully');
            }
          })
          .catch(err => {
            console.error('Welcome email failed, will retry next login:', err);
          });
      }
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/monitor/:type" element={<MonitorTypePage />} />
        <Route path="/resources/:slug" element={<ResourcePage />} />
        <Route path="/tools/:slug" element={<ToolPage />} />

        {/* Auth Pages */}
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <AppLayout><Dashboard /></AppLayout>
          </PrivateRoute>
        } />

        {/* Protected Business Intelligence */}
        <Route path="/analytics" element={
          <PrivateRoute>
            <AppLayout><BusinessAnalytics /></AppLayout>
          </PrivateRoute>
        } />

        {/* Incidents List */}
        <Route path="/incidents" element={
          <PrivateRoute>
            <AppLayout><Incidents /></AppLayout>
          </PrivateRoute>
        } />

        {/* Dynamic Incident Detail */}
        <Route path="/incidents/:id" element={
          <PrivateRoute>
            <AppLayout><IncidentDetails /></AppLayout>
          </PrivateRoute>
        } />

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;