"""Download and verify the Plant-Disease-Detector Keras model.

Run from backend with:
    python -m app.ml.download_verify_model
"""

from __future__ import annotations

import json
import zipfile
from pathlib import Path
from typing import Any

from huggingface_hub import hf_hub_download
from keras import models

from app.ml.classes import PLANT_CLASSES

REPO_ID = "rarfileexe/Plant-Disease-Detector"
MODEL_FILENAME = "model_4_mobilenet_finetuned.keras"
MODEL_PATH = Path(__file__).resolve().parent / MODEL_FILENAME
CLASS_INDICES_PATH = MODEL_PATH.parent / "class_indices.json"


def _contains_unsafe_layer(value: Any) -> bool:
    if isinstance(value, dict):
        class_name = value.get("class_name")
        if class_name in {"Lambda", "PyDataset", "Function"}:
            return True
        return any(_contains_unsafe_layer(item) for item in value.values())
    if isinstance(value, list):
        return any(_contains_unsafe_layer(item) for item in value)
    return False


def verify_model_archive(path: Path) -> None:
    with zipfile.ZipFile(path) as archive:
        if archive.testzip() is not None:
            raise ValueError("The Keras archive failed its ZIP integrity check")
        config_name = "config.json"
        if config_name not in archive.namelist():
            raise ValueError("The Keras archive does not contain config.json")
        config = json.loads(archive.read(config_name))
        if _contains_unsafe_layer(config):
            raise ValueError("The model contains an unsupported executable/custom layer")


def download_and_verify() -> Path:
    downloaded_path = Path(
        hf_hub_download(
            repo_id=REPO_ID,
            filename=MODEL_FILENAME,
            local_dir=MODEL_PATH.parent,
        )
    )
    if downloaded_path.resolve() != MODEL_PATH.resolve():
        downloaded_path.replace(MODEL_PATH)

    verify_model_archive(MODEL_PATH)
    model = models.load_model(MODEL_PATH, safe_mode=True, compile=False)
    output_shape = model.output_shape
    output_units = output_shape[-1] if output_shape else None
    if output_units != len(PLANT_CLASSES):
        raise ValueError(f"Expected 38 output units, found {output_units}")
    if not any("mobilenetv2" in layer.name.lower() for layer in model.layers):
        raise ValueError("The model does not contain a MobileNetV2 backbone")
    if getattr(model.layers[-1], "activation", None).__name__ != "softmax":
        raise ValueError("The final model layer is not a softmax classifier")

    CLASS_INDICES_PATH.write_text(
        json.dumps({class_name: index for index, class_name in enumerate(PLANT_CLASSES)}, indent=2),
        encoding="utf-8",
    )

    print(f"Verified model: {MODEL_PATH}")
    print(f"Input shape: {model.input_shape}")
    print(f"Output shape: {model.output_shape}")
    model.summary()
    return MODEL_PATH


if __name__ == "__main__":
    download_and_verify()
