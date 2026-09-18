import os
from typing import Any, Dict
from sqlalchemy.orm import Session
from services import scheme_service


def generate_chat_response(db: Session, profile_id: int, message: str) -> Dict[str, Any]:
    """
    Generate an explainable AI assistant response grounded strictly in backend eligibility calculations.
    
    Principles:
    1. The AI explains deterministic eligibility results rather than inventing or deciding them.
    2. If an OPENAI_API_KEY is configured in the environment, it can ground an LLM call.
    3. If no LLM credentials are set, it returns an intelligent deterministic explanation based
       on the user's matched schemes and queries.
    """
    matches_data = scheme_service.match_schemes_for_profile(db, profile_id)
    if not matches_data:
        return {
            "response": f"Profile with ID {profile_id} could not be found. Please create or verify your citizen profile first.",
            "mode": "rule_based_assistant",
            "grounded_context": None
        }

    citizen_name = matches_data["citizen_name"]
    eligible_schemes = [m for m in matches_data["matches"] if m["status"] == "eligible"]
    ineligible_schemes = [m for m in matches_data["matches"] if m["status"] == "ineligible"]

    openai_api_key = os.getenv("OPENAI_API_KEY")

    # If OpenAI API Key is present, we could invoke OpenAI with strict system grounding
    if openai_api_key:
        try:
            import urllib.request
            import json

            system_prompt = (
                "You are SchemeSaathi AI, a friendly and empathetic government scheme discovery assistant. "
                "CRITICAL: The backend has ALREADY computed deterministic eligibility. You MUST NEVER recalculate "
                "or alter eligibility conclusions. You only explain the provided facts clearly to the citizen.\n"
                f"Citizen Profile: {citizen_name}\n"
                f"Eligible schemes ({len(eligible_schemes)}): {json.dumps(eligible_schemes)}\n"
                f"Ineligible schemes ({len(ineligible_schemes)}): {json.dumps(ineligible_schemes)}\n"
            )

            req_payload = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": message}
                ],
                "temperature": 0.3
            }

            req = urllib.request.Request(
                "https://api.openai.com/v1/chat/completions",
                data=json.dumps(req_payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {openai_api_key}"
                }
            )

            with urllib.request.urlopen(req, timeout=10) as resp:
                result_json = json.loads(resp.read().decode("utf-8"))
                llm_reply = result_json["choices"][0]["message"]["content"]
                return {
                    "response": llm_reply,
                    "mode": "llm_grounded",
                    "grounded_context": {
                        "eligible_count": len(eligible_schemes),
                        "total_evaluated": matches_data["total_schemes_evaluated"]
                    }
                }
        except Exception as e:
            # Fallback smoothly to deterministic assistant if external LLM fails or times out
            pass

    # Deterministic natural language synthesis (Development / Hackathon default)
    user_msg_lower = message.lower()

    if any(q in user_msg_lower for q in ["eligible", "schemes", "benefit", "apply", "which", "what", "find"]):
        if eligible_schemes:
            scheme_bullets = "\n".join([
                f"• **{s['scheme_name']}** ({s['category']}): {s['benefits']}"
                for s in eligible_schemes
            ])
            explanation = (
                f"Namaste {citizen_name}! Based on your verified profile, you are currently eligible for "
                f"**{len(eligible_schemes)} government scheme(s)**:\n\n{scheme_bullets}\n\n"
                f"Would you like guidance on the required documents or help tracking your application?"
            )
        else:
            ineligible_summary = "; ".join([f"{s['scheme_name']}: {s['reason']}" for s in ineligible_schemes[:3]])
            explanation = (
                f"Namaste {citizen_name}. Currently, based on your registered details, you do not meet the criteria "
                f"for the evaluated schemes ({ineligible_summary}). You may update your profile or explore other state-level initiatives."
            )
    elif any(q in user_msg_lower for q in ["document", "docs", "upload", "proof", "aadhaar", "certificate"]):
        explanation = (
            f"Hello {citizen_name}, to proceed with your eligible schemes, common required documents include:\n"
            f"1. **Identity Proof**: Aadhaar Card or Voter ID\n"
            f"2. **Income Certificate**: Issued by competent revenue authorities\n"
            f"3. **Bank Account Passbook**: Linked to Aadhaar for Direct Benefit Transfer (DBT)\n"
            f"4. **Category/Occupation Proof**: Student ID card or Land records/Farmer registration if applicable.\n\n"
            f"You can upload these via the `/api/documents/analyze` endpoint for automatic record verification."
        )
    else:
        explanation = (
            f"Hello {citizen_name}! I am your SchemeSaathi AI assistant. "
            f"You are currently matched with {len(eligible_schemes)} eligible schemes. "
            f"You can ask me: 'Which schemes am I eligible for?', 'What documents do I need?', or 'How do I apply?'"
        )

    return {
        "response": explanation,
        "mode": "rule_based_assistant",
        "grounded_context": {
            "eligible_count": len(eligible_schemes),
            "total_evaluated": matches_data["total_schemes_evaluated"],
            "note": "Response synthesized deterministically from backend rule evaluation. Ready for AWS Bedrock/OpenAI integration."
        }
    }
