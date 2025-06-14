import axios from 'axios';
import { DEFAULT_MODEL, fileProcessors, preparePromptWithFiles } from '../models/modelConfig';

/**
 * Check if Ollama service is running and if the model is available
 * @returns {Promise<Object>} 
 */
export const checkOllamaHealth = async () => {
  try {
    const response = await axios.get(DEFAULT_MODEL.healthEndpoint);
    const models = response.data.models || [];
    const isModelAvailable = models.some(model => model.name === DEFAULT_MODEL.id);

    return {
      status: isModelAvailable ? 'ok' : 'warning',
      ollama: 'running',
      modelAvailable: isModelAvailable,
      modelName: DEFAULT_MODEL.id,
      message: isModelAvailable ? null : `Ollama is running but the ${DEFAULT_MODEL.id} model may not be installed. Run "ollama pull ${DEFAULT_MODEL.id}" to install it.`
    };
  } catch (error) {
    console.error('Error checking Ollama health:', error);
    return {
      status: 'error',
      ollama: 'not running',
      modelAvailable: false,
      error: error.message,
      message: 'Ollama service is not running. Please make sure Ollama is installed and running on your computer.'
    };
  }
};

/**
 * Send a message to the Ollama API
 * @param {string} message - The user's message
 * @returns {Promise<Object>} Response from the Ollama API
 */
export const sendMessage = async (message) => {
  try {
    // Check if Ollama is running first
    const healthStatus = await checkOllamaHealth();
    if (healthStatus.status === 'error') {
      return {
        success: false,
        error: healthStatus.message
      };
    }

    const response = await axios.post(DEFAULT_MODEL.endpoint, {
      model: DEFAULT_MODEL.id,
      messages: [
        {
          role: 'system',
          content: DEFAULT_MODEL.systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      stream: false
    });

    return {
      success: true,
      data: response.data.message.content
    };
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Unable to connect to the AI service. Please try again later.'
    };
  }
};

/**
 * Process files and send them along with a message to the Ollama API
 * @param {string} message - The user's message
 * @param {File[]} files - Array of files uploaded by the user
 * @returns {Promise<Object>} Response from the Ollama API
 */
export const sendMessageWithFiles = async (message, files) => {
  try {
    // Check if Ollama is running first
    const healthStatus = await checkOllamaHealth();
    if (healthStatus.status === 'error') {
      return {
        success: false,
        error: healthStatus.message
      };
    }

    // Process files
    let fileContents = '';
    let hasImages = false;

    for (const file of files) {
      try {
        if (file.type.startsWith('image/')) {
          fileContents += fileProcessors.processImageFile(file);
          hasImages = true;
        } else if (file.type === 'application/pdf') {
          fileContents += fileProcessors.processPdfFile(file);
        } else {
          // For text files, read the content
          const reader = new FileReader();
          const content = await new Promise((resolve, reject) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read file'));
            reader.readAsText(file);
          });

          fileContents += fileProcessors.processTextFile(file, content);
        }
      } catch (fileError) {
        console.error('Error processing file:', fileError);
        // Continue with other files even if one fails
      }
    }

    // Prepare the prompt
    let prompt = preparePromptWithFiles(message, fileContents);

    // Add special instructions for image handling
    if (hasImages) {
      prompt += '\n\nNote: I\'ve uploaded medical images/scans. Please provide guidance on how to interpret these types of images and what information might be relevant from them.';
    }

    const response = await axios.post(DEFAULT_MODEL.endpoint, {
      model: DEFAULT_MODEL.id,
      messages: [
        {
          role: 'system',
          content: DEFAULT_MODEL.systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      stream: false
    });

    return {
      success: true,
      data: response.data.message.content
    };
  } catch (error) {
    console.error('Error calling Ollama API with files:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Unable to process your request. Please try again later.'
    };
  }
};