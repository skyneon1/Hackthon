const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class AIDoctorService {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY;
    this.elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
  }

  async analyzeImage(imageFile, query) {
    try {
      // Convert image to base64
      const imageBuffer = fs.readFileSync(imageFile.path);
      const base64Image = imageBuffer.toString('base64');

      // Call GROQ API for image analysis
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama-3.2-90b-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: query
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }

  async transcribeAudio(audioFile) {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(audioFile.path));
      formData.append('model', 'whisper-large-v3');
      formData.append('language', 'en');

      const response = await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', formData, {
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          ...formData.getHeaders()
        }
      });

      return response.data.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  async generateVoiceResponse(text) {
    try {
      const response = await axios.post('https://api.elevenlabs.io/v1/text-to-speech/Aria', {
        text: text,
        model_id: 'eleven_turbo_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      }, {
        headers: {
          'xi-api-key': this.elevenLabsApiKey,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      });

      // Save the audio file
      const audioPath = path.join(__dirname, '../../uploads/response.mp3');
      fs.writeFileSync(audioPath, response.data);

      return audioPath;
    } catch (error) {
      console.error('Error generating voice response:', error);
      throw error;
    }
  }
}

module.exports = new AIDoctorService(); 