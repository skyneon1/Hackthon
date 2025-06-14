"""
Script to create a pre-trained model pickle file without actual training.
This is a workaround for demonstration purposes when training is too slow.
"""

import os
import pickle
import torch
import torch.nn as nn
from transformers import BertModel, BertConfig
from model import MedicalTransformer
from config import FILE_PATHS, MEDICAL_CATEGORIES, MODEL_CONFIG

def create_model_pickle():
    """Create a pre-trained model pickle file."""
    print("Creating model pickle file...")
    
    # Create models directory if it doesn't exist
    os.makedirs(os.path.dirname(FILE_PATHS["model_save_path"]), exist_ok=True)
    
    # Initialize a simple model
    model = MedicalTransformer(num_labels=len(MEDICAL_CATEGORIES))
    
    # Save the model using pickle
    with open(FILE_PATHS["model_save_path"], 'wb') as f:
        pickle.dump(model, f)
    
    print(f"Model saved to {FILE_PATHS['model_save_path']}")
    return True

if __name__ == "__main__":
    create_model_pickle()
