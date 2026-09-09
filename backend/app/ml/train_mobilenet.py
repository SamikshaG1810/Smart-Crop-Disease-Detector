"""
AgroScan MobileNetV2 Training Script
Trains a transfer learning CNN on the PlantVillage dataset.
Outputs: crop_model.h5 or crop_model.keras in app/ml/

Usage:
  python train_mobilenet.py --data_dir /path/to/plantvillage --epochs 15 --batch_size 32
"""

import os
import argparse
from pathlib import Path
import tensorflow as tf
from tensorflow.keras import layers, models, applications, callbacks

from classes import PLANT_CLASSES

def build_model(num_classes: int, input_shape=(224, 224, 3)):
    # Base pretrained model without top classification layer
    base_model = applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False  # Freeze backbone for initial fine-tuning

    inputs = layers.Input(shape=input_shape)
    # Augmentation
    x = layers.RandomFlip("horizontal_and_vertical")(inputs)
    x = layers.RandomRotation(0.15)(x)
    x = layers.RandomZoom(0.1)(x)
    # Preprocessing
    x = applications.mobilenet_v2.preprocess_input(x)
    # Feature extraction
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(256, activation='relu')(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation='softmax')(x)

    model = models.Model(inputs, outputs)
    return model, base_model

def train(data_dir: str, epochs: int = 15, batch_size: int = 32, img_size: int = 224):
    print(f"Loading PlantVillage dataset from: {data_dir}")
    
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="training",
        seed=42,
        image_size=(img_size, img_size),
        batch_size=batch_size
    )

    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=0.2,
        subset="validation",
        seed=42,
        image_size=(img_size, img_size),
        batch_size=batch_size
    )

    class_names = train_ds.class_names
    num_classes = len(class_names)
    print(f"Found {num_classes} classes: {class_names}")

    # Optimize pipeline
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    model, base_model = build_model(num_classes, input_shape=(img_size, img_size, 3))
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    model.summary()

    out_path = Path(__file__).parent / "crop_model.keras"
    cb = [
        callbacks.EarlyStopping(monitor='val_loss', patience=4, restore_best_weights=True),
        callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2),
        callbacks.ModelCheckpoint(str(out_path), monitor='val_accuracy', save_best_only=True)
    ]

    print("Phase 1: Training top classification layers...")
    model.fit(train_ds, validation_data=val_ds, epochs=epochs, callbacks=cb)

    print("Phase 2: Fine-tuning base MobileNetV2 top layers...")
    base_model.trainable = True
    # Freeze the first 100 layers and unfreeze the rest
    for layer in base_model.layers[:100]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    model.fit(train_ds, validation_data=val_ds, epochs=10, callbacks=cb)

    print(f"Model saved successfully to: {out_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train MobileNetV2 on PlantVillage")
    parser.add_argument("--data_dir", type=str, required=True, help="Path to PlantVillage root directory")
    parser.add_argument("--epochs", type=int, default=15)
    parser.add_argument("--batch_size", type=int, default=32)
    args = parser.parse_args()

    train(args.data_dir, args.epochs, args.batch_size)
