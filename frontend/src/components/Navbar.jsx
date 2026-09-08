import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  Home as HomeIcon,
  AddBox as AddIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Forum as ForumIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useColorMode } from '../context/ColorModeContext';
import UserAvatar from './UserAvatar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { mode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: (t) =>
          t.palette.mode === 'dark' ? 'rgba(15,17,23,0.85)' : 'rgba(255,255,255,0.85)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ maxWidth: 720, width: '100%', margin: '0 auto', px: 2 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1, mr: 'auto' }}
          onClick={() => navigate('/')}
        >
          <ForumIcon color="primary" />
          <Typography variant="h6" fontWeight={800} letterSpacing={-0.5}>
            ConnectHub
          </Typography>
        </Box>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Feed">
              <IconButton onClick={() => navigate('/')} color="primary">
                <HomeIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Create post">
              <IconButton onClick={() => navigate('/create')} color="primary">
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton onClick={toggleColorMode} color="primary">
            {mode === 'dark' ? <LightIcon /> : <DarkIcon />}
          </IconButton>
        </Tooltip>

        {user && (
          <Box>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }}>
              <UserAvatar name={user.name} src={user.avatar} size={34} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              slotProps={{ paper: { sx: { minWidth: 200, mt: 1 } } }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}