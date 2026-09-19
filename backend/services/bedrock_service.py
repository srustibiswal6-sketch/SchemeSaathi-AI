"""
SchemeSaathi AI — Amazon Bedrock Service

Abstraction layer for LLM-based explanations via Amazon Bedrock.
When DEMO_MODE=true, returns high-quality mock responses without requiring AWS credentials.

Principles:
- The LLM EXPLAINS deterministic eligibility results. It does NOT decide eligibility.
- Prompts are constructed to prevent hallucination of scheme details.
- All scheme data passed to LLM comes from the structured database.
"""
import json
import os
from typing import Any, Dict, List, Optional

DEMO_MODE = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")
BEDROCK_MODEL_ID = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-haiku-20240307-v1:0")
AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")


def _get_bedrock_client():
    """Lazily initialize boto3 Bedrock client."""
    import boto3
    return boto3.client(
        service_name="bedrock-runtime",
        region_name=AWS_REGION,
    )


def _invoke_claude(prompt: str, max_tokens: int = 512) -> str:
    """
    Invoke Claude via Bedrock with a strict system grounding prompt.
    Returns the model's text response.
    """
    client = _get_bedrock_client()
    body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": max_tokens,
        "system": (
            "You are SchemeSaathi AI, a government scheme information assistant for Indian citizens. "
            "You ONLY use the provided scheme evidence to generate responses. "
            "You NEVER invent eligibility criteria, benefit amounts, document names, deadlines, or URLs. "
            "You always distinguish between 'potentially eligible' and confirmed eligibility. "
            "Always encourage verification on the official government portal. "
            "Keep responses concise, warm, and accessible. Use simple language."
        ),
        "messages": [
            {"role": "user", "content": prompt}
        ],
    })
    response = client.invoke_model(
        body=body,
        modelId=BEDROCK_MODEL_ID,
        accept="application/json",
        contentType="application/json",
    )
    result = json.loads(response.get("body").read())
    return result["content"][0]["text"]


# ---------------------------------------------------------------------------
# Public service methods
# ---------------------------------------------------------------------------

def generate_explanation(
    profile: Dict[str, Any],
    scheme: Dict[str, Any],
    eligibility_result: Dict[str, Any],
) -> str:
    """
    Generate a plain-language explanation of why a scheme may or may not match
    a citizen profile. Based solely on the deterministic eligibility result.
    """
    if DEMO_MODE:
        return _mock_explanation(profile, scheme, eligibility_result)

    matched = eligibility_result.get("matched_rules", [])
    failed = eligibility_result.get("failed_rules", [])
    missing = eligibility_result.get("missing_information", [])
    status = "potentially eligible" if eligibility_result.get("eligible") else "not currently matching"

    prompt = (
        f"A citizen has the following profile: {json.dumps(profile)}.\n"
        f"The scheme being evaluated is: {scheme.get('name', 'Unknown Scheme')}.\n"
        f"The deterministic eligibility engine has determined: {status}.\n"
        f"Criteria that appear satisfied: {json.dumps(matched)}.\n"
        f"Criteria that are not satisfied: {json.dumps(failed)}.\n"
        f"Information that is missing: {json.dumps(missing)}.\n\n"
        f"Please explain this result in 3-4 friendly sentences for the citizen. "
        f"Do not invent any criteria not listed above."
    )
    try:
        return _invoke_claude(prompt)
    except Exception:
        return _mock_explanation(profile, scheme, eligibility_result)


def answer_question(
    question: str,
    context_schemes: List[Dict[str, Any]],
    profile: Dict[str, Any],
) -> str:
    """
    Answer a citizen's question grounded strictly in the provided scheme context.
    """
    if DEMO_MODE:
        return _mock_answer(question, context_schemes, profile)

    context_text = json.dumps(context_schemes[:5])  # Limit context size
    profile_text = json.dumps(profile)

    prompt = (
        f"Citizen profile: {profile_text}\n"
        f"Relevant scheme information from the database: {context_text}\n\n"
        f"The citizen asks: \"{question}\"\n\n"
        f"Answer using ONLY the scheme information provided. "
        f"If the answer is not in the provided data, say so clearly. "
        f"Always encourage verification on official government portals."
    )
    try:
        return _invoke_claude(prompt)
    except Exception:
        return _mock_answer(question, context_schemes, profile)


def summarize_scheme(scheme: Dict[str, Any]) -> str:
    """Generate a brief citizen-friendly summary of a scheme."""
    if DEMO_MODE:
        return scheme.get("description", "No description available.")

    prompt = (
        f"Summarize this government scheme in 2 sentences for a citizen:\n"
        f"{json.dumps(scheme)}\n"
        f"Focus on who it helps and what benefit they receive. "
        f"Use only information provided above."
    )
    try:
        return _invoke_claude(prompt, max_tokens=200)
    except Exception:
        return scheme.get("description", "No description available.")


def translate_response(text: str, language: str) -> str:
    """
    Translate a response to the specified language.
    Supported: 'en' (English), 'hi' (Hindi), 'or' (Odia).
    """
    if DEMO_MODE or language == "en":
        return text

    lang_map = {"hi": "Hindi", "or": "Odia"}
    lang_name = lang_map.get(language, "Hindi")

    prompt = (
        f"Translate the following text to {lang_name}. "
        f"Keep proper nouns, scheme names, and URLs in English.\n\n"
        f"{text}"
    )
    try:
        return _invoke_claude(prompt, max_tokens=600)
    except Exception:
        return text


# ---------------------------------------------------------------------------
# Mock response generators (DEMO_MODE)
# ---------------------------------------------------------------------------

def _mock_explanation(
    profile: Dict[str, Any],
    scheme: Dict[str, Any],
    eligibility_result: Dict[str, Any],
) -> str:
    matched = eligibility_result.get("matched_rules", [])
    failed = eligibility_result.get("failed_rules", [])
    missing = eligibility_result.get("missing_information", [])
    scheme_name = scheme.get("name", "this scheme")
    name = profile.get("name") or "Citizen"

    if not failed and not missing:
        criteria_text = ", ".join([r.get("field", "").replace("_", " ") for r in matched[:3]])
        return (
            f"Based on the information you've provided, {name}, your profile appears to satisfy "
            f"the published criteria for {scheme_name} — including {criteria_text}. "
            f"This makes you potentially eligible for this scheme. "
            f"Please verify your eligibility and complete your application on the official government portal, "
            f"as final determination rests with the administering department."
        )
    elif failed:
        fail_field = failed[0].get("field", "a criterion").replace("_", " ")
        return (
            f"Based on your current profile, {name}, one or more criteria for {scheme_name} "
            f"do not appear to be satisfied — specifically the {fail_field} requirement. "
            f"You may not currently qualify for this scheme. "
            f"If your situation changes or you believe this is incorrect, please verify directly "
            f"on the official government portal."
        )
    else:
        missing_fields = ", ".join([m.get("field", "").replace("_", "") for m in missing[:3]])
        return (
            f"We need a little more information to assess {scheme_name} for your profile, {name}. "
            f"Specifically, the system needs: {missing_fields}. "
            f"Please update your citizen profile with these details to get a more complete evaluation. "
            f"You can also verify directly on the official government portal."
        )


def _mock_answer(
    question: str,
    context_schemes: List[Dict[str, Any]],
    profile: Dict[str, Any],
) -> str:
    q = question.lower()
    name = profile.get("name") or "there"
    eligible_count = len([s for s in context_schemes if s.get("status") in ("eligible", "potentially_eligible")])

    if any(w in q for w in ["eligible", "qualify", "which scheme", "what scheme", "scheme"]):
        if context_schemes:
            names = ", ".join([s.get("name", "") for s in context_schemes[:3]])
            return (
                f"Based on the information you've shared, {name}, I found {eligible_count} scheme(s) "
                f"that may match your profile. These include: {names}. "
                f"Click on any scheme to see a detailed breakdown of the criteria and why it may apply to you. "
                f"Remember to verify final eligibility on the official government portal."
            )
        return (
            f"I couldn't find strong scheme matches based on your current profile, {name}. "
            f"Try adding more details — your occupation, income level, or state — to improve the results."
        )

    if any(w in q for w in ["document", "certificate", "aadhaar", "proof", "paper"]):
        return (
            f"For most government schemes, the commonly required documents include: "
            f"Aadhaar Card (identity proof), Income Certificate (from Tehsildar/SDM), "
            f"Bank Passbook linked with Aadhaar for Direct Benefit Transfer (DBT), "
            f"and category-specific documents like Student ID, Land Records, or Caste Certificate. "
            f"Visit the Document Checklist to track which documents you have and what's missing."
        )

    if any(w in q for w in ["apply", "application", "how", "process", "steps"]):
        return (
            f"To apply for a scheme: (1) Confirm your eligibility on the Schemes page, "
            f"(2) Prepare all required documents as a scanned PDF, "
            f"(3) Visit the official government portal using the verified link in the scheme details, "
            f"(4) Register with your mobile number and Aadhaar OTP, "
            f"(5) Fill the application form, upload documents, and submit. "
            f"SchemeSaathi will guide you to the official portal — we do not process applications ourselves."
        )

    return (
        f"Hello {name}! I'm SchemeSaathi AI. I can help you find relevant government schemes, "
        f"understand why you may qualify, check your documents, and reach the official application portal. "
        f"You can ask me: 'Which schemes am I eligible for?', 'What documents do I need?', or 'How do I apply?'"
    )
