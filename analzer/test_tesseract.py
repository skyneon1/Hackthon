import pytesseract
from PIL import Image

# Set the path to tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Print tesseract version
print("Tesseract Version:", pytesseract.get_tesseract_version()) 