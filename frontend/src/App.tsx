import { Routes, Route, Navigate } from 'react-router-dom';
import { useLeads } from './hooks/useLeads';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { SavedLeadsPage } from './pages/SavedLeadsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const leadsState = useLeads();
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage leadsState={leadsState} /></ProtectedRoute>} />
      <Route path="/saved" element={<ProtectedRoute><SavedLeadsPage leadsState={leadsState} /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage leadsState={leadsState} /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}