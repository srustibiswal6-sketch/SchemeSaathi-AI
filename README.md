# SchemeSaathi-AI

**AI-powered Government Scheme Discovery Assistant**

SchemeSaathi AI helps citizens discover relevant government welfare schemes, check deterministic eligibility, receive natural-language explanations, upload supporting documents, and track their applications.

---

## Key Highlights

- **Deterministic Eligibility Engine**: Strict, rule-based matching (`==`, `!=`, `<`, `<=`, `>`, `>=`) with zero LLM hallucination.
- **Explainability-Only AI**: Natural language assistant designed to explain pre-calculated results and document requirements.
- **FastAPI Backend**: Clean architecture with modular schemas, services, and routes.
- **SQLite / PostgreSQL Compatible**: Relational design using SQLAlchemy ORM.
- **AWS Integration Ready**: Modular abstractions prepared for AWS Textract (OCR) and Bedrock.

---

## Quick Start (Backend)

For full backend documentation, API references, and testing instructions, see [backend/README.md](backend/README.md).

```powershell
# Navigate to backend
cd backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Seed schemes into database
python database/seed.py

# Start FastAPI server
uvicorn main:app --reload
```

Interactive Swagger documentation is available at:
**`http://127.0.0.1:8000/docs`**
