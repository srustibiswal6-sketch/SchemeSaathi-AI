import io
import json
import sys
from fastapi.testclient import TestClient

from main import app
from database.seed import seed_database

# Ensure database is seeded first
seed_database()

client = TestClient(app)

def run_all_tests():
    print("========================================")
    print("STARTING SCHEMESAATHI AI BACKEND TESTS")
    print("========================================")

    # 1. GET /
    resp = client.get("/")
    assert resp.status_code == 200, f"GET / failed: {resp.text}"
    assert "running" in resp.json()["message"]
    print("[PASS] Test 1: GET / passed.")

    # 2. GET /health
    resp = client.get("/health")
    assert resp.status_code == 200, f"GET /health failed: {resp.text}"
    assert resp.json()["status"] == "healthy"
    print("[PASS] Test 2: GET /health passed.")

    # 3. POST /api/profile
    profile_payload = {
        "name": "Srusti",
        "age": 21,
        "gender": "Female",
        "state": "Odisha",
        "district": "Khordha",
        "annual_income": 180000.0,
        "occupation": "Student",
        "student": True,
        "farmer": False
    }
    resp = client.post("/api/profile", json=profile_payload)
    assert resp.status_code == 201, f"POST /api/profile failed: {resp.text}"
    profile_data = resp.json()
    assert "profile_id" in profile_data
    profile_id = profile_data["profile_id"]
    print(f"[PASS] Test 3: POST /api/profile passed. Created profile ID: {profile_id}")

    # 4. GET /api/profile/{id}
    resp = client.get(f"/api/profile/{profile_id}")
    assert resp.status_code == 200, f"GET /api/profile/{profile_id} failed: {resp.text}"
    assert resp.json()["name"] == "Srusti"
    assert resp.json()["student"] is True
    print("[PASS] Test 4: GET /api/profile/{id} passed.")

    # 5. GET /api/schemes
    resp = client.get("/api/schemes")
    assert resp.status_code == 200, f"GET /api/schemes failed: {resp.text}"
    schemes = resp.json()
    assert len(schemes) >= 6, f"Expected at least 6 schemes, got {len(schemes)}"
    first_scheme_id = schemes[0]["id"]
    print(f"[PASS] Test 5: GET /api/schemes passed. Found {len(schemes)} schemes.")

    # 6. GET /api/schemes/{id}
    resp = client.get(f"/api/schemes/{first_scheme_id}")
    assert resp.status_code == 200, f"GET /api/schemes/{first_scheme_id} failed: {resp.text}"
    scheme_detail = resp.json()
    assert "rules" in scheme_detail
    assert "sources" in scheme_detail
    print(f"[PASS] Test 6: GET /api/schemes/{first_scheme_id} passed. Loaded rules & sources.")

    # 7. POST /api/eligibility/check
    # Let's find the National Scholarship Scheme ID
    scholarship_scheme = next((s for s in schemes if "Scholarship" in s["name"]), schemes[0])
    resp = client.post("/api/eligibility/check", json={
        "profile_id": profile_id,
        "scheme_id": scholarship_scheme["id"]
    })
    assert resp.status_code == 200, f"POST /api/eligibility/check failed: {resp.text}"
    eligibility_result = resp.json()
    assert eligibility_result["eligible"] is True
    assert len(eligibility_result["matched_rules"]) > 0
    print(f"[PASS] Test 7: POST /api/eligibility/check passed. Eligible: {eligibility_result['eligible']}")

    # 8. GET /api/schemes/matches/{profile_id}
    resp = client.get(f"/api/schemes/matches/{profile_id}")
    assert resp.status_code == 200, f"GET /api/schemes/matches/{profile_id} failed: {resp.text}"
    matches_data = resp.json()
    assert "matches" in matches_data
    assert matches_data["eligible_count"] > 0
    # Check ranking: eligible must be first
    first_status = matches_data["matches"][0]["status"]
    assert first_status == "eligible", f"First match should be eligible, got {first_status}"
    print(f"[PASS] Test 8: GET /api/schemes/matches/{profile_id} passed. {matches_data['eligible_count']} eligible schemes ranked first.")

    # 9. POST /api/chat
    chat_payload = {
        "profile_id": profile_id,
        "message": "Which schemes am I eligible for?"
    }
    resp = client.post("/api/chat", json=chat_payload)
    assert resp.status_code == 200, f"POST /api/chat failed: {resp.text}"
    chat_result = resp.json()
    assert "response" in chat_result
    assert "Srusti" in chat_result["response"] or "Scholarship" in chat_result["response"]
    print(f"[PASS] Test 9: POST /api/chat passed. Mode: {chat_result['mode']}")

    # 10. POST /api/documents/analyze
    fake_file_content = b"%PDF-1.4 Mock Aadhaar Document Content for testing"
    files = {
        "file": ("aadhaar_card.pdf", io.BytesIO(fake_file_content), "application/pdf")
    }
    data = {
        "profile_id": str(profile_id),
        "document_type": "aadhaar"
    }
    resp = client.post("/api/documents/analyze", data=data, files=files)
    assert resp.status_code == 201, f"POST /api/documents/analyze failed: {resp.text}"
    doc_result = resp.json()
    assert doc_result["status"] == "uploaded"
    assert doc_result["document_type"] == "aadhaar"
    print(f"[PASS] Test 10: POST /api/documents/analyze passed. Document ID: {doc_result['document_id']}")

    # 11. POST /api/applications
    app_payload = {
        "profile_id": profile_id,
        "scheme_id": scholarship_scheme["id"]
    }
    resp = client.post("/api/applications", json=app_payload)
    assert resp.status_code == 201, f"POST /api/applications failed: {resp.text}"
    app_data = resp.json()
    assert app_data["status"] == "not_started"
    application_id = app_data["id"]
    print(f"[PASS] Test 11: POST /api/applications passed. Application ID: {application_id}")

    # 12. GET /api/applications/{profile_id}
    resp = client.get(f"/api/applications/{profile_id}")
    assert resp.status_code == 200, f"GET /api/applications/{profile_id} failed: {resp.text}"
    apps_list = resp.json()
    assert len(apps_list) >= 1
    assert apps_list[0]["id"] == application_id
    print(f"[PASS] Test 12: GET /api/applications/{profile_id} passed. Found {len(apps_list)} application(s).")

    # 13. PUT /api/profile/{id}
    update_payload = {"annual_income": 190000.0}
    resp = client.put(f"/api/profile/{profile_id}", json=update_payload)
    assert resp.status_code == 200
    assert resp.json()["annual_income"] == 190000.0
    print("[PASS] Test 13: PUT /api/profile/{id} passed.")

    # 14. PATCH /api/applications/{application_id}/status
    status_payload = {"status": "documents_pending"}
    resp = client.patch(f"/api/applications/{application_id}/status", json=status_payload)
    assert resp.status_code == 200
    assert resp.json()["status"] == "documents_pending"
    print("[PASS] Test 14: PATCH /api/applications/{id}/status passed.")

    # 15. GET /api/schemes with filtering
    resp = client.get("/api/schemes?category=Agriculture")
    assert resp.status_code == 200
    agri_schemes = resp.json()
    assert len(agri_schemes) >= 1
    assert all("agri" in s["category"].lower() for s in agri_schemes)
    print(f"[PASS] Test 15: Scheme filtering by category passed. Found {len(agri_schemes)} agriculture schemes.")

    # 16. 404 Error handling test
    resp = client.get("/api/profile/999999")
    assert resp.status_code == 404
    print("[PASS] Test 16: 404 validation for nonexistent profile passed.")


    print("\n========================================")
    print("ALL 12 TESTS PASSED SUCCESSFULLY! (100%)")
    print("========================================")

if __name__ == "__main__":
    run_all_tests()
