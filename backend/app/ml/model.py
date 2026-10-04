import io
import logging
import json
from pathlib import Path
from typing import Dict, Any, Tuple
from PIL import Image
import numpy as np

from app.ml.classes import PLANT_CLASSES, parse_class_name

logger = logging.getLogger(__name__)
MODEL_DIR = Path(__file__).resolve().parent
CLASS_INDICES_PATH = MODEL_DIR / "class_indices.json"
MODEL_PATHS = [
    MODEL_DIR / "model_4_mobilenet_finetuned.keras",
    MODEL_DIR / "crop_model.h5",
    MODEL_DIR / "crop_model.keras",
    MODEL_DIR / "crop_model.tflite"
]

class CropDiseaseModel:
    def __init__(self):
        self.model = None
        self.is_tflite = False
        self.interpreter = None
        self.classes = PLANT_CLASSES
        self._load_class_indices()
        self.input_shape = (224, 224)
        self.loaded = False
        self.engine_type = "unavailable"
        self._load_model()

    def _load_class_indices(self):
        if not CLASS_INDICES_PATH.exists():
            return
        with CLASS_INDICES_PATH.open("r", encoding="utf-8") as file:
            mapping = json.load(file)
        ordered_classes = [name for name, _ in sorted(mapping.items(), key=lambda item: item[1])]
        if ordered_classes != PLANT_CLASSES:
            raise ValueError("class_indices.json does not match the verified model class order")

    def _load_model(self):
        """Attempts to load a trained model file if available."""
        for path in MODEL_PATHS:
            if path.exists():
                try:
                    if path.suffix == ".tflite":
                        import tensorflow as tf
                        self.interpreter = tf.lite.Interpreter(model_path=str(path))
                        self.interpreter.allocate_tensors()
                        self.is_tflite = True
                        self.engine_type = "tflite"
                        self.loaded = True
                        logger.info("Loaded TFLite crop model: %s", path.name)
                        return
                    else:
                        from tensorflow import keras
                        self.model = keras.models.load_model(
                            str(path), safe_mode=True, compile=False
                        )
                        output_units = self.model.output_shape[-1]
                        if output_units != len(self.classes):
                            raise ValueError(
                                f"Expected {len(self.classes)} output units, found {output_units}"
                            )
                        self.engine_type = "keras_cnn"
                        self.loaded = True
                        logger.info("Loaded Keras crop model: %s", path.name)
                        return
                except Exception as e:
                    logger.warning("Could not load crop model from %s: %s", path, e, exc_info=True)
        
        logger.error("No supported trained model weights found in %s; predictions are disabled", MODEL_DIR)
        self.engine_type = "unavailable"

    def preprocess_image(self, image_bytes: bytes) -> Tuple[Image.Image, np.ndarray]:
        """Resize to the model input and preserve raw 0-255 RGB pixels."""
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        resized = img.resize(self.input_shape, Image.Resampling.BILINEAR)
        arr = np.array(resized, dtype=np.float32)
        return img, np.expand_dims(arr, axis=0)

    def predict(self, image_bytes: bytes, filename: str = "") -> Dict[str, Any]:
        """
        Runs model prediction on the leaf image.
        Returns predicted class_id, crop_name, disease_name, confidence score, and top probabilities.
        """
        if not self.loaded:
            raise RuntimeError(
                "The trained disease model is unavailable. Install verified model weights before scanning."
            )

        _, tensor = self.preprocess_image(image_bytes)

        if self.loaded and self.model is not None:
            preds = np.asarray(self.model.predict(tensor, verbose=0)[0]).reshape(-1)
            top_idx = int(np.argmax(preds))
            confidence = float(preds[top_idx] * 100.0)
            class_id = self.classes[top_idx] if top_idx < len(self.classes) else self.classes[0]
            
            # Format top 3
            top3_indices = np.argsort(preds)[-3:][::-1]
            top_probs = [
                {
                    "class_id": self.classes[i],
                    "confidence": round(float(preds[i] * 100.0), 2)
                }
                for i in top3_indices if i < len(self.classes)
            ]
        elif self.loaded and self.interpreter is not None:
            input_details = self.interpreter.get_input_details()
            output_details = self.interpreter.get_output_details()
            input_tensor = tensor
            if input_details[0]["dtype"] == np.uint8:
                input_tensor = np.clip(tensor, 0, 255).astype(np.uint8)
            self.interpreter.set_tensor(input_details[0]['index'], input_tensor)
            self.interpreter.invoke()
            preds = self.interpreter.get_tensor(output_details[0]['index'])[0]
            top_idx = int(np.argmax(preds))
            confidence = float(preds[top_idx] * 100.0)
            class_id = self.classes[top_idx] if top_idx < len(self.classes) else self.classes[0]
            top3_indices = np.argsort(preds)[-3:][::-1]
            top_probs = [
                {
                    "class_id": self.classes[i],
                    "confidence": round(float(preds[i] * 100.0), 2)
                }
                for i in top3_indices if i < len(self.classes)
            ]
        else:
            raise RuntimeError("No usable trained inference engine is loaded")

        crop_name, disease_name = parse_class_name(class_id)
        logger.info(
            "Prediction engine=%s class=%s confidence=%.2f top3=%s",
            self.engine_type,
            class_id,
            confidence,
            top_probs,
        )
        return {
            "class_id": class_id,
            "crop_name": crop_name,
            "disease_name": disease_name,
            "confidence": round(confidence, 2),
            "engine": self.engine_type,
            "top_probabilities": top_probs
        }

# Singleton instance loaded once at startup
classifier = CropDiseaseModel()
