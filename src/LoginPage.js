import React, { useState } from 'react';
import { TextField, Button, Typography, Divider, IconButton, Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent } from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const navigate = useNavigate();
  const authInstance = getAuth();

  const handlePasswordVisibilityToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(authInstance, provider);
      const user = result.user;
      setSnackbarSeverity('success');
      setErrorMessage('Sign in successfully!');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/TranscribePage');
      }, 2000);
    } catch (error) {
      setSnackbarSeverity('error');
      setErrorMessage('Google sign-in failed. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleLogin = () => {
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!email || !emailRegex.test(email)) {
      setSnackbarSeverity('error');
      setErrorMessage('Please enter a valid email');
      setSnackbarOpen(true);
      return;
    }
    if (!password) {
      setSnackbarSeverity('error');
      setErrorMessage('Please enter a password');
      setSnackbarOpen(true);
      return;
    }
    setErrorMessage('');
    signInWithEmailAndPassword(authInstance, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        getDoc(doc(db, 'users', user.uid))
          .then((docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              navigate('/TranscribePage', {
                state: { username: userData.username, email: userData.email }
              });
              setSnackbarOpen(false);
            } else {
              setSnackbarSeverity('error');
              setErrorMessage('No user data found.');
              setSnackbarOpen(true);
            }
          })
          .catch(() => {
            setSnackbarSeverity('error');
            setErrorMessage('Failed to retrieve user data.');
            setSnackbarOpen(true);
          });
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          setSnackbarSeverity('error');
          setErrorMessage('No user found with this email');
        } else if (error.code === 'auth/invalid-credential') {
          setSnackbarSeverity('error');
          setErrorMessage('Incorrect password');
        } else {
          setSnackbarSeverity('error');
          setErrorMessage('An error occurred. Please try again.');
        }
        setSnackbarOpen(true);
      });
  };

  const handleForgotPassword = () => {
    setResetDialogOpen(true);
  };

  const handleSendResetEmail = () => {
    if (!resetEmail) {
      setResetMessage('Please enter your email');
      return;
    }
    sendPasswordResetEmail(authInstance, resetEmail)
      .then(() => {
        setResetMessage('Password reset email sent successfully!');
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          setResetMessage('No user found with this email');
        } else {
          setResetMessage('An error occurred. Please try again.');
        }
      });
  };

  const closeResetDialog = () => {
    setResetDialogOpen(false);
    setResetMessage('');
    setResetEmail('');
  };

  const handleSocialLogin = (platform) => {
    navigate(`/social-login/${platform}`);
  };

  return (
    <Box sx={{ minHeight: '96.7vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #f4f6fb 0%, #F8FFAE 100%)', p: 2 }}>
      <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 5, boxShadow: 6, p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <LockOutlined sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#222' }}>
              Sign in to Volt
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
              Welcome back! Please enter your details.
            </Typography>
          </Box>
          <Box component="form" noValidate>
            <TextField
              label="Email address"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              autoComplete="email"
              InputProps={{ sx: { borderRadius: 3, fontSize: '1.1rem' } }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type={isPasswordVisible ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              autoComplete="current-password"
              InputProps={{
                sx: { borderRadius: 3, fontSize: '1.1rem' },
                endAdornment: (
                  <IconButton onClick={handlePasswordVisibilityToggle} edge="end">
                    {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
            <Box display="flex" justifyContent="flex-end" mt={-1}>
              <Button variant="text" color="primary" onClick={handleForgotPassword} sx={{ fontSize: '0.95rem', textTransform: 'none' }}>
                Forgot password?
              </Button>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              sx={{ mt: 2, py: 1.5, fontWeight: 700, fontSize: '1.1rem', borderRadius: 3, boxShadow: 2 }}
            >
              Sign In
            </Button>
          </Box>
          <Divider sx={{ my: 3 }}>or sign in with</Divider>
          <Box display="flex" justifyContent="center" gap={2} mb={2}>
            <IconButton onClick={handleGoogleSignIn} sx={{ border: '1px solid #eee', borderRadius: 2, p: 1.2 }}>
              <img src={`${process.env.PUBLIC_URL}/images/google.svg`} alt="Google" width="28" />
            </IconButton>
            <IconButton onClick={() => handleSocialLogin('Apple')} sx={{ border: '1px solid #eee', borderRadius: 2, p: 1.2 }}>
              <img src={`${process.env.PUBLIC_URL}/images/apple.svg`} alt="Apple" width="28" />
            </IconButton>
            <IconButton onClick={() => handleSocialLogin('Facebook')} sx={{ border: '1px solid #eee', borderRadius: 2, p: 1.2 }}>
              <img src={`${process.env.PUBLIC_URL}/images/facebook.svg`} alt="Facebook" width="28" />
            </IconButton>
          </Box>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Don't have an account?{' '}
              <Button onClick={() => navigate('/register')} variant="text" sx={{ fontWeight: 700, textTransform: 'none', fontSize: '1.05rem' }}>
                Sign up
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
      {/* Snackbar for showing feedback messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {errorMessage || 'Sign in successfully!'}
        </Alert>
      </Snackbar>
      {/* Forgot Password Dialog */}
      <Dialog open={resetDialogOpen} onClose={closeResetDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2rem' }}>
          Reset Password
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 2, fontSize: '1.15rem' }}>
            Enter your registered email address to receive the reset link.
          </Typography>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            sx={{ mb: 2, fontSize: '1.1rem' }}
          />
          {resetMessage && (
            <Typography
              variant="body1"
              sx={{ color: resetMessage.includes('success') ? 'success.main' : 'error.main', textAlign: 'center', mb: 2, fontSize: '1.1rem' }}
            >
              {resetMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={closeResetDialog} sx={{ fontWeight: 'bold', textTransform: 'none', fontSize: '1.1rem' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSendResetEmail}
            variant="contained"
            sx={{ backgroundColor: '#43C6AC', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', textTransform: 'none', px: 3, py: 1, '&:hover': { backgroundColor: '#2fa48a' } }}
          >
            Send Reset Link
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoginPage;
