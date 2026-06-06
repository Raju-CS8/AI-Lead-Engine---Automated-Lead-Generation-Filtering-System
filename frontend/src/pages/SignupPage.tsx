import { Box, Paper, Typography, TextField, Button, Link, Alert } from '@mui/material';
import { AutoGraph } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSignup() {
    if (!name || !email || !password) { setError('All fields required'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    login(email, name);
    navigate('/dashboard');
  }

  return (
    <Box style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={4} style={{ padding: 32, width: '100%', maxWidth: 420, borderRadius: 12 }}>
        <Box style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <AutoGraph style={{ color: '#6366f1', fontSize: 36 }} />
          <Typography variant="h5" style={{ fontWeight: 700, color: '#6366f1' }}>LeadEngine</Typography>
        </Box>
        <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 4 }}>Create Account</Typography>
        <Typography variant="body2" style={{ color: '#94a3b8', marginBottom: 24 }}>Start finding leads in 60 seconds</Typography>
        {error && <Alert severity="error" style={{ marginBottom: 16 }}>{error}</Alert>}
        <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: 16 }} />
        <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: 16 }} />
        <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginBottom: 24 }} />
        <Button fullWidth variant="contained" size="large" onClick={handleSignup} style={{ marginBottom: 16 }}>Create Account</Button>
        <Typography variant="body2" style={{ textAlign: 'center' }}>
          Already have an account?{' '}
          <Link component={RouterLink} to="/login">Sign in</Link>
        </Typography>
      </Paper>
    </Box>
  );
}