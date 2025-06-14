"""
Synthetic medical data generator for training the medical chatbot.
"""

import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import os
from config import MEDICAL_CATEGORIES, COMMON_SYMPTOMS, DATA_CONFIG

class SyntheticMedicalDataGenerator:
    """
    Generates synthetic medical data for training the medical chatbot.
    """
    
    def __init__(self, num_samples=DATA_CONFIG["num_synthetic_samples"], seed=DATA_CONFIG["seed"]):
        """
        Initialize the data generator.
        
        Args:
            num_samples: Number of synthetic samples to generate
            seed: Random seed for reproducibility
        """
        self.num_samples = num_samples
        random.seed(seed)
        np.random.seed(seed)
        
        # Templates for generating medical queries
        self.query_templates = [
            "I've been experiencing {symptom} for {duration}. What could this be?",
            "I have {symptom}. Should I be concerned?",
            "My {body_part} has been {symptom_verb} for {duration}. What might be causing this?",
            "I'm concerned about {symptom} that won't go away. Any advice?",
            "For the past {duration}, I've had {symptom}. Is this serious?",
            "I've noticed {symptom} recently. What could be wrong?",
            "My doctor mentioned {condition}, but I don't understand what it means. Can you explain?",
            "What are the common treatments for {condition}?",
            "Are there any home remedies for {symptom}?",
            "How long does {symptom} typically last with {condition}?"
        ]
        
        # Templates for generating medical responses
        self.response_templates = {
            "diagnosis": [
                "{symptom} can be associated with several conditions including {condition}. However, proper diagnosis requires medical evaluation.",
                "Your symptoms of {symptom} for {duration} could suggest {condition}, but other causes should be ruled out by a healthcare provider.",
                "While {symptom} is commonly seen in {condition}, only a medical professional can provide a proper diagnosis after examination."
            ],
            "advice": [
                "For {symptom}, it's advisable to {advice}. If symptoms persist, please consult a healthcare provider.",
                "To manage {symptom}, consider {advice}. However, if the condition worsens, seek medical attention.",
                "Many people with {symptom} find relief by {advice}, but this doesn't replace professional medical care."
            ],
            "information": [
                "{condition} is a {category} condition characterized by {symptom}. Treatment typically involves {treatment}.",
                "{condition} affects the {body_system} and commonly presents with {symptom}. Management includes {treatment}.",
                "In {condition}, patients often experience {symptom} due to {mechanism}. Medical approaches include {treatment}."
            ]
        }
        
        # Common body parts for symptom descriptions
        self.body_parts = [
            "head", "chest", "stomach", "back", "arm", "leg", "throat", 
            "neck", "shoulder", "knee", "ankle", "wrist", "elbow", "hip",
            "foot", "hand", "eye", "ear", "nose", "mouth", "skin"
        ]
        
        # Symptom verbs for query generation
        self.symptom_verbs = [
            "hurting", "aching", "throbbing", "burning", "itching", 
            "swollen", "stiff", "numb", "tingling", "cramping"
        ]
        
        # Duration phrases for symptom descriptions
        self.durations = [
            "a few hours", "a day", "two days", "several days", 
            "a week", "two weeks", "a month", "several months"
        ]
        
        # Common medical conditions by category
        self.conditions = {
            "Cardiovascular": ["hypertension", "coronary artery disease", "heart failure", "arrhythmia", "valve disease"],
            "Respiratory": ["asthma", "chronic bronchitis", "pneumonia", "COPD", "pulmonary fibrosis"],
            "Gastrointestinal": ["GERD", "peptic ulcer", "irritable bowel syndrome", "Crohn's disease", "gallstones"],
            "Neurological": ["migraine", "epilepsy", "multiple sclerosis", "Parkinson's disease", "stroke"],
            "Musculoskeletal": ["osteoarthritis", "rheumatoid arthritis", "fibromyalgia", "tendinitis", "bursitis"],
            "Dermatological": ["eczema", "psoriasis", "acne", "rosacea", "dermatitis"],
            "Endocrine": ["diabetes", "hypothyroidism", "hyperthyroidism", "adrenal insufficiency", "Cushing's syndrome"],
            "Psychiatric": ["depression", "anxiety disorder", "bipolar disorder", "schizophrenia", "PTSD"],
            "Infectious": ["influenza", "pneumonia", "urinary tract infection", "cellulitis", "gastroenteritis"]
        }
        
        # Common medical advice
        self.advice = [
            "rest and stay hydrated", 
            "take over-the-counter pain relievers as directed",
            "apply ice to reduce swelling",
            "use a heating pad for comfort",
            "elevate the affected area",
            "avoid strenuous activities until symptoms improve",
            "maintain a balanced diet",
            "ensure adequate sleep",
            "practice stress reduction techniques",
            "monitor symptoms and seek medical attention if they worsen"
        ]
        
        # Common treatments
        self.treatments = [
            "medication management",
            "lifestyle modifications",
            "physical therapy",
            "surgical intervention in severe cases",
            "regular monitoring",
            "dietary changes",
            "stress reduction",
            "exercise regimens",
            "specialized therapies",
            "combination approaches tailored to individual needs"
        ]
        
        # Body systems for information responses
        self.body_systems = [
            "cardiovascular system",
            "respiratory system",
            "digestive system",
            "nervous system",
            "musculoskeletal system",
            "integumentary system",
            "endocrine system",
            "immune system",
            "urinary system",
            "reproductive system"
        ]
        
        # Mechanisms of disease for information responses
        self.mechanisms = [
            "inflammation",
            "infection",
            "autoimmune processes",
            "degenerative changes",
            "genetic factors",
            "metabolic dysfunction",
            "structural abnormalities",
            "vascular compromise",
            "neurochemical imbalances",
            "cellular dysfunction"
        ]
    
    def generate_query(self):
        """Generate a synthetic medical query."""
        template = random.choice(self.query_templates)
        
        category = random.choice(MEDICAL_CATEGORIES)
        symptom = random.choice(COMMON_SYMPTOMS[category])
        condition = random.choice(self.conditions[category])
        duration = random.choice(self.durations)
        body_part = random.choice(self.body_parts)
        symptom_verb = random.choice(self.symptom_verbs)
        
        query = template.format(
            symptom=symptom,
            duration=duration,
            body_part=body_part,
            symptom_verb=symptom_verb,
            condition=condition
        )
        
        return query, category, symptom, condition, duration
    
    def generate_response(self, category, symptom, condition, duration):
        """Generate a synthetic medical response."""
        response_type = random.choice(list(self.response_templates.keys()))
        template = random.choice(self.response_templates[response_type])
        
        advice_text = random.choice(self.advice)
        treatment = random.choice(self.treatments)
        body_system = random.choice(self.body_systems)
        mechanism = random.choice(self.mechanisms)
        
        response = template.format(
            symptom=symptom,
            duration=duration,
            condition=condition,
            category=category.lower(),
            advice=advice_text,
            treatment=treatment,
            body_system=body_system,
            mechanism=mechanism
        )
        
        return response, response_type
    
    def generate_dataset(self, save_path=None):
        """
        Generate a synthetic medical dataset.
        
        Args:
            save_path: Path to save the generated dataset
            
        Returns:
            DataFrame containing the synthetic dataset
        """
        data = []
        
        for _ in range(self.num_samples):
            query, category, symptom, condition, duration = self.generate_query()
            response, response_type = self.generate_response(category, symptom, condition, duration)
            
            data.append({
                'query': query,
                'response': response,
                'category': category,
                'symptom': symptom,
                'condition': condition,
                'response_type': response_type,
                'timestamp': (datetime.now() - timedelta(days=random.randint(0, 365))).isoformat()
            })
        
        df = pd.DataFrame(data)
        
        if save_path:
            # Ensure directory exists
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            df.to_csv(save_path, index=False)
            print(f"Dataset saved to {save_path}")
        
        return df

if __name__ == "__main__":
    from config import FILE_PATHS
    
    # Create data directory if it doesn't exist
    os.makedirs(os.path.dirname(FILE_PATHS["synthetic_data_path"]), exist_ok=True)
    
    # Generate and save synthetic dataset
    generator = SyntheticMedicalDataGenerator()
    df = generator.generate_dataset(save_path=FILE_PATHS["synthetic_data_path"])
    
    print(f"Generated {len(df)} synthetic medical conversations")
    print(f"Sample query: {df.iloc[0]['query']}")
    print(f"Sample response: {df.iloc[0]['response']}")
