import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ColorModeProvider, useColorMode } from './context/ColorModeContext';

// Light and dark palettes, inspired by modern social apps.
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6366f1' },
    secondary: { main: '#14b8a6' },
    background: {
      default: '#f5f6fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#172033',
      secondary: '#5f6b7a',
    },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: `'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif`,
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#818cf8' },
    secondary: { main: '#2dd4bf' },
    background: {
      default: '#0f1117',
      paper: '#1a1d27',
    },
    text: {
      primary: '#f5f7fb',
      secondary: '#aab3c2',
    },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: `'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif`,
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});

function ThemedApp() {
  const { mode } = useColorMode();
  return (
    <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ColorModeProvider>
        <ThemedApp />
      </ColorModeProvider>
    </BrowserRouter>
  </React.StrictMode>
);