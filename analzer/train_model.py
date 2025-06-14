"""
Script to train the medical transformer model and save it as a pickle file.
"""

import os
import sys
import argparse
import logging
import pickle
import torch
import matplotlib.pyplot as plt
import numpy as np
from tqdm import tqdm
import nltk
nltk.download('punkt_tab')

# Import local modules
from data_generator import SyntheticMedicalDataGenerator
from data_processor import MedicalDataProcessor
from model import MedicalModelTrainer, MedicalTransformer
from config import FILE_PATHS, MEDICAL_CATEGORIES, DATA_CONFIG

# Set up logging
os.makedirs(os.path.dirname(FILE_PATHS["logs_path"]), exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(os.path.dirname(FILE_PATHS["logs_path"]), "training.log")),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def generate_synthetic_data(num_samples=None, save_path=None):
    """
    Generate synthetic medical data for training.

    Args:
        num_samples: Number of samples to generate
        save_path: Path to save the generated data

    Returns:
        Path to the generated data file
    """
    if num_samples is None:
        num_samples = DATA_CONFIG["num_synthetic_samples"]

    if save_path is None:
        save_path = FILE_PATHS["synthetic_data_path"]

    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    logger.info(f"Generating {num_samples} synthetic medical data samples...")

    # Generate data
    generator = SyntheticMedicalDataGenerator(
        num_samples=num_samples,
        seed=DATA_CONFIG["seed"]
    )

    df = generator.generate_dataset(save_path=save_path)

    logger.info(f"Synthetic data generated and saved to {save_path}")

    return save_path

def train_model(data_path=None, model_save_path=None, epochs=None, batch_size=None, patience=10):
    """
    Train the medical transformer model with early stopping.

    Args:
        data_path: Path to the training data
        model_save_path: Path to save the trained model
        epochs: Number of training epochs
        batch_size: Batch size for training
        patience: Number of epochs to wait for improvement before early stopping

    Returns:
        Dictionary of training statistics
    """
    if data_path is None:
        data_path = FILE_PATHS["synthetic_data_path"]

    if model_save_path is None:
        model_save_path = FILE_PATHS["model_save_path"]

    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(model_save_path), exist_ok=True)

    # Check if data exists
    if not os.path.exists(data_path):
        logger.info(f"Training data not found at {data_path}")
        data_path = generate_synthetic_data(save_path=data_path)

    logger.info("Preparing dataset...")

    # Initialize data processor
    processor = MedicalDataProcessor()

    # Prepare dataset
    train_dataset, test_dataset = processor.prepare_dataset(
        data_path=data_path,
        test_size=1 - DATA_CONFIG["train_test_split"],
        random_state=DATA_CONFIG["seed"]
    )

    logger.info(f"Dataset prepared. Train size: {len(train_dataset['input_ids'])}, Test size: {len(test_dataset['input_ids'])}")

    # Initialize trainer
    trainer = MedicalModelTrainer(num_labels=len(MEDICAL_CATEGORIES))

    # Override training parameters if provided
    if epochs is not None:
        trainer.num_epochs = epochs

    if batch_size is not None:
        trainer.batch_size = batch_size

    logger.info(f"Training with {trainer.num_epochs} epochs and batch size {trainer.batch_size}")

    # Create dataloaders
    train_dataloader, test_dataloader = trainer.create_dataloaders(train_dataset, test_dataset)

    # Train model
    logger.info("Starting model training with early stopping...")
    training_stats = trainer.train(
        train_dataloader=train_dataloader,
        test_dataloader=test_dataloader,
        save_path=model_save_path,
        patience=patience
    )

    logger.info(f"Model training complete! Model saved to {model_save_path}")

    return training_stats

def plot_training_stats(training_stats, save_path=None):
    """
    Plot training statistics.

    Args:
        training_stats: Dictionary of training statistics
        save_path: Path to save the plot
    """
    # Create plots directory if it doesn't exist
    plots_dir = os.path.join(os.path.dirname(FILE_PATHS["logs_path"]), "plots")
    os.makedirs(plots_dir, exist_ok=True)

    if save_path is None:
        save_path = os.path.join(plots_dir, "training_stats.png")

    # Extract data
    epochs = [stat['epoch'] for stat in training_stats]
    train_loss = [stat['train_loss'] for stat in training_stats]

    if 'eval_loss' in training_stats[0]:
        eval_loss = [stat['eval_loss'] for stat in training_stats]
        eval_accuracy = [stat['eval_accuracy'] for stat in training_stats]
        eval_precision = [stat['eval_precision'] for stat in training_stats]
        eval_recall = [stat['eval_recall'] for stat in training_stats]
        eval_f1 = [stat['eval_f1'] for stat in training_stats]

        # Create figure with subplots
        fig, axs = plt.subplots(2, 2, figsize=(15, 10))

        # Plot loss
        axs[0, 0].plot(epochs, train_loss, 'b-', label='Training Loss')
        axs[0, 0].plot(epochs, eval_loss, 'r-', label='Validation Loss')
        axs[0, 0].set_title('Training and Validation Loss')
        axs[0, 0].set_xlabel('Epoch')
        axs[0, 0].set_ylabel('Loss')
        axs[0, 0].legend()
        axs[0, 0].grid(True)

        # Plot accuracy
        axs[0, 1].plot(epochs, eval_accuracy, 'g-')
        axs[0, 1].set_title('Validation Accuracy')
        axs[0, 1].set_xlabel('Epoch')
        axs[0, 1].set_ylabel('Accuracy')
        axs[0, 1].grid(True)

        # Plot precision and recall
        axs[1, 0].plot(epochs, eval_precision, 'b-', label='Precision')
        axs[1, 0].plot(epochs, eval_recall, 'r-', label='Recall')
        axs[1, 0].set_title('Validation Precision and Recall')
        axs[1, 0].set_xlabel('Epoch')
        axs[1, 0].set_ylabel('Score')
        axs[1, 0].legend()
        axs[1, 0].grid(True)

        # Plot F1 score
        axs[1, 1].plot(epochs, eval_f1, 'g-')
        axs[1, 1].set_title('Validation F1 Score')
        axs[1, 1].set_xlabel('Epoch')
        axs[1, 1].set_ylabel('F1 Score')
        axs[1, 1].grid(True)
    else:
        # Create figure with single plot
        plt.figure(figsize=(10, 6))
        plt.plot(epochs, train_loss, 'b-')
        plt.title('Training Loss')
        plt.xlabel('Epoch')
        plt.ylabel('Loss')
        plt.grid(True)

    # Adjust layout and save
    plt.tight_layout()
    plt.savefig(save_path)

    logger.info(f"Training statistics plot saved to {save_path}")

def main():
    """Main function to train the model."""
    parser = argparse.ArgumentParser(description='Train the medical transformer model')
    parser.add_argument('--data', type=str, help='Path to training data')
    parser.add_argument('--output', type=str, help='Path to save the trained model')
    parser.add_argument('--samples', type=int, help='Number of synthetic samples to generate')
    parser.add_argument('--epochs', type=int, help='Number of training epochs')
    parser.add_argument('--batch_size', type=int, help='Batch size for training')
    parser.add_argument('--patience', type=int, default=10, help='Number of epochs to wait before early stopping')
    parser.add_argument('--no_plot', action='store_true', help='Disable plotting of training statistics')

    args = parser.parse_args()

    # Generate synthetic data if needed
    if args.data is None and not os.path.exists(FILE_PATHS["synthetic_data_path"]):
        data_path = generate_synthetic_data(num_samples=args.samples)
    else:
        data_path = args.data or FILE_PATHS["synthetic_data_path"]

    # Train model
    training_stats = train_model(
        data_path=data_path,
        model_save_path=args.output or FILE_PATHS["model_save_path"],
        epochs=args.epochs,
        batch_size=args.batch_size,
        patience=args.patience
    )

    # Plot training statistics
    if not args.no_plot and training_stats:
        plot_training_stats(training_stats)

if __name__ == "__main__":
    main()
