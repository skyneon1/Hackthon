"""
Script to create a synthetic dataset file without going through the full training process.
"""

import os
from data_generator import SyntheticMedicalDataGenerator
from config import FILE_PATHS, DATA_CONFIG

def create_synthetic_data():
    """Create a synthetic dataset file."""
    print("Creating synthetic dataset...")
    
    # Create data directory if it doesn't exist
    os.makedirs(os.path.dirname(FILE_PATHS["synthetic_data_path"]), exist_ok=True)
    
    # Generate synthetic data
    generator = SyntheticMedicalDataGenerator(
        num_samples=DATA_CONFIG["num_synthetic_samples"],
        seed=DATA_CONFIG["seed"]
    )
    
    df = generator.generate_dataset(save_path=FILE_PATHS["synthetic_data_path"])
    
    print(f"Synthetic data generated and saved to {FILE_PATHS['synthetic_data_path']}")
    print(f"Generated {len(df)} synthetic medical conversations")
    return True

if __name__ == "__main__":
    create_synthetic_data()
