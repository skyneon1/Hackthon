/**
 * Model configuration for the health assistant
 * This file contains the configuration for the LLM models used in the application
 */

// Ollama API endpoint
export const OLLAMA_API_URL = 'http://localhost:11434/api';

// Available models
export const MODELS = {
  LLAMA3: {
    id: 'llama3',
    name: 'Llama 3',
    description: 'Llama 3 is a powerful open-source language model by Meta AI',
    endpoint: `${OLLAMA_API_URL}/chat`,
    healthEndpoint: `${OLLAMA_API_URL}/tags`,
    systemPrompt: `You are Medo, a helpful and knowledgeable health assistant specialized in medical information.
Your task is to analyze medical documents, images, and user queries to provide accurate health information.

When analyzing documents or images, focus on:
1. Identifying key medical information and terminology
2. Explaining medical terms in simple, understandable language
3. Providing context and relevance to the user's health concerns
4. Suggesting appropriate next steps or recommendations
5. For medical images, explain what information might be found in such images and how they are typically interpreted

When responding to health queries:
1. Provide evidence-based information when available
2. Be clear about the limitations of your advice
3. Encourage consultation with healthcare professionals for serious concerns
4. Avoid making definitive diagnoses
5. Be empathetic and supportive

Always maintain a friendly and professional tone while ensuring accuracy.

IMPORTANT: You are not a replacement for professional medical advice, diagnosis, or treatment.
Always remind users to consult with qualified healthcare providers for specific medical concerns.`
  }
};

// Default model
export const DEFAULT_MODEL = MODELS.LLAMA3;

// Helper functions for processing different file types
export const fileProcessors = {
  // Process text-based files
  processTextFile: (file, content) => {
    return `\nFile: ${file.name}\nContent: ${content}\n`;
  },
  
  // Process image files
  processImageFile: (file) => {
    return `\nFile: ${file.name}\nType: Medical Image/Scan\n` +
           `[This is a medical image that the user has uploaded for analysis. ` +
           `Please provide general guidance about analyzing such images and what information ` +
           `might be relevant from ${file.name}.]`;
  },
  
  // Process PDF files
  processPdfFile: (file) => {
    return `\nFile: ${file.name}\nType: PDF Document\n` +
           `[This is a PDF document that may contain medical information. ` +
           `Please provide guidance on how to interpret the information in this document.]`;
  }
};

// Function to prepare prompt with files
export const preparePromptWithFiles = (message, fileContents) => {
  if (message && fileContents) {
    return `${message}\n\nI've also uploaded the following files for analysis: ${fileContents}`;
  } else if (fileContents) {
    return `Please analyze these files:\n${fileContents}`;
  } else {
    return message;
  }
};
