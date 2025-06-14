"""
Setup script to prepare everything needed to run the application without the full training process.
"""

import os
import sys
import time

def setup():
    """Set up the application."""
    print("Setting up the medical chatbot application...")
    
    # Create necessary directories
    print("Creating necessary directories...")
    os.makedirs("data", exist_ok=True)
    os.makedirs("models", exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    os.makedirs("templates", exist_ok=True)
    os.makedirs("static", exist_ok=True)
    os.makedirs("static/css", exist_ok=True)
    os.makedirs("static/js", exist_ok=True)
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("conversations", exist_ok=True)
    
    # Create synthetic data
    print("\nGenerating synthetic data...")
    from create_synthetic_data import create_synthetic_data
    create_synthetic_data()
    
    # Create model pickle file
    print("\nCreating model pickle file...")
    from create_model_pickle import create_model_pickle
    create_model_pickle()
    
    print("\nSetup complete! You can now run the application with:")
    print("python app.py")

if __name__ == "__main__":
    setup()
