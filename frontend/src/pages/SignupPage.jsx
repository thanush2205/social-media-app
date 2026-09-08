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
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Forum as ForumIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/client';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!name.trim() || !email.trim() || !password) {
      return 'Please fill in all fields';
    }
    if (name.trim().length < 2) {
      return 'Name is too short';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      await signup(name.trim(), email.trim(), password);
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
          maxWidth: 440,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <ForumIcon color="primary" sx={{ fontSize: 44 }} />
          <Typography variant="h5" fontWeight={800} letterSpacing={-0.5}>
            Join SparksHub
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create an account and share your thoughts with the world.
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
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" /></InputAdornment> }}
            />
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
              error={!!password && password.length > 0 && password.length < 6}
              helperText={password && password.length > 0 && password.length < 6 ? 'Minimum 6 characters' : ''}
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
            <TextField
              fullWidth
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!confirmPassword && confirmPassword !== password}
              helperText={confirmPassword && confirmPassword !== password ? 'Passwords do not match' : ''}
              InputProps={{ startAdornment: <InputAdornment position="start"><CheckIcon fontSize="small" /></InputAdornment> }}
            />
            <Button type="submit" variant="contained" size="large" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Create account'}
            </Button>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ mt: 2.5, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" fontWeight={700}>
            Log in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}