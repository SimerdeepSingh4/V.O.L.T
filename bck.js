const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Environment Variables
const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;

// Route for text translation
app.post('/api/translate', async (req, res) => {
  const { text, targetLanguage } = req.body;

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2`,
      {
        q: text,
        target: targetLanguage,
      },
      {
        params: { key: GOOGLE_CLOUD_API_KEY },
      }
    );
    res.json({ translatedText: response.data.data.translations[0].translatedText });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

// Route for sentiment analysis
app.post('/api/sentiment', async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post(
      `https://language.googleapis.com/v1/documents:analyzeSentiment`,
      {
        document: {
          type: 'PLAIN_TEXT',
          content: text,
        },
        encodingType: 'UTF8',
      },
      {
        params: { key: GOOGLE_CLOUD_API_KEY },
      }
    );
    res.json({ sentiment: response.data.documentSentiment });
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    res.status(500).json({ error: 'Sentiment analysis failed' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
