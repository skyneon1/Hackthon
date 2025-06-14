const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to start the Gradio server
app.post('/api/start-gradio', (req, res) => {
  try {
    const gradioProcess = spawn('python', ['AI doctor/gradio_app.py'], {
      cwd: path.join(__dirname, '..'),
    });

    gradioProcess.stdout.on('data', (data) => {
      console.log(`Gradio stdout: ${data}`);
    });

    gradioProcess.stderr.on('data', (data) => {
      console.error(`Gradio stderr: ${data}`);
    });

    // Wait a bit to make sure the server starts
    setTimeout(() => {
      res.json({ message: 'Gradio server started successfully' });
    }, 2000);
  } catch (error) {
    console.error('Error starting Gradio server:', error);
    res.status(500).json({ error: 'Failed to start Gradio server' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 