import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouter } from './router/AppRouter';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useAppSelector, useAppDispatch } from './redux/hooks';
import { AuthProvider } from './components/auth/AuthProvider';

const getAppTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === 'dark' ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.87)',
      },
      secondary: {
        main: '#FF2D92',
      },
      success: {
        main: '#52c41a',
      },
      warning: {
        main: '#faad14',
      },
      error: {
        main: '#ff4d4f',
      },
      background: {
        default: mode === 'dark' ? 'rgba(25, 1, 80, 1)' : 'rgba(245, 245, 245, 1)',
        paper: mode === 'dark' ? 'rgba(25, 1, 80, 1)' : 'rgba(255, 255, 255, 1)',
      },
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === 'dark' ? 'rgba(25, 1, 80, 1)' : 'rgba(245, 245, 245, 1)',
            minHeight: '100vh',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: mode === 'dark' ? 'rgba(25, 1, 80, 1)' : 'rgba(255, 255, 255, 1)',
            backdropFilter: 'blur(10px)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? 'rgba(29, 0, 84, 0.8)' : 'rgba(230, 230, 230, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? 'rgba(29, 0, 84, 0.8)' : 'rgba(230, 230, 230, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  });

function AppContent() {
  const themeMode = useAppSelector(state => state.theme.mode);
  const theme = React.useMemo(() => getAppTheme(themeMode), [themeMode]);
  const dispatch = useAppDispatch();

  // Authentication is now handled by AuthProvider

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;