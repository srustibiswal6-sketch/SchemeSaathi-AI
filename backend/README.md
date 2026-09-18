# SchemeSaathi AI — Backend

**AI-powered Government Scheme Discovery Assistant**

SchemeSaathi AI enables citizens to discover relevant government welfare schemes, check their eligibility via deterministic backend rules, receive explainable AI assistance in natural language, upload supporting documents, and track their application progress.

---

## Architecture Principles

1. **Deterministic Eligibility Rules**: Eligibility is calculated 100% deterministically by backend rule evaluation (`==`, `!=`, `<`, `<=`, `>`, `>=`). An LLM or arbitrary `eval()` is **never** permitted to decide citizen eligibility.
2. **AI for Explainability**: The AI assistant strictly explains pre-calculated structured eligibility decisions in human language, guides citizens on required documents, and answers questions.
3. **Database Portability**: Built with SQLAlchemy ORM, using SQLite for local development and compatible with PostgreSQL for production deployment.
4. **AWS-Ready Design**: Document services and AI services have clear abstractions ready for AWS Textract (document OCR) and AWS Bedrock / OpenAI.

---

## Directory Structure

```text
backend/
│
├── main.py                          # FastAPI app entry point & router registration
├── test_backend.py                  # Automated test suite for all 12+ API flows
├── requirements.txt                 # Project dependencies
├── .env.example                     # Environment variables configuration template
├── README.md                        # Documentation and usage guide
│
├── database/
│   ├── __init__.py
│   ├── database.py                  # SQLAlchemy engine, session maker, get_db dependency
│   ├── models.py                    # Database models (Citizen, Scheme, Rule, Source, Application, Document)
│   └── seed.py                      # Idempotent database seeder
│
├── data/
│   └── schemes.json                 # Curated real Indian Government schemes
│
├── routes/
│   ├── __init__.py
│   ├── profile.py                   # Citizen profile management (POST, GET, PUT)
│   ├── schemes.py                   # Schemes list, detail, and match ranking
│   ├── eligibility.py               # Deterministic rule evaluation
│   ├── chat.py                      # Conversational assistant
│   ├── documents.py                 # Document upload and analysis
│   └── applications.py              # Application tracking and status updates
│
├── schemas/
│   ├── __init__.py
│   ├── profile.py                   # Pydantic profile validation schemas
│   ├── scheme.py                    # Scheme response and match schemas
│   ├── eligibility.py               # Rule evaluation schemas
│   ├── chat.py                      # Chat request and response schemas
│   ├── document.py                  # Document upload schemas
│   └── application.py               # Application tracking schemas
│
├── services/
│   ├── __init__.py
│   ├── profile_service.py           # Profile CRUD operations
│   ├── scheme_service.py            # Scheme queries and matching algorithms
│   ├── eligibility_service.py       # Deterministic rule evaluator (no eval)
│   ├── ai_service.py                # Grounded explanation assistant
│   ├── document_service.py          # Document file handler & Textract abstraction
│   └── application_service.py       # Application lifecycle management
│
└── uploads/                         # Directory for stored citizen documents
```

---

## Setup & Running the Backend

### 1. Prerequisites
- Python 3.10+ (Python 3.14 supported)
- Windows PowerShell or Command Prompt

### 2. Activate Virtual Environment
Open terminal in `C:\SchemeSaathi-AI\backend`:

```powershell
# In PowerShell:
.\venv\Scripts\Activate.ps1

# Or in Command Prompt (cmd):
venv\Scripts\activate.bat
```

### 3. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 4. Seed Database with Real Government Schemes
The seeder populates schemes from `data/schemes.json` idempotently (safe to re-run):

```powershell
python database/seed.py
```

### 5. Start the FastAPI Server
```powershell
uvicorn main:app --reload
```

The server starts at `http://127.0.0.1:8000`.

### 6. Interactive Swagger Documentation
Open in your browser:
**`http://127.0.0.1:8000/docs`**

---

## API Endpoints Reference

| Category | Method | Endpoint | Description |
|---|---|---|---|
| **Health** | `GET` | `/` | Root status message |
| **Health** | `GET` | `/health` | Health check endpoint |
| **Profile** | `POST` | `/api/profile` | Create citizen profile |
| **Profile** | `GET` | `/api/profile/{profile_id}` | Retrieve citizen profile |
| **Profile** | `PUT` | `/api/profile/{profile_id}` | Update citizen profile |
| **Schemes** | `GET` | `/api/schemes` | List schemes (supports `?category=`, `?state=`, `?active=`) |
| **Schemes** | `GET` | `/api/schemes/{scheme_id}` | Full scheme details with rules and sources |
| **Schemes** | `GET` | `/api/schemes/matches/{profile_id}` | Ranked scheme matches for a citizen (eligible first) |
| **Eligibility** | `POST` | `/api/eligibility/check` | Deterministic evaluation of citizen against scheme |
| **AI Chat** | `POST` | `/api/chat` | AI explanation grounded in pre-calculated results |
| **Documents** | `POST` | `/api/documents/analyze` | Multipart file upload and metadata analysis |
| **Documents** | `GET` | `/api/documents/{profile_id}` | List citizen's uploaded documents |
| **Applications** | `POST` | `/api/applications` | Register new scheme application (`not_started`) |
| **Applications** | `GET` | `/api/applications/{profile_id}` | Track citizen application statuses |
| **Applications** | `PATCH` | `/api/applications/{id}/status` | Update application status |

---

## Example API Requests

### 1. Create Citizen Profile
`POST /api/profile`
```json
{
  "name": "Srusti",
  "age": 21,
  "gender": "Female",
  "state": "Odisha",
  "district": "Khordha",
  "annual_income": 180000,
  "occupation": "Student",
  "student": true,
  "farmer": false
}
```

### 2. Check Scheme Eligibility
`POST /api/eligibility/check`
```json
{
  "profile_id": 1,
  "scheme_id": 3
}
```
**Response:**
```json
{
  "scheme_id": 3,
  "scheme_name": "National Scholarship Scheme (Post-Matric)",
  "profile_id": 1,
  "eligible": true,
  "matched_rules": [
    { "field": "student", "operator": "==", "required": true, "actual": true },
    { "field": "annual_income", "operator": "<=", "required": 250000, "actual": 180000 },
    { "field": "age", "operator": ">=", "required": 15, "actual": 21 }
  ],
  "failed_rules": [],
  "missing_information": [],
  "summary": "Eligible: Citizen satisfied all 3 eligibility criteria."
}
```

### 3. Discover Ranked Matches
`GET /api/schemes/matches/1`
Returns schemes ranked:
1. `status: "eligible"`
2. `status: "missing_information"`
3. `status: "ineligible"`

### 4. AI Chat Explanation
`POST /api/chat`
```json
{
  "profile_id": 1,
  "message": "Which schemes am I eligible for?"
}
```

### 5. Upload Document
`POST /api/documents/analyze`
- Content-Type: `multipart/form-data`
- Fields:
  - `profile_id`: 1
  - `document_type`: "aadhaar"
  - `file`: `aadhaar_card.pdf`

### 6. Track Application
`POST /api/applications`
```json
{
  "profile_id": 1,
  "scheme_id": 3
}
```

---

## Testing

Run the automated test suite covering all 12+ API test cases:

```powershell
python test_backend.py
```

Expected output:
```text
ALL 12 TESTS PASSED SUCCESSFULLY! (100%)
```

---

## Environment Variables & AWS Integration

Refer to `.env.example`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite default `sqlite:///./schemesaathi.db` or PostgreSQL URI |
| `OPENAI_API_KEY` | Optional OpenAI key for LLM-grounded explanations |
| `AWS_ACCESS_KEY_ID` | Optional AWS key for AWS Textract document OCR |
| `AWS_SECRET_ACCESS_KEY` | Optional AWS secret |
| `AWS_REGION` | e.g. `ap-south-1` (Mumbai) |

### AWS Textract Integration Note
`services/document_service.py` is configured with a modular abstraction. When deploying to AWS, integrate `boto3.client('textract')` in `services/document_service.py` without modifying the route handler or frontend contract.
