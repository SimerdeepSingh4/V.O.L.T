import React, { useState } from 'react';
import { TextField, Button, Typography, Divider, IconButton, Box, Snackbar, Alert, Card, CardContent } from '@mui/material';
import { Visibility, VisibilityOff, PersonAddAlt1 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const navigate = useNavigate();

  const handlePasswordVisibilityToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(doc(db, 'users', user.uid), {
        username: user.displayName,
        email: user.email,
        createdAt: new Date(),
      });
      setSnackbarSeverity('success');
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

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[A-Za-z][A-Za-z0-9_]*$/;
    return usernameRegex.test(username);
  };

  const passwordStrength = calculatePasswordStrength(password);

  const handleRegister = () => {
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!username || !validateUsername(username)) {
      setSnackbarSeverity('error');
      setErrorMessage('Username must start with a letter and can only contain letters, numbers, or underscores.');
      setSnackbarOpen(true);
      return;
    }
    if (!email || !emailRegex.test(email)) {
      setSnackbarSeverity('error');
      setErrorMessage('Email format is invalid');
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
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setDoc(doc(db, 'users', user.uid), {
          username: username,
          email: user.email,
          createdAt: new Date(),
        })
        .then(() => {
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          setTimeout(() => {
            navigate('/TranscribePage');
          }, 2000);
        })
        .catch(() => {
          setSnackbarSeverity('error');
          setErrorMessage('Error saving user data');
          setSnackbarOpen(true);
        });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setSnackbarSeverity('error');
          setErrorMessage('Email is already in use');
        } else {
          setSnackbarSeverity('error');
          setErrorMessage('An error occurred. Please try again.');
        }
        setSnackbarOpen(true);
      });
  };

  const handleSocialLogin = (platform) => {
    navigate('/NotFoundPage');
  };

  return (
    <Box sx={{ minHeight: '96.7vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(120deg, #f4f6fb 0%, #F8FFAE 100%)', p: 2 }}>
      <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 5, boxShadow: 6, p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <PersonAddAlt1 sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#222' }}>
              Create your Volt account
            </Typography>
            <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
              Sign up to get started with Volt.
            </Typography>
          </Box>
          <Box component="form" noValidate>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              autoComplete="username"
              InputProps={{ sx: { borderRadius: 3, fontSize: '1.1rem' } }}
            />
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
              autoComplete="new-password"
              InputProps={{
                sx: { borderRadius: 3, fontSize: '1.1rem' },
                endAdornment: (
                  <IconButton onClick={handlePasswordVisibilityToggle} edge="end">
                    {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            {password && (
              <Box mt={0}>
                <Typography
                  variant="body2"
                  sx={{ color: passwordStrength >= 75 ? 'green' : passwordStrength >= 50 ? 'blue' : 'red', textAlign: 'right', mr: 1, mt: -1 }}
                >
                  <Typography variant="body2" sx={{ color: 'grey', display: 'inline' }}>
                    Password strength:
                  </Typography>{' '}
                  {passwordStrength >= 75 ? 'Strong' : passwordStrength >= 50 ? 'Medium' : 'Weak'}
                </Typography>
              </Box>
            )}
            {isPasswordFocused && (
              <Box sx={{ textAlign: 'left', mt: 2 }}>
                <Typography variant="body2" sx={{ color: password.length >= 8 ? 'green' : 'red' }}>
                  - Minimum 8 characters
                </Typography>
                <Typography variant="body2" sx={{ color: /[A-Z]/.test(password) ? 'green' : 'red' }}>
                  - At least one uppercase letter
                </Typography>
                <Typography variant="body2" sx={{ color: /[0-9]/.test(password) ? 'green' : 'red' }}>
                  - At least one number
                </Typography>
                <Typography variant="body2" sx={{ color: /[^A-Za-z0-9]/.test(password) ? 'green' : 'red' }}>
                  - At least one special character
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleRegister}
              sx={{ mt: 2, py: 1.5, fontWeight: 700, fontSize: '1.1rem', borderRadius: 3, boxShadow: 2 }}
            >
              Sign Up
            </Button>
          </Box>
          <Divider sx={{ my: 3 }}>or sign up with</Divider>
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
              Already have an account?{' '}
              <Button onClick={() => navigate('/login')} variant="text" sx={{ fontWeight: 700, textTransform: 'none', fontSize: '1.05rem' }}>
                Sign in
              </Button>
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
              Prefer not to sign up? Continue as{' '}
              <Button onClick={() => navigate('/TranscribePage')} variant="text" sx={{ fontWeight: 700, textTransform: 'none', fontSize: '1.05rem' }}>
                Guest
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {errorMessage || 'Account created successfully!'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterPage;
