import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { auth, db, onAuthStateChanged, getDoc, doc } from './firebase';
import { Box, Card, CardContent, Typography, Button, IconButton, Menu, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert, TextField, Divider, Avatar } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import TranslateIcon from '@mui/icons-material/Translate';
import MoodIcon from '@mui/icons-material/Mood';

const TranscriptionPage = () => {
  const [transcription, setTranscription] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [language, setLanguage] = useState('es');
  const [sentiment, setSentiment] = useState(null);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [lastTranscript, setLastTranscript] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [sentimentTone, setSentimentTone] = useState('neutral');
  const [transformedText, setTransformedText] = useState('');
  const [userData, setUserData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setUserData(null);
          }
        } catch {
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setAnchorEl(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      setSpeechRecognition(recognition);
      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        const isFinal = event.results[event.results.length - 1].isFinal;
        if (isFinal && transcript !== lastTranscript) {
          setTranscription((prev) => prev + ' ' + transcript);
          setLastTranscript(transcript);
          detectLanguage(transcript);
        }
      };
      recognition.onerror = (event) => {
        setSnackbarSeverity('error');
        setSnackbarMsg('Error during speech recognition. Please try again.');
        setSnackbarOpen(true);
      };
    } else {
      setSnackbarSeverity('error');
      setSnackbarMsg('Your browser does not support speech recognition.');
      setSnackbarOpen(true);
    }
  }, [lastTranscript]);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      setAnchorEl(null);
      navigate('/login');
    } catch {
      setSnackbarSeverity('error');
      setSnackbarMsg('Error signing out.');
      setSnackbarOpen(true);
    }
  };

  const toggleRecording = () => {
    if (speechRecognition) {
      if (isRecording) {
        speechRecognition.stop();
      } else {
        setTranscription('');
        setLastTranscript('');
        speechRecognition.start();
      }
      setIsRecording(!isRecording);
    }
  };

  const handleTranslate = async () => {
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/process-text', {
        text: transcription,
        targetLanguage: language,
      });
      setTranslatedText(response.data.translatedText);
      setSnackbarSeverity('success');
      setSnackbarMsg('Translation successful!');
      setSnackbarOpen(true);
    } catch {
      setSnackbarSeverity('error');
      setSnackbarMsg('Failed to translate text. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleSentimentAnalysis = async () => {
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/process-sentiment', {
        text: transcription,
      });
      setSentiment(response.data.sentiment);
      setSnackbarSeverity('success');
      setSnackbarMsg('Sentiment analysis complete!');
      setSnackbarOpen(true);
    } catch {
      setSnackbarSeverity('error');
      setSnackbarMsg('Failed to analyze sentiment. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleToneChange = async (targetSentiment) => {
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/change-sentiment', {
        text: transcription,
        targetSentiment,
      });
      setTransformedText(response.data.transformedText);
      setSnackbarSeverity('success');
      setSnackbarMsg('Tone changed successfully!');
      setSnackbarOpen(true);
    } catch {
      setSnackbarSeverity('error');
      setSnackbarMsg('Failed to change sentiment tone. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const detectLanguage = async (text) => {
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/detect-language', {
        text,
      });
      setDetectedLanguage(response.data.language);
    } catch {
      setSnackbarSeverity('error');
      setSnackbarMsg('Failed to detect language.');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ minHeight: '96vh', background: 'linear-gradient(120deg, #f4f6fb 0%, #F8FFAE 100%)', py: 4, px: { xs: 1, md: 4 } }}>
      <Box sx={{ maxWidth: 900, mx: 'auto' }}>
        {/* Header/Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#222', letterSpacing: 1 }}>
            Transcription & Translation
          </Typography>
          <Box>
            <IconButton onClick={handleProfileClick} size="large">
              {userData?.username ? (
                <Avatar sx={{ bgcolor: 'primary.main', color: '#fff' }}>{userData.username[0].toUpperCase()}</Avatar>
              ) : (
                <AccountCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              )}
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose} ref={menuRef}>
              <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
                {userData ? (
                  <>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{userData.username}</Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>{userData.email}</Typography>
                    <Divider sx={{ my: 1 }} />
                    <MenuItem onClick={handleSignOut} sx={{ color: 'error.main', fontWeight: 700 }}>Sign Out</MenuItem>
                  </>
                ) : (
                  <Button onClick={() => { handleClose(); navigate('/login'); }} fullWidth variant="contained" color="primary" sx={{ mt: 1 }}>
                    Sign In / Sign Up
                  </Button>
                )}
              </Box>
            </Menu>
          </Box>
        </Box>
        {/* Main Card */}
        <Card sx={{ borderRadius: 5, boxShadow: 6, p: { xs: 2, md: 4 }, mb: 4 }}>
          <CardContent>
            {/* Transcription Area */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
              Speech-to-Text
            </Typography>
            <TextField
              multiline
              minRows={5}
              maxRows={10}
              fullWidth
              value={transcription}
              placeholder="Start speaking and the transcription will appear here..."
              InputProps={{ readOnly: true, sx: { borderRadius: 3, fontSize: '1.1rem', background: '#fff' } }}
              sx={{ mb: 2 }}
            />
            {detectedLanguage && (
              <Typography variant="body2" sx={{ color: 'secondary.main', mb: 2 }}>
                <b>Detected Language:</b> {detectedLanguage}
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Button
                variant={isRecording ? 'contained' : 'outlined'}
                color="primary"
                startIcon={isRecording ? <StopIcon /> : <MicIcon />}
                onClick={toggleRecording}
                sx={{ fontWeight: 700, borderRadius: 3, minWidth: 160, py: 1.2 }}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<TranslateIcon />}
                onClick={handleTranslate}
                sx={{ fontWeight: 700, borderRadius: 3, minWidth: 160, py: 1.2 }}
              >
                Translate
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<MoodIcon />}
                onClick={handleSentimentAnalysis}
                sx={{ fontWeight: 700, borderRadius: 3, minWidth: 160, py: 1.2 }}
              >
                Analyze Sentiment
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel id="language-label">Target Language</InputLabel>
                <Select
                  labelId="language-label"
                  value={language}
                  label="Target Language"
                  onChange={(e) => setLanguage(e.target.value)}
                  sx={{ borderRadius: 3, background: '#fff' }}
                >
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="hi">Hindi</MenuItem>
                  <MenuItem value="zh">Chinese</MenuItem>
                  <MenuItem value="ja">Japanese</MenuItem>
                  <MenuItem value="pa">Punjabi</MenuItem>
                  <MenuItem value="or">Odia</MenuItem>
                  <MenuItem value="as">Assamese</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel id="tone-label">Change Text Tone</InputLabel>
                <Select
                  labelId="tone-label"
                  value={sentimentTone}
                  label="Change Text Tone"
                  onChange={(e) => { setSentimentTone(e.target.value); handleToneChange(e.target.value); }}
                  sx={{ borderRadius: 3, background: '#fff' }}
                >
                  <MenuItem value="positive">Positive</MenuItem>
                  <MenuItem value="negative">Negative</MenuItem>
                  <MenuItem value="neutral">Neutral</MenuItem>
                  <MenuItem value="informal">Informal</MenuItem>
                  <MenuItem value="formal">Formal</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* Translated Text */}
            {translatedText && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                  Translated Text
                </Typography>
                <TextField
                  multiline
                  minRows={3}
                  maxRows={8}
                  fullWidth
                  value={translatedText}
                  InputProps={{ readOnly: true, sx: { borderRadius: 3, fontSize: '1.1rem', background: '#f8ffae' } }}
                  sx={{ mb: 2 }}
                />
              </Box>
            )}
            {/* Sentiment Display */}
            {sentiment && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                  Sentiment Analysis
                </Typography>
                <TextField
                  multiline
                  minRows={2}
                  maxRows={6}
                  fullWidth
                  value={sentiment}
                  InputProps={{ readOnly: true, sx: { borderRadius: 3, fontSize: '1.1rem', background: '#e3fcec' } }}
                  sx={{ mb: 2 }}
                />
              </Box>
            )}
            {/* Sentiment Transformed Text */}
            {transformedText && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                  Sentiment Transformed Text
                </Typography>
                <TextField
                  multiline
                  minRows={2}
                  maxRows={6}
                  fullWidth
                  value={transformedText}
                  InputProps={{ readOnly: true, sx: { borderRadius: 3, fontSize: '1.1rem', background: '#f0f0f0' } }}
                  sx={{ mb: 2 }}
                />
              </Box>
            )}
            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            )}
          </CardContent>
        </Card>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TranscriptionPage;
