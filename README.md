# AgroScan — Smart Crop Disease Detector & Agricultural Health Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=React&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF.svg?style=flat&logo=Vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![MobileNetV2](https://img.shields.io/badge/AI_Model-MobileNetV2_Transfer_Learning-FF6F00.svg?style=flat&logo=tensorflow&logoColor=white)](https://tensorflow.org)

**AgroScan** is a production-grade full-stack precision agriculture web application. It enables farmers, agronomists, and agricultural enterprises to photograph or upload crop foliage, execute convolutional neural network (CNN) pathology diagnostics, and immediately receive detailed clinical assessments including disease classification, confidence ratings, etiology, visual symptoms, and both **OMRI-certified organic** and **conventional chemical treatment protocols**.

---

## Key Features

1. **AgroControl Minimalist SaaS Aesthetic:**
   - Curated palette: Deep forest charcoal (`#14251B`), muted sage green (`#7C8B6B`), and off-white (`#FAFAFA`).
   - Clean typography with tight tracking, generous padding, soft rounded corners (12–16px), and subtle elevations.
2. **Dual-Intake Diagnostic Studio:**
   - Drag-and-drop leaf image uploader with quick one-click demo presets (Tomato Late Blight, Potato Early Blight, Corn Rust, Healthy foliage).
   - Real-time HTML5 camera capture with targeting reticle and camera switching (rear/front).
   - Multi-stage holographic scanning line animation simulating tensor preprocessing and neural feature evaluation.
3. **Clinical Actionable Diagnostic Reports:**
   - PlantVillage pathology classes across high-impact crops (Tomato, Potato, Corn, Apple, Grape, Bell Pepper).
   - Confidence percentage meter with probability distribution breakdown.
   - Color-coded severity badges (Healthy, Low, Moderate, High, Critical).
   - Dual treatment protocols:
     - **Organic / Biological:** Copper fungicides, *Bacillus subtilis*, neem azadirachtin, compost teas.
     - **Chemical / Conventional:** Strobilurins, chlorothalonil, mancozeb, systemic modes of action, pre-harvest safety guidelines.
     - **Preventative Cultural IPM:** Crop rotation, drip irrigation hygiene, airflow spacing.
4. **Interactive Farm Telemetry Dashboard:**
   - KPI Stat Cards: Total Scans, Pathologies Identified, Foliar Health Rate %, Most Affected Crop.
   - Recharts Visualizations: Weekly foliar health trends & crop family distribution.
   - Recent scans table with quick report modal preview.
5. **Historical Scan Log & Encyclopedia:**
   - Filterable scan log with search, crop filtering, severity filtering, and grid/table toggles.
   - Full Crop Library reference encyclopedia with disease profiles and cultural remedies.
6. **Robust Auth & API Architecture:**
   - JWT authentication (`/auth/signup`, `/auth/login`, `/auth/me`) with 1-click Demo Account sign-in.
   - Interactive Swagger API documentation automatically served at `/docs`.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, Tailwind CSS 3.4, Axios, Recharts, Lucide Icons |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, SQLAlchemy ORM, Pydantic v2, PyJWT, Passlib, Pillow |
| **AI / ML** | MobileNetV2 (Keras / TFLite) transfer learning with intelligent chromatic vision fallback |
| **Database** | SQLite (zero-config local development) |

---

## Quickstart: Local Development

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create local environment configuration and replace the example secret
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/macOS

# Create and activate virtual environment (optional)
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI development server (auto-reloads on port 8000)
uvicorn main:app --reload --port 8000
```

- API Base URL: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`
- ReDoc API Reference: `http://localhost:8000/redoc`

> **Note:** On first startup, SQLAlchemy creates missing tables. This is not a migration system. Disease reference data is seeded automatically; demo users and sample scans are only created when `SEED_DEMO_DATA=true`.

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server (runs on port 5173)
npm run dev
```

- Web App: `http://localhost:5173`

---

## Demo Account Credentials

Demo data is disabled by default. Set `SEED_DEMO_DATA=true` in the backend environment before startup to enable this account.

Use the **"Instant Demo Sign-In"** button on the login screen or enter:
- **Email:** `farmer@agroscan.com`
- **Password:** `AgroScan2025!`

---

---

## AI Model: MobileNetV2 Transfer Learning

Inference is modularized in `backend/app/ml/model.py`.

- **Verified pretrained model:** Run `python -m app.ml.download_verify_model` from `backend` to download the Hugging Face MobileNetV2 model and generate its matching `class_indices.json` file. The verifier checks archive integrity, rejects unsafe executable layers, confirms the MobileNetV2 backbone, and requires a 38-unit softmax output.
- **Inference preprocessing:** The model contains its own `[-1, 1]` preprocessing layer. The backend only converts uploads to RGB and resizes them to `224x224`; it does not normalize them a second time.
- **Fallback:** If the verified model file is absent, the backend uses the heuristic analyzer for demos and reports that mode in logs. It is not a substitute for a validated disease model.
- **Training Script:** You can train your own MobileNetV2 model on the complete PlantVillage dataset using `backend/app/ml/train_mobilenet.py`:
  ```bash
  python app/ml/train_mobilenet.py --data_dir /path/to/PlantVillage --epochs 15 --batch_size 32
  ```

---

## Project Structure

```
smart crop disease/
├── README.md
├── backend/
│   ├── requirements.txt
│   ├── .env.example
│   ├── main.py                  # FastAPI entrypoint, startup seeder & routes
│   └── app/
│       ├── config.py            # Pydantic settings & CORS configuration
│       ├── database.py          # SQLAlchemy session engine
│       ├── models/              # User, Scan, and DiseaseInfo ORM models
│       ├── schemas/             # Pydantic input/output schemas
│       ├── routes/              # Auth, Scans, Crops, and Analytics REST APIs
│       ├── ml/
│       │   ├── model.py         # Isolated inference engine & singleton loader
│       │   ├── classes.py       # PlantVillage class IDs & parsers
│       │   └── train_mobilenet.py # MobileNetV2 transfer learning training pipeline
│       ├── data/
│       │   └── disease_seed.json# Full agronomic knowledge base & treatments
│       └── utils/
│           ├── security.py      # Bcrypt hashing & PyJWT token handler
│           └── file_storage.py  # Image upload handler
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js       # AgroControl theme tokens & soft shadows
    ├── index.html
    └── src/
        ├── api/                 # Axios client, auth, scans, and crops services
        ├── context/             # React AuthContext (JWT & demo user state)
        ├── components/
        │   ├── common/          # Navbar, Sidebar, StatCard, SeverityBadge, Modal
        │   ├── scan/            # Dropzone, CameraCapture, ScanningAnimation, ResultCard
        │   └── dashboard/       # ScanTrendsChart, DiseaseDistributionChart, RecentScans
        └── pages/
            ├── LandingPage.jsx  # Hero, how it works, feature highlights
            ├── LoginPage.jsx    # Auth login + 1-click demo button
            ├── SignupPage.jsx   # Agronomist registration
            ├── DashboardPage.jsx# SaaS dashboard with KPI metrics & charts
            ├── ScanPage.jsx     # Leaf upload, camera capture & diagnosis
            ├── HistoryPage.jsx  # Searchable scan log with grid/table view
            ├── CropLibraryPage.jsx # Plant disease encyclopedia
            └── SettingsPage.jsx # Farm profile & language preferences
```

---

## License
MIT License. Created for precision agriculture disease prevention.
