const express = require('express');
const bodyParser = require('body-parser');
const { SpeechClient } = require('@google-cloud/speech');
const { TranslationServiceClient } = require('@google-cloud/translate');
const { LanguageServiceClient } = require('@google-cloud/language');
const path = require('path');
const fs = require('fs');
const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate(); // Create the translate client
const axios = require('axios'); // Import Axios for Gemini API calls
const geminiApiKey = process.env.GEMINI_API_KEY;  // Get the API key from environment variables
require('dotenv').config();

const app = express();
app.use(bodyParser.json({ limit: '100mb' }));
const cors = require('cors');
app.use(cors()); // Allow all origins


// Initialize Google Cloud clients
const speechClient = new SpeechClient();
const translateClient = new TranslationServiceClient();
const languageClient = new LanguageServiceClient();

// Middleware to ensure GOOGLE_APPLICATION_CREDENTIALS is set
app.use((req, res, next) => {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'credentials/service-account-key.json');
    console.log('Environment variable set for GOOGLE_APPLICATION_CREDENTIALS.');
  }
  next();
});

// Route to handle translation
app.post('/process-text', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text) {
      console.log('Error: No text content provided for processing');
      return res.status(400).send({ error: 'No text content provided for processing' });
    }

    console.log('Original text received:', text);

    // Translate the text
    const translatedText = await translateText(text, targetLanguage);
    console.log('Translated text:', translatedText);

    // Send back transcription, translated text, and sentiment analysis results
    res.status(200).send({
      originalText: text,
      translatedText
    });
  } catch (error) {
    console.error('Error during processing text:', error);
    res.status(500).send({ error: `Failed to process text: ${error.message}` });
  }
});

// Function to translate text using Google Cloud Translation API
async function translateText(text, targetLanguage) {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error('Error during translation:', error);
    // throw new Error('Failed to translate text.');
  }
}

// Function to analyze sentiment using Google Cloud Natural Language API
// app.post('/process-sentiment', async (req, res) => {
//   try {
//     const { text } = req.body;

//     if (!text) {
//       return res.status(400).send({ error: 'No text content provided for sentiment analysis' });
//     }

//     // Analyze sentiment of the provided text
//     const sentiment = await analyzeSentiment(text);

//     // Log the original text and sentiment analysis results
//     console.log('Original Text:', text);
//     console.log('Sentiment Analysis Result:', sentiment);

//     // Send back sentiment analysis results
//     res.status(200).send({
//       originalText: text,
//       sentiment: {
//         score: sentiment.score,
//         magnitude: sentiment.magnitude,
//         label: sentiment.sentimentLabel, // Include the label in the response
//       }
//     });
//   } catch (error) {
//     console.error('Error during sentiment analysis:', error);
//     res.status(500).send({ error: `Failed to analyze sentiment: ${error.message}` });
//   }
// });
// // Function to determine sentiment in words based on sentiment score
// function getSentimentLabel(score, text) {
//   // Questioning or doubt based on keywords in text
//   const questioningKeywords = ['who', 'what', 'why', 'how', 'where', 'when', '?'];
//   const isQuestioning = questioningKeywords.some((keyword) => text.toLowerCase().includes(keyword));

//   if (isQuestioning) {
//     return 'Questioning'; // Indicates a question
//   }

//   // Sentiment based on score ranges
//   if (score >= 0.9) {
//     return 'Overjoyed'; // Extremely positive
//   } else if (score >= 0.7) {
//     return 'Very Happy'; // Strongly positive
//   } else if (score >= 0.5) {
//     return 'Happy'; // Positive
//   } else if (score >= 0.3) {
//     return 'Satisfied'; // Moderately positive
//   } else if (score >= 0.1) {
//     return 'Content'; // Mildly positive
//   } else if (score >= 0) {
//     return 'Neutral'; // Neutral sentiment
//   } else if (score >= -0.1) {
//     return 'Doubtful'; // Slightly negative
//   } else if (score >= -0.3) {
//     return 'Worried'; // Mildly negative
//   } else if (score >= -0.5) {
//     return 'Upset'; // Moderately negative
//   } else if (score >= -0.7) {
//     return 'Disappointed'; // Negative
//   } else if (score >= -0.9) {
//     return 'Anguished'; // Strongly negative
//   } else {
//     return 'Devastated'; // Extremely negative
//   }
// }
// // Function to analyze sentiment using Google Cloud Natural Language API
// async function analyzeSentiment(text) {
//   try {
//     const document = {
//       content: text,
//       type: 'PLAIN_TEXT',
//     };

//     const [result] = await languageClient.analyzeSentiment({ document });
//     const sentiment = result.documentSentiment;
    
//     // Get sentiment description based on score
//     const sentimentLabel = getSentimentLabel(sentiment.score, text);


//     return { 
//       score: sentiment.score, 
//       magnitude: sentiment.magnitude, 
//       label: sentiment.sentimentLabel // Add the sentiment label here
//     };
//   } catch (error) {
//     console.error('Error during sentiment analysis:', error);
//     throw new Error('Failed to analyze sentiment.');
//   }
// }
// Route to process sentiment using Gemini API
app.post('/process-sentiment', async (req, res) => {
  try {
    const { text } = req.body; // The text input for sentiment analysis

    if (!text) {
      return res.status(400).send({ error: 'No text content provided for sentiment analysis' });
    }

    console.log('Original Text:', text);

    // Create the prompt for sentiment analysis (to get only the sentiment response)
    const prompt = {
      contents: [
        {
          parts: [
            {
              text: `What is the sentiment of the following text? just write the sentiment only and an appropriate emoji: "${text}"just the give 1 option only and no another text`
            }
          ]
        }
      ]
    };
    
    // Call Gemini API for sentiment analysis
    const geminiSentimentResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDlI5BKZvmctDgxPgkf9XEsZPN5V3qy0bg',
      prompt
    );

    // Log the entire API response for debugging
    console.log('Gemini API Response:', geminiSentimentResponse.data);

    // Extracting the sentiment response from Gemini API response
    // Access the first candidate's content and then extract the sentiment text
    const sentimentText = geminiSentimentResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Check if sentimentText is available
    if (sentimentText) {
      console.log('Sentiment Analysis Result:', sentimentText);

      // Send back the sentiment analysis result
      return res.status(200).send({
        originalText: text,
        sentiment: sentimentText.trim()  // Removing any unwanted spaces or newlines
      });
    } else {
      // If sentiment couldn't be determined, send an error
      return res.status(400).send({ error: 'Sentiment could not be determined' });
    }
  } catch (error) {
    console.error('Error processing sentiment with Gemini API:', error);
    res.status(500).send({ error: 'Failed to process sentiment with Gemini API.' });
  }
});



// Route to change the sentiment of the text using Gemini API
app.post('/change-sentiment', async (req, res) => {
  try {
    const { text, targetSentiment } = req.body;

    if (!text || !targetSentiment) {
      return res.status(400).send({ error: 'No text or targetSentiment provided for sentiment transformation' });
    }

    // Create the prompt for sentiment change
    const prompt = {
      contents: [
        {
          parts: [
            {
              text: `Change the sentiment of this text to "${targetSentiment}" while maintaining its meaning: "${text}" give 1 option only"`
            }
          ]
        }
      ]
    };

    // Call Gemini API
    const geminiSentimentResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDlI5BKZvmctDgxPgkf9XEsZPN5V3qy0bg',
      prompt
    );

    console.log('Gemini Response:', geminiSentimentResponse.data);

    // Extract the transformed text from the response
    const transformedText = geminiSentimentResponse.data.candidates[0].content.parts[0].text;

    if (!transformedText) {
      return res.status(500).send({ error: 'Transformed text not found in Gemini API response' });
    }

    // Send the transformed text to the client
    res.status(200).send({ transformedText });
  } catch (error) {
    console.error('Error processing sentiment transformation:', error);
    res.status(500).send({ error: 'Failed to transform sentiment' });
  }
});


// Route to detect language of the text
app.post('/detect-language', async (req, res) => {
    const { text } = req.body;
  
    if (!text) {
      return res.status(400).send({ error: 'No text provided to detect language' });
    }
  
    try {
      const [detection] = await translate.detect(text);
      console.log(`Detected language for text: "${text}" is ${detection.language}`); // Output to console
      res.status(200).send({
        text: detection.input,
        language: detection.language,
      });
    } catch (error) {
      console.error('Error during language detection:', error);
      res.status(500).send({ error: 'Failed to detect language.' });
    }
  });

// Route to list all supported languages for translation
app.get('/list-languages', async (req, res) => {
    try {
      const [languages] = await translate.getLanguages();
      console.log('Supported Languages:', languages); // Output languages to terminal
      res.status(200).send({
        languages,
      });
    } catch (error) {
      console.error('Error during listing languages:', error);
      res.status(500).send({ error: 'Failed to list supported languages.' });
    }
  });
  
// Fallback route for other requests
// app.use((req, res) => {
//   res.status(404).send({ error: 'Route not found' });
// });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
