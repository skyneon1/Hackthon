"""
Transformer-based model for medical text analysis and response generation.
"""

import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from transformers import BertModel, BertConfig, get_linear_schedule_with_warmup
from torch.optim import AdamW
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import numpy as np
import pickle
import os
import logging
from tqdm import tqdm
from config import MODEL_CONFIG, TRAINING_CONFIG, FILE_PATHS

# Create logs directory if it doesn't exist
os.makedirs(os.path.dirname(FILE_PATHS["logs_path"]), exist_ok=True)

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(os.path.dirname(FILE_PATHS["logs_path"]), "model.log")),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class MedicalTransformer(nn.Module):
    """
    Transformer-based model for medical text analysis.
    """

    def __init__(self, num_labels=9, model_name="bert-base-uncased"):
        """
        Initialize the model.

        Args:
            num_labels: Number of output labels (medical categories)
            model_name: Name of the pre-trained model to use
        """
        super(MedicalTransformer, self).__init__()

        # Load pre-trained BERT model
        self.bert = BertModel.from_pretrained(model_name)

        # Classification head
        self.dropout = nn.Dropout(MODEL_CONFIG["hidden_dropout_prob"])
        self.classifier = nn.Linear(self.bert.config.hidden_size, num_labels)

        # Response generation head
        self.response_generator = nn.Sequential(
            nn.Linear(self.bert.config.hidden_size, self.bert.config.hidden_size),
            nn.ReLU(),
            nn.Dropout(MODEL_CONFIG["hidden_dropout_prob"]),
            nn.Linear(self.bert.config.hidden_size, self.bert.config.hidden_size)
        )

    def forward(self, input_ids, attention_mask, token_type_ids=None, labels=None):
        """
        Forward pass through the model.

        Args:
            input_ids: Token IDs
            attention_mask: Attention mask
            token_type_ids: Token type IDs
            labels: Optional labels for loss calculation

        Returns:
            Dictionary containing model outputs
        """
        # Get BERT outputs
        outputs = self.bert(
            input_ids=input_ids,
            attention_mask=attention_mask,
            token_type_ids=token_type_ids
        )

        # Get the [CLS] token representation
        pooled_output = outputs.pooler_output
        pooled_output = self.dropout(pooled_output)

        # Classification logits
        logits = self.classifier(pooled_output)

        # Response generation features
        response_features = self.response_generator(pooled_output)

        # Calculate loss if labels are provided
        loss = None
        if labels is not None:
            loss_fn = nn.CrossEntropyLoss()
            loss = loss_fn(logits, labels)

        return {
            'loss': loss,
            'logits': logits,
            'response_features': response_features,
            'hidden_states': outputs.hidden_states
        }

class MedicalModelTrainer:
    """
    Trainer for the medical transformer model.
    """

    def __init__(self, num_labels=9, model_name="bert-base-uncased"):
        """
        Initialize the trainer.

        Args:
            num_labels: Number of output labels (medical categories)
            model_name: Name of the pre-trained model to use
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Using device: {self.device}")

        self.model = MedicalTransformer(num_labels=num_labels, model_name=model_name)
        self.model.to(self.device)

        # Training parameters
        self.batch_size = TRAINING_CONFIG["batch_size"]
        self.learning_rate = TRAINING_CONFIG["learning_rate"]
        self.num_epochs = TRAINING_CONFIG["num_train_epochs"]
        self.warmup_steps = TRAINING_CONFIG["warmup_steps"]
        self.weight_decay = TRAINING_CONFIG["weight_decay"]

    def create_dataloaders(self, train_dataset, test_dataset):
        """
        Create DataLoaders for training and evaluation.

        Args:
            train_dataset: Training dataset
            test_dataset: Test dataset

        Returns:
            Tuple of (train_dataloader, test_dataloader)
        """
        # Create TensorDatasets
        train_tensor_dataset = TensorDataset(
            train_dataset['input_ids'],
            train_dataset['attention_mask'],
            train_dataset['labels']
        )

        test_tensor_dataset = TensorDataset(
            test_dataset['input_ids'],
            test_dataset['attention_mask'],
            test_dataset['labels']
        )

        # Create DataLoaders
        train_dataloader = DataLoader(
            train_tensor_dataset,
            batch_size=self.batch_size,
            shuffle=True
        )

        test_dataloader = DataLoader(
            test_tensor_dataset,
            batch_size=self.batch_size
        )

        return train_dataloader, test_dataloader

    def train(self, train_dataloader, test_dataloader=None, save_path=None, patience=10):
        """
        Train the model with early stopping.

        Args:
            train_dataloader: DataLoader for training data
            test_dataloader: Optional DataLoader for evaluation
            save_path: Path to save the trained model
            patience: Number of epochs to wait for improvement before early stopping

        Returns:
            Dictionary containing training metrics
        """
        # Prepare optimizer and scheduler
        optimizer = AdamW(
            self.model.parameters(),
            lr=self.learning_rate,
            weight_decay=self.weight_decay
        )

        total_steps = len(train_dataloader) * self.num_epochs
        scheduler = get_linear_schedule_with_warmup(
            optimizer,
            num_warmup_steps=self.warmup_steps,
            num_training_steps=total_steps
        )

        # Training loop
        logger.info("Starting training with early stopping (patience={})...".format(patience))

        training_stats = []
        best_accuracy = 0.0
        best_loss = float('inf')
        no_improvement_count = 0

        for epoch in range(self.num_epochs):
            logger.info(f"Epoch {epoch+1}/{self.num_epochs}")

            # Training
            self.model.train()
            train_loss = 0.0

            progress_bar = tqdm(train_dataloader, desc="Training")
            for batch in progress_bar:
                # Move batch to device
                batch = tuple(t.to(self.device) for t in batch)
                input_ids, attention_mask, labels = batch

                # Zero gradients
                optimizer.zero_grad()

                # Forward pass
                outputs = self.model(
                    input_ids=input_ids,
                    attention_mask=attention_mask,
                    labels=labels
                )

                loss = outputs['loss']

                # Backward pass
                loss.backward()

                # Clip gradients
                torch.nn.utils.clip_grad_norm_(self.model.parameters(), 1.0)

                # Update parameters
                optimizer.step()
                scheduler.step()

                # Update statistics
                train_loss += loss.item()
                progress_bar.set_postfix({'loss': loss.item()})

            avg_train_loss = train_loss / len(train_dataloader)
            logger.info(f"Average training loss: {avg_train_loss:.4f}")

            # Evaluation
            if test_dataloader is not None:
                eval_metrics = self.evaluate(test_dataloader)
                logger.info(f"Evaluation metrics: {eval_metrics}")

                # Check for improvement
                current_loss = eval_metrics['loss']
                current_accuracy = eval_metrics['accuracy']

                # Save best model
                if save_path and current_accuracy > best_accuracy:
                    best_accuracy = current_accuracy
                    self.save_model(save_path)
                    logger.info(f"Saved best model with accuracy {best_accuracy:.4f}")
                    no_improvement_count = 0  # Reset counter when we find a better model
                elif current_loss < best_loss:
                    best_loss = current_loss
                    no_improvement_count = 0  # Reset counter when loss improves
                else:
                    no_improvement_count += 1
                    logger.info(f"No improvement for {no_improvement_count} epochs")

                # Early stopping check
                if no_improvement_count >= patience:
                    logger.info(f"Early stopping triggered after {epoch+1} epochs")
                    break

                # Record stats
                training_stats.append({
                    'epoch': epoch + 1,
                    'train_loss': avg_train_loss,
                    'eval_loss': eval_metrics['loss'],
                    'eval_accuracy': eval_metrics['accuracy'],
                    'eval_precision': eval_metrics['precision'],
                    'eval_recall': eval_metrics['recall'],
                    'eval_f1': eval_metrics['f1']
                })
            else:
                # Save model periodically if no evaluation
                if save_path and (epoch + 1) % 5 == 0:
                    self.save_model(save_path)
                    logger.info(f"Saved model at epoch {epoch+1}")

                # Check for improvement in training loss
                if avg_train_loss < best_loss:
                    best_loss = avg_train_loss
                    no_improvement_count = 0
                else:
                    no_improvement_count += 1
                    logger.info(f"No improvement for {no_improvement_count} epochs")

                # Early stopping check
                if no_improvement_count >= patience:
                    logger.info(f"Early stopping triggered after {epoch+1} epochs")
                    break

                # Record stats
                training_stats.append({
                    'epoch': epoch + 1,
                    'train_loss': avg_train_loss
                })

        # Save final model if not saved already
        if save_path and not os.path.exists(save_path):
            self.save_model(save_path)
            logger.info("Saved final model")

        logger.info("Training complete!")
        return training_stats

    def evaluate(self, dataloader):
        """
        Evaluate the model.

        Args:
            dataloader: DataLoader for evaluation data

        Returns:
            Dictionary containing evaluation metrics
        """
        self.model.eval()

        total_loss = 0.0
        all_preds = []
        all_labels = []

        with torch.no_grad():
            for batch in tqdm(dataloader, desc="Evaluating"):
                # Move batch to device
                batch = tuple(t.to(self.device) for t in batch)
                input_ids, attention_mask, labels = batch

                # Forward pass
                outputs = self.model(
                    input_ids=input_ids,
                    attention_mask=attention_mask,
                    labels=labels
                )

                loss = outputs['loss']
                logits = outputs['logits']

                # Update statistics
                total_loss += loss.item()

                # Convert logits to predictions
                preds = torch.argmax(logits, dim=1).cpu().numpy()
                labels = labels.cpu().numpy()

                all_preds.extend(preds)
                all_labels.extend(labels)

        # Calculate metrics
        accuracy = accuracy_score(all_labels, all_preds)
        precision, recall, f1, _ = precision_recall_fscore_support(
            all_labels, all_preds, average='weighted'
        )

        return {
            'loss': total_loss / len(dataloader),
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1': f1
        }

    def save_model(self, path):
        """
        Save the model to disk.

        Args:
            path: Path to save the model
        """
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(path), exist_ok=True)

        # Save model using pickle
        with open(path, 'wb') as f:
            pickle.dump(self.model, f)

        logger.info(f"Model saved to {path}")

    @staticmethod
    def load_model(path):
        """
        Load a model from disk.

        Args:
            path: Path to the saved model

        Returns:
            Loaded model
        """
        with open(path, 'rb') as f:
            model = pickle.load(f)

        logger.info(f"Model loaded from {path}")
        return model

class MedicalResponseGenerator:
    """
    Generates medical responses based on the transformer model.
    """

    def __init__(self, model_path=None):
        """
        Initialize the response generator.

        Args:
            model_path: Path to the trained model
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        if model_path and os.path.exists(model_path):
            self.model = MedicalModelTrainer.load_model(model_path)
        else:
            logger.warning("No model path provided or model not found. Initializing new model.")
            self.model = MedicalTransformer()

        self.model.to(self.device)
        self.model.eval()

    def generate_response(self, query, tokenizer):
        """
        Generate a response for a medical query with rule-based fallbacks.

        Args:
            query: User query text
            tokenizer: Tokenizer for processing the query

        Returns:
            Generated response text and category
        """
        import re
        import random
        from config import MEDICAL_CATEGORIES, COMMON_SYMPTOMS

        # Rule-based keyword matching for common medical queries
        query_lower = query.lower()

        # Dictionary of common medical keywords and their categories
        keyword_categories = {
            'heart': 'Cardiovascular',
            'chest pain': 'Cardiovascular',
            'blood pressure': 'Cardiovascular',
            'palpitations': 'Cardiovascular',
            'shortness of breath': 'Respiratory',
            'cough': 'Respiratory',
            'wheezing': 'Respiratory',
            'asthma': 'Respiratory',
            'stomach': 'Gastrointestinal',
            'nausea': 'Gastrointestinal',
            'vomiting': 'Gastrointestinal',
            'diarrhea': 'Gastrointestinal',
            'constipation': 'Gastrointestinal',
            'headache': 'Neurological',
            'migraine': 'Neurological',
            'dizziness': 'Neurological',
            'numbness': 'Neurological',
            'joint pain': 'Musculoskeletal',
            'muscle pain': 'Musculoskeletal',
            'arthritis': 'Musculoskeletal',
            'back pain': 'Musculoskeletal',
            'rash': 'Dermatological',
            'itching': 'Dermatological',
            'skin': 'Dermatological',
            'diabetes': 'Endocrine',
            'thyroid': 'Endocrine',
            'anxiety': 'Psychiatric',
            'depression': 'Psychiatric',
            'stress': 'Psychiatric',
            'fever': 'Infectious',
            'infection': 'Infectious',
            'flu': 'Infectious',
            'cold': 'Infectious'
        }

        # Check for direct keyword matches first
        detected_category = None
        for keyword, category in keyword_categories.items():
            if keyword in query_lower:
                detected_category = category
                break

        # If no direct match, try model prediction
        if not detected_category:
            try:
                # Tokenize the query
                inputs = tokenizer(
                    query,
                    padding='max_length',
                    truncation=True,
                    max_length=128,
                    return_tensors='pt'
                )

                # Move inputs to device
                inputs = {k: v.to(self.device) for k, v in inputs.items()}

                # Generate response
                with torch.no_grad():
                    outputs = self.model(**inputs)

                # Get predicted category
                logits = outputs['logits']
                predicted_class = torch.argmax(logits, dim=1).item()
                detected_category = MEDICAL_CATEGORIES[predicted_class]
            except Exception as e:
                logger.error(f"Error in model prediction: {e}")
                # Fallback to a general category if model fails
                detected_category = random.choice(MEDICAL_CATEGORIES)

        # Get symptoms for the detected category
        symptoms = COMMON_SYMPTOMS[detected_category]
        symptom = random.choice(symptoms)  # Randomly select a symptom from the category

        # Check for specific question types
        if re.search(r'what (is|are|causes)', query_lower) or 'explain' in query_lower:
            # Explanation request
            response_templates = [
                f"{detected_category} conditions affect the {self._get_body_system(detected_category)} and commonly present with symptoms like {symptom}. These conditions can range from mild to severe and may require medical attention.",
                f"{detected_category} issues involve the {self._get_body_system(detected_category)}. Common symptoms include {symptom} and may be caused by various factors including genetics, lifestyle, or environmental triggers.",
                f"In {detected_category} conditions, patients typically experience {symptom} due to changes in the {self._get_body_system(detected_category)}. The severity and specific symptoms can vary widely between individuals."
            ]
        elif re.search(r'treatment|cure|remedy|help', query_lower):
            # Treatment request
            response_templates = [
                f"For {detected_category.lower()} conditions with symptoms like {symptom}, treatments may include {self._get_treatments(detected_category)}. However, it's essential to consult a healthcare provider for proper diagnosis and treatment.",
                f"Managing {detected_category.lower()} symptoms such as {symptom} typically involves {self._get_treatments(detected_category)}. Always seek professional medical advice for personalized treatment options.",
                f"Treatment for {detected_category.lower()} issues often includes {self._get_treatments(detected_category)}. The specific approach depends on the exact diagnosis, which requires professional medical evaluation."
            ]
        elif re.search(r'serious|dangerous|worried|concern', query_lower):
            # Concern about seriousness
            response_templates = [
                f"While some {detected_category.lower()} symptoms like {symptom} can be concerning, it's important to get a proper medical evaluation. {self._get_warning_signs(detected_category)}",
                f"{symptom.capitalize()} and other {detected_category.lower()} symptoms should be evaluated by a healthcare professional, especially if {self._get_warning_signs(detected_category)}",
                f"The seriousness of {detected_category.lower()} symptoms varies widely. {self._get_warning_signs(detected_category)} In any case, consulting with a healthcare provider is recommended."
            ]
        else:
            # General response
            response_templates = [
                f"Based on your description, this could be related to {detected_category.lower()} issues. Common symptoms include {symptom}. I recommend consulting a healthcare professional for proper diagnosis.",
                f"Your query suggests a possible {detected_category.lower()} condition. This often presents with {symptom}. Please seek medical advice for a thorough evaluation.",
                f"This sounds like it might be associated with the {detected_category.lower()} system. {symptom.capitalize()} is a common symptom. A healthcare provider can provide appropriate guidance.",
                f"From what you've described, I'm detecting potential {detected_category.lower()} concerns. Symptoms like {symptom} are common in this category. For accurate diagnosis, please consult a medical professional."
            ]

        response = random.choice(response_templates)

        # Add disclaimer
        response += "\n\nPlease note: This information is not a substitute for professional medical advice, diagnosis, or treatment."

        return response, detected_category

    def _get_body_system(self, category):
        """Get the body system associated with a medical category."""
        body_systems = {
            'Cardiovascular': 'heart and blood vessels',
            'Respiratory': 'lungs and airways',
            'Gastrointestinal': 'digestive system',
            'Neurological': 'brain and nervous system',
            'Musculoskeletal': 'muscles, bones, and joints',
            'Dermatological': 'skin',
            'Endocrine': 'hormone-producing glands',
            'Psychiatric': 'mental health and brain function',
            'Infectious': 'immune system'
        }
        return body_systems.get(category, 'body')

    def _get_treatments(self, category):
        """Get common treatments for a medical category."""
        treatments = {
            'Cardiovascular': 'medication, lifestyle changes, and in some cases, surgical procedures',
            'Respiratory': 'inhalers, breathing treatments, antibiotics for infections, and lifestyle modifications',
            'Gastrointestinal': 'dietary changes, medication, and sometimes surgical intervention',
            'Neurological': 'medication, physical therapy, and lifestyle adjustments',
            'Musculoskeletal': 'physical therapy, pain management, exercise, and sometimes surgery',
            'Dermatological': 'topical treatments, oral medication, and lifestyle changes',
            'Endocrine': 'hormone therapy, medication, and lifestyle modifications',
            'Psychiatric': 'therapy, medication, and self-care strategies',
            'Infectious': 'antibiotics, antivirals, rest, and increased fluid intake'
        }
        return treatments.get(category, 'appropriate medical interventions')

    def _get_warning_signs(self, category):
        """Get warning signs for a medical category."""
        warnings = {
            'Cardiovascular': 'Seek immediate medical attention for severe chest pain, shortness of breath, or loss of consciousness.',
            'Respiratory': 'Seek immediate care if you experience severe difficulty breathing, bluish discoloration of lips or face, or high fever with cough.',
            'Gastrointestinal': 'Warning signs include severe abdominal pain, persistent vomiting, bloody stool, or yellowing of the skin or eyes.',
            'Neurological': 'Immediate medical attention is needed for sudden severe headache, confusion, slurred speech, or sudden weakness/numbness.',
            'Musculoskeletal': 'Seek care for severe pain, inability to bear weight, visible deformity, or significant swelling after injury.',
            'Dermatological': 'Concerning signs include rapidly spreading rash, fever with rash, or changes in size/color/shape of moles.',
            'Endocrine': 'Watch for extreme fatigue, unusual weight changes, excessive thirst/urination, or rapid heart rate.',
            'Psychiatric': 'Emergency help is needed for thoughts of self-harm, inability to perform daily functions, or severe mood changes.',
            'Infectious': 'Seek immediate care for high persistent fever, difficulty breathing, severe headache with stiff neck, or worsening symptoms.'
        }
        return warnings.get(category, 'If symptoms are severe or persistent, seek immediate medical attention.')

if __name__ == "__main__":
    # Test model initialization
    model = MedicalTransformer()
    print(f"Model initialized with {sum(p.numel() for p in model.parameters())} parameters")
