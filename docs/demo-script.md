# SchemeSaathi AI — Hackathon Demo Script

**Duration: ~5 minutes**  
**Tagline: "Discover. Understand. Prepare. Apply."**

---

## Demo Profile

> Srusti, 21, Female, Odisha (Khordha), Annual Income ₹1,80,000, Student

---

## Step 1 — Landing Page (30 sec)

1. Open `http://localhost:5173`
2. Show the hero headline: **"Find government schemes made for you."**
3. Point out trust band: Free, No Aadhaar saved, Direct government links
4. Click **"Find My Schemes"**

**Say:** *"Citizens often don't know which schemes they qualify for, why they qualify, or which documents they're missing. SchemeSaathi solves that."*

---

## Step 2 — Citizen Profile (45 sec)

1. Profile page loads — point out the 2-step form
2. Fields are pre-filled with Srusti's demo data
3. Note: Age 21, Female, Odisha, Khordha, Rural
4. Click **"Continue to Step 2"**
5. Income ₹1,80,000, Student checkbox checked, Woman checked
6. Click **"Find My Schemes"**

**Say:** *"We ask a few structured questions. This data stays in your browser — we don't send your name or Aadhaar to any server."*

---

## Step 3 — Scheme Recommendations (60 sec)

1. Schemes page loads — show the grid
2. Point out the eligibility status badges: **"Potentially Eligible"** (not "100% eligible")
3. Show category filter pills — click "Education"
4. Highlight the profile snapshot bar at top
5. Show result: Post-Matric Scholarship and Medhabruti Scholarship

**Say:** *"The eligibility engine is fully deterministic — no LLM decides eligibility. It runs strict rule comparisons: age >= 15, income <= ₹2.5L, student = true. The AI only explains the results."*

---

## Step 4 — Scheme Details & Eligibility Breakdown (60 sec)

1. Click **"View Details"** on Post-Matric Scholarship
2. Show the eligibility breakdown section:
   - ✅ Enrolled Student — satisfied
   - ✅ Annual Income ₹1,80,000 ≤ ₹2,50,000 — satisfied
   - ✅ Age 21 ≥ 15 — satisfied
3. Show the document readiness: "3 of 5 documents ready"
4. Show the official source link: scholarships.gov.in
5. Point out: **"Potentially Eligible"** — never "100% eligible"

**Say:** *"Every criterion is shown transparently. You see exactly why you match, line by line."*

---

## Step 5 — Document Center (45 sec)

1. Click **"Verify & Upload Documents"** from sidebar
2. Document checklist loads — Aadhaar ✅, Bank Passbook ✅, Student ID ✅
3. Income Certificate ❌ — missing
4. Simulate uploading a file for Income Certificate
5. Progress bar appears → "Detected as: Income Certificate (88% confidence)"
6. Show disclaimer: "Detected from uploaded file — not officially verified"
7. Checklist updates to show the document

**Say:** *"We use Amazon Textract for document classification in production. The disclaimer clearly states this is detection, not official government verification."*

---

## Step 6 — Application Guide (30 sec)

1. Click **"View Application Guide"**
2. Show 8-step timeline
3. Point out the pre-flight warning if any documents still missing
4. Click **"Apply on Official Government Portal"**
5. URL shows: `scholarships.gov.in`

**Say:** *"We guide citizens to the exact official portal. SchemeSaathi never processes applications or charges any fee."*

---

## Step 7 — AI Chat (30 sec)

1. Click **"AI Chat"** in navbar
2. Ask: "Which schemes am I eligible for?"
3. AI responds with scheme list and structured cards
4. Ask: "What documents do I need?"
5. AI explains document requirements

**Say:** *"The AI assistant is grounded strictly in the scheme data. It explains pre-calculated results — it cannot invent schemes, eligibility rules, or URLs."*

---

## Key Messages

| ✅ What SchemeSaathi Does | ❌ What It Doesn't Do |
|---|---|
| Matches profile to published scheme criteria | Guarantee government eligibility |
| Explains criteria transparently | Invent scheme names or URLs |
| Detects uploaded document type | Officially verify government documents |
| Links to official portal | Process applications |
| Runs without AWS (DEMO_MODE) | Require internet for demo |

---

## Fallback Plan

If backend is down: The frontend automatically falls back to client-side evaluation of mock data.  
The full demo works **offline with no backend running**.
