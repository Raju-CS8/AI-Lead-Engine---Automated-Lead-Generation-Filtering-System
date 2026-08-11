import { Paper, Typography, TextField, Button, Link, Alert } from '@mui/material';
import { AutoGraph } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email || !password) { setError('Please enter email and password'); return; }
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Login failed');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Paper elevation={4} style={{ padding: 32, width: '100%', maxWidth: 420, borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <AutoGraph style={{ color: '#6366f1', fontSize: 36 }} />
          <span style={{ fontWeight: 700, fontSize: 22, color: '#6366f1' }}>LeadEngine</span>
        </div>

        <p style={{ fontWeight: 600, fontSize: 20, margin: '0 0 4px 0', color: '#f1f5f9' }}>Sign In</p>
        <p style={{ color: '#94a3b8', margin: '0 0 24px 0', fontSize: 14 }}>
          Find high-value leads in seconds
        </p>

        {error && (
          <Alert severity="error" style={{ marginBottom: 16 }}>{error}</Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
          style={{ marginBottom: 24 }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleLogin}
          style={{ marginBottom: 16 }}
        >
          Sign In
        </Button>

        <p style={{ textAlign: 'center', fontSize: 14, margin: 0, color: '#94a3b8' }}>
          Don't have an account?{' '}
          <Link component={RouterLink} to="/signup">Sign up</Link>
        </p>
      </Paper>
    </div>
  );
}