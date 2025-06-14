# Medical AI Model Training

This repository contains the code for training a medical AI model using synthetic data. The model is designed to understand and respond to medical queries.

## Project Structure

```
.
├── data/               # Directory for synthetic training data
├── models/            # Directory for saved models
├── logs/             # Training logs and plots
├── train_model.py    # Main training script
├── data_generator.py # Synthetic data generation
├── data_processor.py # Data processing utilities
├── model.py         # Model architecture and training logic
├── config.py        # Configuration settings
└── requirements.txt # Project dependencies
```

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Generate Synthetic Data

The synthetic data generator creates medical conversations for training:

```bash
python data_generator.py
```

This will create a dataset in the `data/` directory.

### Train the Model

To train the model with default settings:

```bash
python train_model.py
```

Optional arguments:
- `--data`: Path to training data (default: uses synthetic data)
- `--output`: Path to save the trained model
- `--samples`: Number of synthetic samples to generate
- `--epochs`: Number of training epochs
- `--batch_size`: Batch size for training
- `--patience`: Number of epochs to wait before early stopping
- `--no_plot`: Disable plotting of training statistics

Example with custom settings:
```bash
python train_model.py --samples 10000 --epochs 50 --batch_size 32
```

### Training Process

1. If no training data exists, synthetic data is generated
2. Data is processed and split into training/validation sets
3. Model is trained with early stopping
4. Training statistics are plotted (loss, accuracy, etc.)
5. Trained model is saved to the `models/` directory

### Model Architecture

The model uses a transformer-based architecture optimized for medical text understanding. Key features:
- Transformer encoder-decoder architecture
- Medical domain-specific tokenization
- Multi-class classification for medical categories
- Early stopping for optimal training

## Configuration

Edit `config.py` to modify:
- Model parameters
- Training settings
- Data generation parameters
- File paths and directories

## Logs and Monitoring

Training progress is logged to:
- Console output
- Log file in `logs/training.log`
- Training plots in `logs/plots/`
