PLANT_CLASSES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___Healthy",
    "Blueberry___Healthy",
    "Cherry___Powdery_mildew",
    "Cherry___Healthy",
    "Corn___Cercospora_leaf_spot_Gray_leaf_spot",
    "Corn___Common_rust",
    "Corn___Northern_Leaf_Blight",
    "Corn___Healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___Healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___Healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___Healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___Healthy",
    "Raspberry___Healthy",
    "Soybean___Healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___Healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites_Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___Healthy",
]

def parse_class_name(class_id: str) -> tuple[str, str]:
    """
    Parses a PlantVillage class ID into (crop_name, disease_name).
    Example:
      'Tomato___Late_blight' -> ('Tomato', 'Late Blight')
      'Corn_(maize)___Common_rust_' -> ('Corn (Maize)', 'Common Rust')
      'Apple___healthy' -> ('Apple', 'Healthy')
    """
    parts = class_id.split("___")
    crop_raw = parts[0]
    disease_raw = parts[1] if len(parts) > 1 else "Unknown"

    crop_name = crop_raw.replace("_", " ").replace("(maize)", "(Maize)").strip()
    disease_name = disease_raw.replace("_", " ").strip()
    if disease_name.lower() == "healthy":
        disease_name = "Healthy"

    return crop_name, disease_name
