import { Divider, Avatar, Button } from '@mui/material';
import { Dashboard, Bookmark, BarChart, Settings, Logout, AutoGraph } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

const W = 240;
const NAV = [
  { label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { label: 'Saved Leads', icon: <Bookmark />, path: '/saved' },
  { label: 'Analytics', icon: <BarChart />, path: '/analytics' },
  { label: 'Settings', icon: <Settings />, path: '/settings' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div style={{ width: W, flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', backgroundColor: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', zIndex: 1200 }}>

      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <AutoGraph style={{ color: '#6366f1', fontSize: 28 }} />
        <span style={{ fontWeight: 700, fontSize: 18, color: '#6366f1' }}>LeadEngine</span>
      </div>

      <Divider style={{ borderColor: '#334155' }} />

      <div style={{ padding: 8, flexGrow: 1 }}>
        {NAV.map((item) => {
          const active = location.pathname === item.path;
          return (
            <div key={item.path} onClick={() => navigate(item.path)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, marginBottom: 4, cursor: 'pointer', backgroundColor: active ? '#4f46e5' : 'transparent' }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLDivElement).style.backgroundColor = '#334155'; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'; }}
            >
              <span style={{ color: active ? '#c7d2fe' : '#94a3b8', display: 'flex' }}>{item.icon}</span>
              <span style={{ fontSize: 14, color: active ? '#fff' : '#cbd5e1', fontWeight: active ? 600 : 400 }}>{item.label}</span>
            </div>
          );
        })}
      </div>

      <Divider style={{ borderColor: '#334155' }} />

      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Avatar style={{ backgroundColor: '#6366f1', width: 32, height: 32, fontSize: 14 }}>
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </Avatar>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>{user?.email}</div>
          </div>
        </div>
        <Button fullWidth variant="outlined" size="small" color="error" startIcon={<Logout />} onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}