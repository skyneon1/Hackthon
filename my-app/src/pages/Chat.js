import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import axios from 'axios';

const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 200px);
`;

const ChatTitle = styled.h1`
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
  text-align: center;
`;

const ChatSubtitle = styled.p`
  font-size: 1.1rem;
  color: #4a5568;
  text-align: center;
  margin-bottom: 2rem;
`;

const MessagesContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
`;

const Message = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: ${props => props.isUser ? '#e2e8f0' : '#f7fafc'};
  max-width: 80%;
  margin-left: ${props => props.isUser ? 'auto' : '0'};
  margin-right: ${props => props.isUser ? '0' : 'auto'};
`;

const FilePreview = styled.div`
  margin-top: 1rem;
  padding: 0.5rem;
  background: #f7fafc;
  border-radius: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.2rem;
  line-height: 1;
`;

const InputContainer = styled.form`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-direction: column;
`;

const InputRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  padding: 0.75rem 1rem;
  background: #4299e1;
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;

  &:hover {
    background: #3182ce;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #3182ce;
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  margin-top: 1rem;
  text-align: center;
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #4a5568;
  margin: 1rem 0;
`;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!input.trim() && files.length === 0) || isLoading) return;

    setError(null);
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { 
      text: userMessage || 'Analyzing uploaded files...', 
      isUser: true 
    }]);

    // Add file information if any
    if (files.length > 0) {
      setMessages(prev => [...prev, {
        text: `Uploaded ${files.length} file(s): ${files.map(f => f.name).join(', ')}`,
        isUser: true
      }]);
    }

    setIsLoading(true);

    try {
      // Prepare form data
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('message', userMessage);

      // Send request to backend
      const response = await axios.post('/api/chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Extract the message content from the response
      const responseMessage = response.data.message?.content || response.data.message || 'No response received';

      // Add AI response to chat
      setMessages(prev => [...prev, { 
        text: responseMessage, 
        isUser: false 
      }]);

      // Clear files after successful analysis
      setFiles([]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.error || 'An error occurred while processing your request. Please try again.';
      setError(errorMessage);
      setMessages(prev => [...prev, { 
        text: errorMessage, 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ChatTitle>Health Assistant</ChatTitle>
        <ChatSubtitle>
          Ask me anything about health, nutrition, or fitness. You can also upload medical documents for analysis.
        </ChatSubtitle>

        <MessagesContainer>
          {messages.map((message, index) => (
            <Message key={index} isUser={message.isUser}>
              {typeof message.text === 'string' ? message.text : JSON.stringify(message.text)}
            </Message>
          ))}
          {isLoading && (
            <LoadingIndicator>
              Analyzing your input...
            </LoadingIndicator>
          )}
        </MessagesContainer>

        <InputContainer onSubmit={handleSubmit}>
          <InputRow>
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <FileLabel>
              Upload Files
              <FileInput
                type="file"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                disabled={isLoading}
              />
            </FileLabel>
            <Button type="submit" disabled={isLoading}>
              Send
            </Button>
          </InputRow>

          {files.length > 0 && (
            <FilePreview>
              {files.map((file, index) => (
                <FileItem key={index}>
                  <span>{file.name}</span>
                  <RemoveFileButton onClick={() => removeFile(index)}>
                    ×
                  </RemoveFileButton>
                </FileItem>
              ))}
            </FilePreview>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputContainer>
      </motion.div>
    </ChatContainer>
  );
};

export default Chat;