# Project Name

## Overview
This project integrates a Flask backend for document analysis and a React frontend for a modern UI. It also includes a Gradio interface for image-based interactions.

## Prerequisites
- Python 3.x
- Node.js and npm
- Flask
- React
- Gradio

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies
#### Backend (Flask)
```bash
cd analzer
pip install -r requirements.txt
```

#### Frontend (React)
```bash
cd my-app
npm install
```

### 3. Running the Servers
#### Flask Backend
```bash
cd analzer
python app.py
```
The Flask server will run on [http://localhost:5000](http://localhost:5000).

#### React Frontend
```bash
cd my-app
npm start
```
The React app will run on [http://localhost:3000](http://localhost:3000).

#### AI Doctor/Gradio
```bash
cd my-app/AI doctor
node allserver.js
```
This will start the Gradio and related Python servers.

## Usage
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Use the "Chat with Docs" feature to interact with the Flask backend.
- Use the "Chat with Images" feature to interact with the Gradio interface.

## Additional Information
- Ensure all servers are running for full functionality.
- For any issues, check the terminal logs for each server.

## License
This project is licensed under the MIT License. 