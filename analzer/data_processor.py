"""
Data processing utilities for the medical chatbot.
"""

import pandas as pd
import numpy as np
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
import torch
from transformers import BertTokenizer
import os
from config import DATA_CONFIG, FILE_PATHS

# Download required NLTK resources
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('wordnet')

class MedicalDataProcessor:
    """
    Processes medical text data for model training and inference.
    """

    def __init__(self, max_seq_length=128, tokenizer_name="bert-base-uncased"):
        """
        Initialize the data processor.

        Args:
            max_seq_length: Maximum sequence length for tokenization
            tokenizer_name: Name of the pre-trained tokenizer to use
        """
        self.max_seq_length = max_seq_length
        self.tokenizer = BertTokenizer.from_pretrained(tokenizer_name)
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))

    def clean_text(self, text):
        """
        Clean and normalize text data.

        Args:
            text: Input text to clean

        Returns:
            Cleaned text
        """
        # Convert to lowercase
        text = text.lower()

        # Remove special characters and numbers
        text = re.sub(r'[^a-zA-Z\s]', '', text)

        # Tokenize
        tokens = word_tokenize(text)

        # Remove stopwords and lemmatize
        cleaned_tokens = [self.lemmatizer.lemmatize(token) for token in tokens if token not in self.stop_words]

        # Join tokens back into text
        cleaned_text = ' '.join(cleaned_tokens)

        return cleaned_text

    def tokenize_text(self, text):
        """
        Tokenize text using the BERT tokenizer.

        Args:
            text: Input text to tokenize

        Returns:
            Dictionary containing input_ids, attention_mask, and token_type_ids
        """
        return self.tokenizer(
            text,
            padding='max_length',
            truncation=True,
            max_length=self.max_seq_length,
            return_tensors='pt'
        )

    def prepare_dataset(self, data_path=None, test_size=0.2, random_state=42):
        """
        Prepare dataset for model training.

        Args:
            data_path: Path to the dataset CSV file
            test_size: Proportion of data to use for testing
            random_state: Random seed for reproducibility

        Returns:
            Tuple of (train_dataset, test_dataset)
        """
        if data_path is None:
            data_path = FILE_PATHS["synthetic_data_path"]

        # Load data
        df = pd.read_csv(data_path)

        # Clean text
        df['cleaned_query'] = df['query'].apply(self.clean_text)

        # Split into train and test sets
        train_df, test_df = train_test_split(
            df,
            test_size=test_size,
            random_state=random_state,
            stratify=df['category'] if 'category' in df.columns else None
        )

        # Create PyTorch datasets
        train_dataset = self.create_torch_dataset(train_df)
        test_dataset = self.create_torch_dataset(test_df)

        return train_dataset, test_dataset

    def create_torch_dataset(self, df):
        """
        Create a PyTorch dataset from a DataFrame.

        Args:
            df: Input DataFrame

        Returns:
            Dictionary containing tokenized inputs and labels
        """
        # Tokenize queries
        encodings = self.tokenizer(
            df['cleaned_query'].tolist(),
            padding='max_length',
            truncation=True,
            max_length=self.max_seq_length,
            return_tensors='pt'
        )

        # Create category labels if available
        if 'category' in df.columns:
            # Create a mapping of categories to indices
            categories = df['category'].unique()
            category_to_idx = {category: idx for idx, category in enumerate(categories)}
            labels = torch.tensor([category_to_idx[category] for category in df['category']])

            dataset = {
                'input_ids': encodings['input_ids'],
                'attention_mask': encodings['attention_mask'],
                'labels': labels,
                'category_mapping': category_to_idx
            }
        else:
            dataset = {
                'input_ids': encodings['input_ids'],
                'attention_mask': encodings['attention_mask']
            }

        return dataset

    def vectorize_text(self, texts, max_features=5000):
        """
        Vectorize text using TF-IDF.

        Args:
            texts: List of texts to vectorize
            max_features: Maximum number of features for TF-IDF

        Returns:
            TF-IDF matrix and vectorizer
        """
        vectorizer = TfidfVectorizer(max_features=max_features)
        X = vectorizer.fit_transform(texts)

        return X, vectorizer

    def extract_medical_entities(self, text):
        """
        Extract medical entities from text with enhanced pattern matching.

        Args:
            text: Input text

        Returns:
            Dictionary of extracted entities
        """
        from config import MEDICAL_CATEGORIES, COMMON_SYMPTOMS

        entities = {
            'symptoms': [],
            'conditions': [],
            'medications': [],
            'body_parts': [],
            'medical_values': [],
            'categories': []
        }

        # Comprehensive symptom patterns
        symptom_patterns = [
            # Pain patterns
            r'pain in (?:my |the )?([\w\s]+)',
            r'([\w\s]+) (?:pain|ache|hurts)',
            r'(sharp|dull|throbbing|constant|intermittent|severe|mild|moderate) pain',
            # Common symptoms
            r'(headache|migraine|fever|cough|nausea|vomiting|diarrhea|constipation|dizziness|fatigue|weakness|numbness|tingling|swelling|rash|itching|burning|bleeding|bruising|shortness of breath|difficulty breathing|chest pain|palpitations|irregular heartbeat|loss of appetite|weight loss|weight gain|insomnia|excessive sleepiness|anxiety|depression|stress|confusion|memory loss)',
            # Feeling patterns
            r'feeling (tired|dizzy|nauseous|weak|faint|lightheaded|confused|depressed|anxious|stressed|exhausted|fatigued|sick|ill|unwell)'
        ]

        # Comprehensive condition patterns
        condition_patterns = [
            # Common conditions
            r'(diabetes|hypertension|high blood pressure|asthma|copd|arthritis|osteoporosis|depression|anxiety|bipolar disorder|schizophrenia|alzheimer\'s|dementia|cancer|heart disease|coronary artery disease|heart failure|stroke|kidney disease|liver disease|hepatitis|cirrhosis|ulcer|gerd|ibs|crohn\'s disease|ulcerative colitis|multiple sclerosis|parkinson\'s disease|epilepsy|seizure disorder|thyroid disease|hypothyroidism|hyperthyroidism)',
            # Diagnosis patterns
            r'diagnosed with ([\w\s]+)',
            r'I have ([\w\s]+) (?:disease|disorder|condition|syndrome)',
            r'suffering from ([\w\s]+)',
            r'dealing with ([\w\s]+)'
        ]

        # Comprehensive medication patterns
        medication_patterns = [
            r'taking ([\w\s]+)',
            r'prescribed ([\w\s]+)',
            r'medication(?:s)? (?:called|named) ([\w\s]+)',
            r'(?:on|using) ([\w\s]+) for',
            r'(aspirin|tylenol|advil|ibuprofen|acetaminophen|lisinopril|metformin|atorvastatin|levothyroxine|albuterol|fluticasone|omeprazole|losartan|metoprolol|amlodipine|gabapentin|hydrochlorothiazide|sertraline|fluoxetine|escitalopram|citalopram|amoxicillin|azithromycin|prednisone|insulin)'
        ]

        # Comprehensive body part patterns
        body_part_patterns = [
            r'(head|brain|skull|face|eye|eyes|ear|ears|nose|mouth|throat|neck|shoulder|shoulders|arm|arms|elbow|elbows|wrist|wrists|hand|hands|finger|fingers|chest|breast|breasts|heart|lung|lungs|abdomen|stomach|liver|kidney|kidneys|intestine|intestines|colon|bladder|back|spine|hip|hips|leg|legs|knee|knees|ankle|ankles|foot|feet|toe|toes|skin|muscle|muscles|bone|bones|joint|joints|tendon|tendons|ligament|ligaments)'
        ]

        # Medical values patterns
        medical_value_patterns = [
            r'blood pressure (?:of |is |was )?([\d/]+)',
            r'heart rate (?:of |is |was )?([\d]+)',
            r'temperature (?:of |is |was )?([\d\.]+)',
            r'glucose (?:level |of |is |was )?([\d\.]+)',
            r'cholesterol (?:level |of |is |was )?([\d\.]+)',
            r'([\d\.]+)\s*(?:mg|kg|lb|cm|mm|in|ft|°C|°F|bpm|mmHg)'
        ]

        # Process text to handle common variations
        processed_text = text.lower()

        # Extract symptoms
        for pattern in symptom_patterns:
            matches = re.findall(pattern, processed_text)
            if matches:
                # Handle tuple results from groups
                for match in matches:
                    if isinstance(match, tuple):
                        entities['symptoms'].extend(list(match))
                    else:
                        entities['symptoms'].append(match)

        # Extract conditions
        for pattern in condition_patterns:
            matches = re.findall(pattern, processed_text)
            if matches:
                # Handle tuple results from groups
                for match in matches:
                    if isinstance(match, tuple):
                        entities['conditions'].extend(list(match))
                    else:
                        entities['conditions'].append(match)

        # Extract medications
        for pattern in medication_patterns:
            matches = re.findall(pattern, processed_text)
            if matches:
                # Handle tuple results from groups
                for match in matches:
                    if isinstance(match, tuple):
                        entities['medications'].extend(list(match))
                    else:
                        entities['medications'].append(match)

        # Extract body parts
        for pattern in body_part_patterns:
            matches = re.findall(pattern, processed_text)
            if matches:
                # Handle tuple results from groups
                for match in matches:
                    if isinstance(match, tuple):
                        entities['body_parts'].extend(list(match))
                    else:
                        entities['body_parts'].append(match)

        # Extract medical values
        for pattern in medical_value_patterns:
            matches = re.findall(pattern, processed_text)
            if matches:
                entities['medical_values'].extend(matches)

        # Clean and normalize entities
        for key in entities:
            # Remove duplicates
            entities[key] = list(set(entities[key]))
            # Clean up strings
            entities[key] = [item.strip() for item in entities[key] if item.strip()]

        # Determine medical categories based on symptoms and conditions
        category_keywords = {
            'Cardiovascular': ['heart', 'chest pain', 'blood pressure', 'palpitation', 'hypertension', 'coronary', 'stroke', 'artery'],
            'Respiratory': ['lung', 'breath', 'cough', 'asthma', 'copd', 'pneumonia', 'bronchitis', 'wheezing'],
            'Gastrointestinal': ['stomach', 'abdomen', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'gerd', 'ulcer', 'ibs'],
            'Neurological': ['head', 'brain', 'headache', 'migraine', 'dizziness', 'seizure', 'epilepsy', 'multiple sclerosis', 'parkinson'],
            'Musculoskeletal': ['muscle', 'bone', 'joint', 'back', 'arthritis', 'osteoporosis', 'fracture', 'sprain', 'strain'],
            'Dermatological': ['skin', 'rash', 'itch', 'acne', 'eczema', 'psoriasis', 'dermatitis', 'hives'],
            'Endocrine': ['diabetes', 'thyroid', 'hormone', 'insulin', 'glucose', 'hyperthyroidism', 'hypothyroidism'],
            'Psychiatric': ['anxiety', 'depression', 'stress', 'bipolar', 'schizophrenia', 'mental', 'mood', 'panic'],
            'Infectious': ['fever', 'infection', 'virus', 'bacterial', 'flu', 'cold', 'covid', 'pneumonia']
        }

        # Check all extracted entities against category keywords
        all_extracted_terms = ' '.join([' '.join(entities['symptoms']), ' '.join(entities['conditions']), processed_text])

        for category, keywords in category_keywords.items():
            for keyword in keywords:
                if keyword in all_extracted_terms:
                    entities['categories'].append(category)
                    break

        # Also check against common symptoms from config
        for category, symptoms in COMMON_SYMPTOMS.items():
            for symptom in symptoms:
                if symptom in all_extracted_terms and category not in entities['categories']:
                    entities['categories'].append(category)
                    break

        # Remove duplicates in categories
        entities['categories'] = list(set(entities['categories']))

        return entities

if __name__ == "__main__":
    # Test the data processor
    processor = MedicalDataProcessor()

    # Test text cleaning
    sample_text = "I've been experiencing severe headaches for 3 days. What could be causing this?"
    cleaned_text = processor.clean_text(sample_text)
    print(f"Original: {sample_text}")
    print(f"Cleaned: {cleaned_text}")

    # Test entity extraction
    entities = processor.extract_medical_entities(sample_text)
    print(f"Extracted entities: {entities}")

    # Test dataset preparation if data file exists
    if os.path.exists(FILE_PATHS["synthetic_data_path"]):
        train_dataset, test_dataset = processor.prepare_dataset()
        print(f"Train dataset size: {len(train_dataset['input_ids'])}")
        print(f"Test dataset size: {len(test_dataset['input_ids'])}")
