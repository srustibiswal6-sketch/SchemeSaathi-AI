"""
SchemeSaathi AI — Amazon Textract Document Analysis Service

Extracts text from uploaded documents and classifies document type.
In DEMO_MODE, performs intelligent filename-based mock classification.
In production, uses AWS Textract for OCR and text extraction.

IMPORTANT: Extracted data is labelled as 'Detected' — NOT as officially verified.
Final document verification occurs at the official government portal.
"""
import json
import os
import re
from typing import Any, Dict, Optional

DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")
AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")

# Document classification patterns (filename keyword → document type)
DOCUMENT_PATTERNS = [
    (r"aadhaar|aadhar|uid|uidai", "Aadhaar Card", 0.94),
    (r"income|earning|salary|itax|itr", "Income Certificate", 0.91),
    (r"student|bonafide|enrollment|college|university|school", "Student ID / Bonafide Certificate", 0.89),
    (r"bank|passbook|cheque|ifsc|account", "Bank Passbook / Cancelled Cheque", 0.92),
    (r"land|khasra|khata|patta|ror|khatian", "Land Ownership Record", 0.88),
    (r"ration|nfsa|pds|bpl", "Ration Card / NFSA Card", 0.90),
    (r"caste|sc|st|obc|category", "Caste / Category Certificate", 0.87),
    (r"disability|udid|divyang|handicap", "Disability Certificate (UDID)", 0.88),
    (r"business|udyam|msme|gst|shop|license", "Business Registration / Udyam Certificate", 0.86),
    (r"job.*card|mgnrega|nrega", "MGNREGA Job Card", 0.89),
    (r"marksheet|result|grade|transcript|degree", "Marksheet / Degree Certificate", 0.90),
    (r"voter|epic|election", "Voter ID Card", 0.91),
    (r"pan|permanent.*account", "PAN Card", 0.93),
    (r"passport", "Passport", 0.95),
    (r"birth.*cert|dob.*cert", "Birth Certificate", 0.88),
    (r"residence|domicile|nativity", "Residence / Domicile Certificate", 0.87),
]


def classify_document(filename: str, extracted_text: Optional[str] = None) -> Dict[str, Any]:
    """
    Classify a document based on filename and/or extracted text.
    Returns document type, confidence, and mock extracted fields.
    """
    search_text = (filename + " " + (extracted_text or "")).lower()

    for pattern, doc_type, base_confidence in DOCUMENT_PATTERNS:
        if re.search(pattern, search_text):
            return {
                "document_type": doc_type,
                "confidence": base_confidence,
                "detected_from": "filename_and_content" if extracted_text else "filename",
                "disclaimer": (
                    "This classification is detected from the uploaded file — "
                    "not officially verified by any government authority."
                ),
                "extracted_fields": _mock_extracted_fields(doc_type),
            }

    return {
        "document_type": "Unknown Document",
        "confidence": 0.40,
        "detected_from": "filename",
        "disclaimer": (
            "We could not confidently identify this document type. "
            "Please upload a clearer image or ensure the filename reflects the document type."
        ),
        "extracted_fields": {},
    }


def extract_text(file_path: str) -> Optional[str]:
    """
    Extract text from a document file.
    In DEMO_MODE: returns mock extracted text.
    In production: uses AWS Textract.
    """
    if DEMO_MODE:
        return _mock_extract_text(file_path)

    return _textract_extract(file_path)


def analyze_document(file_path: str, filename: str) -> Dict[str, Any]:
    """
    Full document analysis pipeline:
    1. Extract text (Textract or mock)
    2. Classify document type
    3. Return structured result
    """
    extracted_text = extract_text(file_path)
    classification = classify_document(filename, extracted_text)
    return {
        **classification,
        "raw_text_length": len(extracted_text) if extracted_text else 0,
        "file_analyzed": os.path.basename(file_path),
        "mode": "demo" if DEMO_MODE else "aws_textract",
    }


# ---------------------------------------------------------------------------
# AWS Textract integration (production)
# ---------------------------------------------------------------------------

def _textract_extract(file_path: str) -> Optional[str]:
    """Call AWS Textract to extract text from a local file."""
    try:
        import boto3
        client = boto3.client("textract", region_name=AWS_REGION)
        with open(file_path, "rb") as f:
            file_bytes = f.read()
        response = client.detect_document_text(
            Document={"Bytes": file_bytes}
        )
        lines = [
            block["Text"]
            for block in response.get("Blocks", [])
            if block["BlockType"] == "LINE"
        ]
        return " ".join(lines)
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Mock helpers (DEMO_MODE)
# ---------------------------------------------------------------------------

def _mock_extract_text(file_path: str) -> str:
    """Return plausible mock extracted text based on filename."""
    fname = os.path.basename(file_path).lower()
    if "aadhaar" in fname or "aadhar" in fname:
        return "GOVERNMENT OF INDIA UNIQUE IDENTIFICATION AUTHORITY OF INDIA UID 1234 5678 9012 Name: Demo Citizen DOB: 01/01/2003 Address: Village Khordha Odisha 751001"
    if "income" in fname:
        return "CERTIFICATE OF INCOME This is to certify that the annual family income of the bearer is Rs. 1,80,000 (One Lakh Eighty Thousand Only) Issued by Tehsildar Khordha"
    if "student" in fname or "bonafide" in fname:
        return "BONAFIDE CERTIFICATE This is to certify that the student is enrolled in B.Tech Computer Science Engineering 3rd Year Academic Session 2025-26"
    if "bank" in fname or "passbook" in fname:
        return "STATE BANK OF INDIA Account No 12345678901 Account Name Demo Citizen IFSC SBIN0001234 Branch Khordha Odisha"
    return "Document content detected. Please verify on the official government portal."


def _mock_extracted_fields(doc_type: str) -> Dict[str, Any]:
    """Return mock extracted key-value pairs for a known document type."""
    mock_data = {
        "Aadhaar Card": {
            "holder_name": "[Detected from document]",
            "uid_number": "XXXX XXXX [XXXX]",
            "dob": "[Detected from document]",
            "address": "[Detected from document]",
        },
        "Income Certificate": {
            "holder_name": "[Detected from document]",
            "annual_income": "[Detected from document]",
            "issued_by": "[Detected from document]",
            "valid_for_year": "[Detected from document]",
        },
        "Student ID / Bonafide Certificate": {
            "student_name": "[Detected from document]",
            "institution": "[Detected from document]",
            "course": "[Detected from document]",
            "year": "[Detected from document]",
        },
        "Bank Passbook / Cancelled Cheque": {
            "account_name": "[Detected from document]",
            "account_number": "[Detected from document]",
            "ifsc": "[Detected from document]",
            "bank_branch": "[Detected from document]",
        },
    }
    return mock_data.get(doc_type, {"details": "[Detected from document]"})
