# SchemeSaathi AI — API Reference

**Base URL (local dev):** `http://localhost:8000`  
**Interactive Docs:** `http://localhost:8000/docs`

---

## System

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Service info and demo mode status |
| GET | `/health` | Health check |

---

## Schemes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/schemes` | List schemes (filter: `category`, `state`, `q`) |
| POST | `/api/schemes/recommend` | **Main endpoint** — recommend schemes for a profile |
| GET | `/api/schemes/{id}` | Full scheme details |
| GET | `/api/schemes/{id}/documents` | Document gap analysis |
| GET | `/api/schemes/{id}/application` | Application steps and portal link |
| GET | `/api/schemes/matches/{profile_id}` | Match schemes for saved profile |

### POST /api/schemes/recommend

**Request:**
```json
{
  "profile": {
    "age": 21,
    "gender": "Female",
    "state": "Odisha",
    "annualIncome": 180000,
    "isStudent": true,
    "isFarmer": false
  }
}
```

**Response:**
```json
{
  "schemes": [
    {
      "id": 1,
      "name": "Post-Matric Scholarship",
      "status": "potentially_eligible",
      "matched_rules": [{"field": "student", "operator": "==", "required": true, "actual": true}],
      "failed_rules": [],
      "missing_information": []
    }
  ],
  "total": 3,
  "potentially_eligible_count": 2,
  "disclaimer": "Always verify on official government portal."
}
```

---

## Eligibility

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/eligibility/check` | Deterministic eligibility check |

### POST /api/eligibility/check

**Request:**
```json
{ "profile_id": 1, "scheme_id": 1 }
```

**Response:**
```json
{
  "scheme_id": 1,
  "scheme_name": "Post-Matric Scholarship",
  "eligible": true,
  "matched_rules": [{"field": "student", "operator": "==", "required": true, "actual": true}],
  "failed_rules": [],
  "missing_information": [],
  "summary": "Eligible: Citizen satisfied all 3 eligibility criteria."
}
```

---

## AI Chat

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | AI assistant chat |

### POST /api/chat

**Request (with profile dict — no DB required):**
```json
{
  "message": "Which schemes am I eligible for?",
  "language": "en",
  "profile": {
    "age": 21,
    "state": "Odisha",
    "annualIncome": 180000,
    "isStudent": true
  }
}
```

**Response:**
```json
{
  "response": "Based on your profile...",
  "mode": "demo_mock",
  "matched_schemes": [{"id": 1, "name": "...", "status": "potentially_eligible"}],
  "grounded_context": {"eligible_count": 2, "disclaimer": "..."}
}
```

---

## Profile

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/profile` | Create citizen profile |
| GET | `/api/profile/{id}` | Get profile |
| PUT | `/api/profile/{id}` | Update profile |

---

## Documents

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/documents/upload` | Upload and analyze document |
| POST | `/api/documents/analyze` | Analyze without saving |
| GET | `/api/documents/profile/{profile_id}` | Get profile documents |

### POST /api/documents/upload

**Request:** `multipart/form-data`
- `file`: Document file (PDF/JPG/PNG, max 10MB)
- `profile_id`: integer
- `document_type`: string (optional, overridden by detection)

**Response:**
```json
{
  "document_id": 1,
  "document_type": "Income Certificate",
  "confidence": 0.91,
  "detected_type": "Income Certificate",
  "extracted_fields": {"holder_name": "[Detected]", "annual_income": "[Detected]"},
  "disclaimer": "This classification is detected — not officially verified.",
  "status": "processed"
}
```

---

## Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 400 | Bad request (validation error) |
| 404 | Resource not found |
| 422 | Pydantic validation failure |
| 500 | Internal server error |
