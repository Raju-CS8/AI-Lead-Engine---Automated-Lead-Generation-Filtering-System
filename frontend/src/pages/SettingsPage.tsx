import { Box, Typography, Paper, TextField, Button, Alert, Divider, Chip } from '@mui/material';
import { useState } from 'react';
import { Sidebar } from '../components/shared/Sidebar';
import { useAuth } from '../store/AuthContext';

const SW = 240;

export function SettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const rows = [
    { label: 'Data Source', node: <Chip label="OpenStreetMap" size="small" color="success" /> },
    { label: 'API Keys Required', node: <Chip label="None" size="small" color="success" /> },
    { label: 'Cost', node: <Chip label="100% Free" size="small" color="success" /> },
    { label: 'API URL', node: <Typography variant="body2">{import.meta.env.VITE_API_BASE_URL}</Typography> },
  ];

  return (
    <Box style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <Sidebar />
      <Box style={{ flexGrow: 1, marginLeft: SW, padding: 24, maxWidth: 640 }}>
        <Typography variant="h5" style={{ fontWeight: 700, marginBottom: 24 }}>Settings</Typography>
        <Paper style={{ padding: 24, marginBottom: 24 }}>
          <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 16 }}>Profile</Typography>
          <TextField fullWidth label="Name" defaultValue={user?.name} style={{ marginBottom: 16 }} />
          <TextField fullWidth label="Email" defaultValue={user?.email} style={{ marginBottom: 16 }} />
          <Button variant="contained" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
            Save Changes
          </Button>
          {saved && <Alert severity="success" style={{ marginTop: 16 }}>Saved</Alert>}
        </Paper>
        <Paper style={{ padding: 24 }}>
          <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 8 }}>System Info</Typography>
          <Divider style={{ marginBottom: 16 }} />
          {rows.map((r) => (
            <Box key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Typography variant="body2" style={{ color: '#94a3b8' }}>{r.label}</Typography>
              {r.node}
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
}