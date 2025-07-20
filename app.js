const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
// Placeholder for Whisper Node.js bindings or command-line execution
const whisper = require("whisper-cpp"); // Replace this with your Whisper-compatible library

const app = express();
const port = 3000;

// Use body-parser to handle raw binary audio data
app.use(bodyParser.raw({ type: "application/octet-stream", limit: "10mb" }));

// Initialize Whisper model (replace with actual initialization as per the library you're using)
const model = new whisper.Model("base"); // Specify model size like "base" or "small"

app.post("/transcribe", async (req, res) => {
    if (!req.body || req.body.length === 0) {
        return res.status(400).json({ error: "No audio data received" });
    }

    // Save raw audio data to a temporary file
    const audioPath = pat
    h.join(__dirname, "temp_audio.wav");
    fs.writeFileSync(audioPath, req.body);
    // console.log("bodyreq.body);

    try {
        // Transcribe audio using Whisper model
        const result = await model.transcribe(audioPath);

        // Remove temporary audio file
        fs.unlinkSync(audioPath);

        // Send transcription result as JSON
        res.json({ transcribed_text: result.text });
    } catch (error) {
        console.error("Transcription error:", error);
        res.status(500).json({ error: "Failed to transcribe audio" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
