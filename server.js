const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config(); 

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.post('/transcribe', async (req, res) => {
  const { text, language } = req.body;

  if (language === 'en') return res.json({ translatedText: text });

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `Translate the following text to ${language}: ${text}`,
        }],
      },
      
      {
        headers: {
            'Authorization': `Bearer sk-lHaKykYlLe6NgQVxnUg3OZIjCt75os6A-qwZvwMXQwT3BlbkFJkeTYNLQmzaRyJlNh7-YSJafHqDmCmAKJlMckOa7n8A`,
        },
      }
    );

    const translatedText = response.data.choices[0].message.content;
    res.json({ translatedText });
  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ error: 'Translation failed. Please try again later.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
