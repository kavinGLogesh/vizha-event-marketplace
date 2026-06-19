// App.jsx — Root application component
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import './translations/i18n'; // Initialize i18n

// ── Custom MUI Theme ──────────────────────────────────────
const theme = createTheme({
  palette: {
    primary: {
      main: '#7a1c2e',
      light: '#c4576a',
      dark: '#4a1020',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#1a0a0e'
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff'
    },
    text: {
      primary: '#1a0a0e',
      secondary: '#666666'
    }
  },
  typography: {
    fontFamily: '"Lato", "Cormorant Garamond", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontFamily: '"Lato", sans-serif'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Lato", sans-serif'
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
