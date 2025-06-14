document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const chatHistory = document.getElementById('chatHistory');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const documentForm = document.getElementById('documentForm');
    const saveButton = document.getElementById('saveButton');
    
    // Start session when page loads
    startSession();
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    documentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        uploadDocument();
    });
    
    saveButton.addEventListener('click', saveConversation);
    
    // Functions
    function startSession() {
        // Generate a random user ID if not already set
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substring(2, 10);
            localStorage.setItem('userId', userId);
        }
        
        fetch('/api/start_session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                addMessage(data.message, 'bot');
            }
        })
        .catch(error => {
            console.error('Error starting session:', error);
        });
    }
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        
        // Clear input
        messageInput.value = '';
        
        // Send message to server
        fetch('/api/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                addMessage(data.message, 'bot');
            }
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });
    }
    
    function uploadDocument() {
        const fileInput = document.getElementById('documentInput');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        
        // Show loading message
        addMessage(`Uploading and analyzing document: ${file.name}...`, 'bot');
        
        fetch('/api/upload_document', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Remove loading message
            chatHistory.lastChild.remove();
            
            if (data.status === 'success') {
                addMessage(`Uploaded document: ${file.name}`, 'user');
                addMessage(data.message, 'bot');
            } else {
                addMessage(`Error: ${data.message}`, 'bot');
            }
            
            // Clear file input
            fileInput.value = '';
        })
        .catch(error => {
            // Remove loading message
            chatHistory.lastChild.remove();
            
            console.error('Error uploading document:', error);
            addMessage('Error uploading document. Please try again.', 'bot');
            
            // Clear file input
            fileInput.value = '';
        });
    }
    
    function saveConversation() {
        fetch('/api/save_conversation', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                addMessage(data.message, 'bot');
            } else {
                addMessage(`Error: ${data.message}`, 'bot');
            }
        })
        .catch(error => {
            console.error('Error saving conversation:', error);
        });
    }
    
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        
        // Process text (handle newlines)
        const formattedText = text.replace(/\n/g, '<br>');
        messageElement.innerHTML = formattedText;
        
        chatHistory.appendChild(messageElement);
        
        // Scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    
    // Load conversation history
    function loadHistory() {
        fetch('/api/get_history')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.history.length > 0) {
                // Clear chat history
                chatHistory.innerHTML = '';
                
                // Add messages
                data.history.forEach(item => {
                    addMessage(item.message, item.sender);
                });
            }
        })
        .catch(error => {
            console.error('Error loading history:', error);
        });
    }
});