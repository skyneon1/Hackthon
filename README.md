# MedoAI

## Overview
This project include AI which help in diagnosis of patient health using ML trained model and give prescription based on the data given to it.

## Prerequisites
- Python 3.x
- Node.js and npm
- Flask
- React
- Gradio
- ML

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/skyneon1/Hackthon.git
cd my-app
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
