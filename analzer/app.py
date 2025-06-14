from flask import Flask, request, jsonify, render_template
import torch
from transformers import BertTokenizer
import os
import json
from werkzeug.utils import secure_filename
from model import MedicalTransformer, MedicalResponseGenerator
from data_processor import MedicalDataProcessor
import logging
from config import MODEL_CONFIG, FILE_PATHS
import PyPDF2
import docx
import pytesseract
from PIL import Image

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'bmp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Configure Tesseract path
if os.name == 'nt':  # Windows
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
else:  # Linux/Mac
    pytesseract.pytesseract.tesseract_cmd = 'tesseract'

# Create required directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('logs', exist_ok=True)
os.makedirs(os.path.dirname(FILE_PATHS["model_save_path"]), exist_ok=True)

# Initialize model and processors
try:
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    data_processor = MedicalDataProcessor()
    response_generator = MedicalResponseGenerator(model_path=FILE_PATHS["model_save_path"])
    logger.info("Model and processors initialized successfully")
except Exception as e:
    logger.error(f"Error initializing model: {str(e)}")
    raise

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            try:
                # Extract text from file
                text = extract_text_from_file(filepath, filename)
                
                if not text:
                    raise ValueError("Could not extract text from file")

                # Process the text
                cleaned_text = data_processor.clean_text(text)
                response = response_generator.generate_response(cleaned_text, tokenizer)
                
                # Clean up
                os.remove(filepath)
                
                return jsonify({
                    'success': True,
                    'filename': filename,
                    'analysis': {
                        'response': response
                    }
                })
            
            except Exception as e:
                logger.error(f"Error processing file {filename}: {str(e)}")
                # Clean up on error
                if os.path.exists(filepath):
                    os.remove(filepath)
                return jsonify({
                    'success': False,
                    'error': f"Error processing file: {str(e)}"
                }), 500
            
        return jsonify({
            'success': False,
            'error': 'File type not allowed'
        }), 400

    except Exception as e:
        logger.error(f"Error in upload_file: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while processing your file'
        }), 500

def extract_text_from_file(filepath, filename):
    """Extract text from various file formats including images."""
    file_type = filename.rsplit('.', 1)[1].lower()
    
    try:
        # Handle image files
        if file_type in ['png', 'jpg', 'jpeg', 'bmp']:
            image = Image.open(filepath)
            # Perform OCR on the image
            text = pytesseract.image_to_string(image)
            return text.strip()
            
        # Handle text files
        elif file_type == 'txt':
            with open(filepath, 'r', encoding='utf-8') as f:
                return f.read()
            
        # Handle PDF files
        elif file_type == 'pdf':
            text = []
            with open(filepath, 'rb') as f:
                pdf_reader = PyPDF2.PdfReader(f)
                for page in pdf_reader.pages:
                    text.append(page.extract_text())
            return ' '.join(text)
            
        # Handle Word documents
        elif file_type in ['doc', 'docx']:
            doc = docx.Document(filepath)
            return ' '.join([paragraph.text for paragraph in doc.paragraphs])
            
    except Exception as e:
        logger.error(f"Error extracting text from {filename}: {str(e)}")
        raise ValueError(f"Could not extract text from {filename}")

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'success': False, 'error': 'No message provided'}), 400

        message = data['message']
        
        # Process the message
        cleaned_text = data_processor.clean_text(message)
        response = response_generator.generate_response(cleaned_text, tokenizer)
        
        return jsonify({
            'success': True,
            'response': response
        })

    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while processing your message'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 