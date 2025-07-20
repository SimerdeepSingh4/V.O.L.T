import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';

import SplashPage from './SplashPage';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import NotFoundPage from './NotFoundPage';
import TranscriptionPage from './TranscriptionPage';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#43C6AC',
    },
    secondary: {
      main: '#F8FFAE',
    },
    background: {
      default: '#f4f6fb',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

const CustomAppBar = () => {
  const location = useLocation();
  const hideAppBarRoutes = ['/', '/NotFoundPage'];
  const showAppBar = !hideAppBarRoutes.includes(location.pathname);
  return showAppBar ? (
    <AppBar position="static" color="inherit" elevation={1} sx={{ mb: 2 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img src={process.env.PUBLIC_URL + '/images/logo.png'} alt="Volt Logo" style={{ height: 40, marginRight: 16 }} />
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
            
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button component={Link} to="/home" color="primary">Home</Button>
          <Button component={Link} to="/TranscribePage" color="primary">Transcribe</Button>
        </Box>
        {/* User actions or profile/avatar can go here */}
        <IconButton sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  ) : null;
};

function AppRoutes() {
  return (
    <>
      <CustomAppBar />
      <div className="app">
        <Routes>
          <Route path="/" element={<SplashPage />} />
          {/* <Route path="/transcribe" element={ <TranscribePage />}/>} */}
          <Route path="/home" element={<HomePage />}/>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/NotFoundPage" element={<NotFoundPage />} />
          <Route path="/TranscribePage" element={<TranscriptionPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
};

export default App;
