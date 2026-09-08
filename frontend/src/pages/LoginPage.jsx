import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Link,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Forum as ForumIcon,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/client';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 420,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <ForumIcon color="primary" sx={{ fontSize: 44 }} />
          <Typography variant="h5" fontWeight={800} letterSpacing={-0.5}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Log in to see what everyone is talking about.
          </Typography>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" /></InputAdornment> }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" aria-label="Toggle password visibility">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" size="large" disabled={submitting}>
              {submitting ? 'Logging in...' : 'Log in'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ mt: 2.5, textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} to="/signup" fontWeight={700}>
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}