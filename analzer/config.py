"""
Configuration settings for the medical chatbot application.
"""

# Model configuration
MODEL_CONFIG = {
    "model_name": "medical_transformer",
    "vocab_size": 30000,
    "hidden_size": 512,  # Reduced from 768
    "num_hidden_layers": 2,  # Reduced from 6
    "num_attention_heads": 8,  # Reduced from 12
    "intermediate_size": 2048,  # Reduced from 3072
    "hidden_dropout_prob": 0.1,
    "attention_probs_dropout_prob": 0.1,
    "max_position_embeddings": 256,  # Reduced from 512
    "type_vocab_size": 2,
    "initializer_range": 0.02
}

# Training configuration
TRAINING_CONFIG = {
    "batch_size": 32,  # Increased from 16 for faster training
    "learning_rate": 1e-4,  # Increased from 5e-5 for faster convergence
    "num_train_epochs": 1,  # Reduced from 3
    "warmup_steps": 100,  # Reduced from 500
    "weight_decay": 0.01,
    "logging_steps": 50,  # Reduced from 100
    "save_steps": 500,  # Reduced from 1000
    "max_seq_length": 64  # Reduced from 128
}

# Data configuration
DATA_CONFIG = {
    "num_synthetic_samples": 1000,  # Reduced from 10000 for faster training
    "train_test_split": 0.8,
    "seed": 42
}

# Medical categories and conditions
MEDICAL_CATEGORIES = [
    "Cardiovascular",
    "Respiratory",
    "Gastrointestinal",
    "Neurological",
    "Musculoskeletal",
    "Dermatological",
    "Endocrine",
    "Psychiatric",
    "Infectious"
]

COMMON_SYMPTOMS = {
    "Cardiovascular": ["chest pain", "shortness of breath", "palpitations", "fatigue", "swelling"],
    "Respiratory": ["cough", "wheezing", "shortness of breath", "chest tightness", "sputum production"],
    "Gastrointestinal": ["abdominal pain", "nausea", "vomiting", "diarrhea", "constipation"],
    "Neurological": ["headache", "dizziness", "numbness", "weakness", "confusion"],
    "Musculoskeletal": ["joint pain", "muscle pain", "stiffness", "swelling", "limited mobility"],
    "Dermatological": ["rash", "itching", "redness", "swelling", "lesions"],
    "Endocrine": ["fatigue", "weight changes", "increased thirst", "increased urination", "heat/cold intolerance"],
    "Psychiatric": ["mood changes", "anxiety", "sleep disturbances", "concentration issues", "behavioral changes"],
    "Infectious": ["fever", "chills", "fatigue", "body aches", "swollen lymph nodes"]
}

# Application configuration
APP_CONFIG = {
    "host": "127.0.0.1",
    "port": 5000,
    "debug": True
}

# File paths
FILE_PATHS = {
    "model_save_path": "models/medical_transformer.pkl",
    "synthetic_data_path": "data/synthetic_medical_data.csv",
    "logs_path": "logs/app.log"
}
