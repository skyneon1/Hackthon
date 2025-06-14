const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();

// Configure multer for file uploads with file type filtering
const fileFilter = (req, file, cb) => {
  // Accept images, PDFs, and text files
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'text/plain' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload images, PDFs, or text documents.'), false);
  }
};

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  fileFilter: fileFilter
});

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API Routes
app.post('/api/chat', upload.array('files'), async (req, res) => {
  console.log('Received chat request');

  try {
    const { message } = req.body;
    const files = req.files || [];

    console.log('Message:', message);
    console.log('Files:', files);

    // Process files if any
    let fileContent = '';
    if (files.length > 0) {
      for (const file of files) {
        try {
          const content = fs.readFileSync(file.path, 'utf-8');
          fileContent += `\nFile: ${file.originalname}\nContent: ${content}\n`;
          // Clean up uploaded files
          fs.unlinkSync(file.path);
        } catch (fileError) {
          console.error('Error processing file:', fileError);
          // Continue with other files even if one fails
        }
      }
    }

    // Prepare the prompt for Ollama
    const prompt = message ? `${message}\n${fileContent}` : `Please analyze these files:\n${fileContent}`;
    console.log('Prepared prompt:', prompt);

    // Check if Ollama is running
    try {
      await axios.get('http://localhost:11434/api/tags');
      console.log('Ollama is running');
    } catch (ollamaError) {
      console.error('Ollama connection error:', ollamaError.message);
      return res.status(500).json({
        error: 'Ollama service is not running. Please start Ollama first.',
        details: ollamaError.message
      });
    }

    // Call Ollama API
    console.log('Sending request to Ollama...');
    const response = await axios.post('http://localhost:11434/api/chat', {
      model: 'llama3',
      messages: [
        {
          role: 'system',
          content: `You are Medo, a helpful and knowledgeable health assistant.
            Your task is to analyze medical documents, images, and user queries to provide accurate health information.
            When analyzing documents or images, focus on:
            1. Identifying key medical information
            2. Explaining medical terms in simple language
            3. Providing context and relevance
            4. Suggesting next steps or recommendations
            Always maintain a friendly and professional tone while ensuring accuracy.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      stream: false
    });

    console.log('Received response from Ollama');
    res.json(response.data);
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });

    res.status(500).json({
      error: 'Failed to process request',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const ollamaResponse = await axios.get('http://localhost:11434/api/tags');
    res.json({
      status: 'ok',
      ollama: 'running',
      model: 'llama3'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      ollama: 'not running',
      error: error.message
    });
  }
});

// Handle React routing, return all requests to the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
});