/**
 * SchemeSaathi AI - Mock Schemes Dataset
 * 
 * IMPORTANT:
 * All records in this dataset are clearly marked as DEMO/MOCK records for prototype development.
 * Government department names and portal URLs reflect verified official portals for authenticity.
 * Do not present fabricated schemes as definitively verified without official portal confirmation.
 */

export const MOCK_SCHEMES = [
  {
    id: "post-matric-scholarship",
    name: "Post-Matric Scholarship for Higher Education",
    category: "Education",
    department: "Ministry of Social Justice and Empowerment, Government of India",
    description: "Financial assistance to students from eligible income groups studying at post-matriculation or post-secondary stages to enable them to complete their education.",
    purpose: "To provide financial support to meritorious students from economically weaker sections pursuing higher education in accredited universities, colleges, and polytechnics across India.",
    benefits: [
      "Full reimbursement of compulsory non-refundable fees (tuition, examination, library).",
      "Monthly maintenance allowance up to ₹1,200/month for hostellers and ₹550/month for day scholars.",
      "Additional disability allowance of ₹2,000/annum for students with benchmark disabilities.",
      "Book allowance and study tour assistance for professional technical courses."
    ],
    defaultStatus: "potentially_eligible",
    criteriaConfig: {
      minAge: 16,
      maxAge: 30,
      maxIncome: 250000,
      requiresStudent: true,
      states: ["All India"]
    },
    eligibility: [
      {
        criterion: "Enrolled Student Status",
        userValue: "Enrolled in Higher Education",
        requiredValue: "Must be a recognized post-matric student",
        status: "passed",
        explanation: "You specified that you are currently enrolled as a student."
      },
      {
        criterion: "Age Requirement",
        userValue: "21 years",
        requiredValue: "Between 16 and 30 years",
        status: "passed",
        explanation: "Your age falls well within the permissible bracket for higher education assistance."
      },
      {
        criterion: "Annual Family Income",
        userValue: "₹1,80,000",
        requiredValue: "Below ₹2,50,000 per annum",
        status: "passed",
        explanation: "Your stated family income is below the mandatory ceiling of ₹2.50 Lakhs."
      },
      {
        criterion: "Domicile / State Residence",
        userValue: "Applicable State",
        requiredValue: "Indian Citizen residing in Indian State/UT",
        status: "passed",
        explanation: "Requirement appears satisfied based on Indian citizenship and state residency."
      }
    ],
    documents: [
      {
        id: "aadhaar",
        name: "Aadhaar Card",
        required: true,
        status: "available",
        description: "Government-issued identity and address proof linked with bank account."
      },
      {
        id: "income-cert",
        name: "Income Certificate",
        required: true,
        status: "missing",
        description: "Issued by competent Revenue Authority (Tehsildar/SDM) for current financial year."
      },
      {
        id: "student-id",
        name: "Student ID / College Bonafide",
        required: true,
        status: "available",
        description: "Official certificate from college/institution certifying ongoing regular enrollment."
      },
      {
        id: "bank-passbook",
        name: "Bank Account Passbook",
        required: true,
        status: "available",
        description: "Active bank account in candidate's name linked with Aadhaar for Direct Benefit Transfer (DBT)."
      },
      {
        id: "previous-marksheet",
        name: "Previous Year Marksheet",
        required: true,
        status: "needs_verification",
        description: "Class 10th/12th or preceding semester degree examination marksheet."
      }
    ],
    applicationSteps: [
      "Gather your Aadhaar, Bonafide Student Certificate, and valid Income Certificate.",
      "Visit the National Scholarship Portal (NSP) official website.",
      "Register with your mobile number and Aadhaar authentication to generate your Application ID.",
      "Log into your student portal and choose the 'Post-Matric Scholarship' under the Central Schemes tab.",
      "Fill out personal, academic, and bank account details accurately.",
      "Upload scanned copies of required documents in PDF/JPEG format (under 200KB).",
      "Verify all details previewed on the summary sheet before final submission.",
      "Submit the application and download the printed receipt for institutional verification."
    ],
    officialUrl: "https://scholarships.gov.in"
  },
  {
    id: "pm-kisan",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    category: "Agriculture",
    department: "Ministry of Agriculture & Farmers Welfare, Government of India",
    description: "Income support scheme delivering ₹6,00,000 / ₹6,000 per year directly to all landholding farmer families in three equal quarterly installments.",
    purpose: "To supplement the financial needs of small and marginal farmers in procuring various agricultural inputs to ensure proper crop health and appropriate yields, matching the anticipated farm income.",
    benefits: [
      "Direct income support of ₹6,000 per year paid in 3 four-monthly installments of ₹2,000 each.",
      "Transferred directly into verified bank accounts through Direct Benefit Transfer (DBT) mode.",
      "Eligibility for linked subsidized Kisan Credit Card (KCC) with low-interest loans up to ₹3,00,000.",
      "Integration with PM Fasal Bima Yojana for crop insurance protection."
    ],
    defaultStatus: "potentially_eligible",
    criteriaConfig: {
      minAge: 18,
      maxAge: 100,
      maxIncome: 500000,
      requiresFarmer: true,
      states: ["All India"]
    },
    eligibility: [
      {
        criterion: "Occupation Category",
        userValue: "Farmer / Agricultural Worker",
        requiredValue: "Cultivable landholding farmer family",
        status: "passed",
        explanation: "You indicated agricultural occupation or farmer profile."
      },
      {
        criterion: "Age Requirement",
        userValue: "18+ years",
        requiredValue: "Adult citizen (18+ years)",
        status: "passed",
        explanation: "Age criteria satisfied for primary applicant."
      },
      {
        criterion: "Exclusion Verification",
        userValue: "Non-institutional landholder",
        requiredValue: "Not a constitutional post holder or high-bracket income taxpayer",
        status: "needs_verification",
        explanation: "Must self-certify that you are not paying income tax or holding constitutional office."
      },
      {
        criterion: "Bank Account Linkage",
        userValue: "Active bank account",
        requiredValue: "Aadhaar seeded bank account with NPCI mapping",
        status: "passed",
        explanation: "Bank account is ready for DBT installment transfers."
      }
    ],
    documents: [
      {
        id: "aadhaar",
        name: "Aadhaar Card",
        required: true,
        status: "available",
        description: "Primary Aadhaar number mandatory for biometric and demographic verification."
      },
      {
        id: "land-record",
        name: "Land Ownership Record (Khata/Khasra/Patta)",
        required: true,
        status: "missing",
        description: "Updated revenue land record proving cultivable land in applicant's name."
      },
      {
        id: "bank-passbook",
        name: "Bank Passbook / Cancelled Cheque",
        required: true,
        status: "available",
        description: "Bank account details showing IFSC code and active account status."
      },
      {
        id: "mobile-linked",
        name: "Aadhaar-Linked Mobile Number",
        required: true,
        status: "available",
        description: "For e-KYC authentication and installment disbursement OTP alerts."
      }
    ],
    applicationSteps: [
      "Ensure your Aadhaar is linked to your active mobile number and bank account.",
      "Open the official PM-KISAN portal (pmkisan.gov.in) and navigate to the 'Farmers Corner'.",
      "Click on 'New Farmer Registration' and select whether you are in a Rural or Urban area.",
      "Input your Aadhaar number, state, and mobile number to receive a verification OTP.",
      "Fill in district, sub-district, block, and village along with land survey / khata numbers.",
      "Upload land ownership documents (Patta / RoR) as scanned PDF.",
      "Submit the application and note down the Farmer Registration Reference Number.",
      "Track status online or verify via your local Block Agriculture Officer or Patwari."
    ],
    officialUrl: "https://pmkisan.gov.in"
  },
  {
    id: "ayushman-bharat-pmjay",
    name: "Ayushman Bharat - PM-JAY (Jan Arogya Yojana)",
    category: "Health",
    department: "National Health Authority, Ministry of Health and Family Welfare",
    description: "The world's largest government-funded healthcare assurance scheme offering ₹5,00,000 annual cashless coverage per family for secondary and tertiary care hospitalization.",
    purpose: "To shield vulnerable low-income and disadvantaged families from catastrophic healthcare expenditures and medical debt across empaneled public and private hospitals nationwide.",
    benefits: [
      "Cashless health insurance cover of up to ₹5,00,000 per family per year.",
      "No restriction on family size, age, or gender.",
      "Pre-existing medical conditions are covered from day one of enrollment.",
      "Includes 3 days of pre-hospitalization and 15 days of post-hospitalization diagnostics and medicines.",
      "Valid across more than 27,000 empaneled hospitals across India."
    ],
    defaultStatus: "potentially_eligible",
    criteriaConfig: {
      minAge: 0,
      maxAge: 120,
      maxIncome: 300000,
      states: ["All India"]
    },
    eligibility: [
      {
        criterion: "Economic Benchmark",
        userValue: "Under ₹3,00,000 / BPL / SECC",
        requiredValue: "Low-income family / Deprivation criteria under SECC 2011 or NFSA",
        status: "passed",
        explanation: "Your declared family income indicates qualification under state and central health safety nets."
      },
      {
        criterion: "Family Coverage Scope",
        userValue: "Nuclear / Extended Family",
        requiredValue: "All registered family members listed in ration card / NFSA database",
        status: "passed",
        explanation: "Covers all family members without caps on age or family size."
      },
      {
        criterion: "Hospital Access Rights",
        userValue: "National coverage",
        requiredValue: "Eligible for pan-India portability across empaneled hospitals",
        status: "passed",
        explanation: "Enables treatments in any empaneled hospital across India."
      }
    ],
    documents: [
      {
        id: "aadhaar",
        name: "Aadhaar Card",
        required: true,
        status: "available",
        description: "Required for biometric identity authentication at hospital Ayushman Mitra desk."
      },
      {
        id: "ration-card",
        name: "Ration Card / NFSA Card",
        required: true,
        status: "missing",
        description: "Valid National Food Security Act or state ration card listing all family dependents."
      },
      {
        id: "residence-proof",
        name: "Proof of Residence (Voter ID / Domicile)",
        required: false,
        status: "available",
        description: "Supporting local residential identification."
      }
    ],
    applicationSteps: [
      "Visit the official Ayushman Bharat beneficiary portal at beneficiary.nha.gov.in.",
      "Enter your mobile number and complete Captcha verification to receive an OTP.",
      "Search for your family using your State, Scheme (PMJAY), and Ration Card or Aadhaar number.",
      "Locate your family members' names on the verified SECC/NFSA beneficiary roster.",
      "Complete instant e-KYC using Aadhaar OTP, Iris, or biometric fingerprint scan.",
      "Upload a clear current passport photograph if prompted.",
      "Upon approval by the district authority, download your golden Ayushman Bharat Card (PVC/PDF).",
      "Present the Ayushman Card or Aadhaar at any empaneled hospital's Ayushman Mitra helpdesk."
    ],
    officialUrl: "https://beneficiary.nha.gov.in"
  },
  {
    id: "pm-mudra-yojana",
    name: "Pradhan Mantri MUDRA Yojana (PMMY - Shishu Loan)",
    category: "Business",
    department: "Department of Financial Services, Ministry of Finance, Government of India",
    description: "Collateral-free business loans up to ₹50,000 (Shishu category) and up to ₹10 Lakhs for micro-enterprises, small traders, artisans, and women entrepreneurs.",
    purpose: "To provide formal banking credit to non-corporate, non-farm small and micro-enterprises for manufacturing, trading, retail, and service activities.",
    benefits: [
      "Collateral-free loans up to ₹50,000 under Shishu tier without any security deposit.",
      "Affordable interest rates linked to RBI benchmark repo rate (typically 8.5% to 11% p.a.).",
      "Flexible repayment tenor up to 3 to 5 years with moratorium period.",
      "MUDRA RuPay Debit Card provided for working capital cash credit withdrawals.",
      "Zero processing fees for Shishu tier loans."
    ],
    defaultStatus: "likely_match",
    criteriaConfig: {
      minAge: 18,
      maxAge: 65,
      maxIncome: 1000000,
      requiresBusinessOrSelfEmployed: true,
      states: ["All India"]
    },
    eligibility: [
      {
        criterion: "Enterprise Activity",
        userValue: "Micro-business / Self-employed / Artisan",
        requiredValue: "Non-farm revenue-generating micro-business enterprise",
        status: "passed",
        explanation: "Self-employment, trading, or artisanal business fulfills scheme objective."
      },
      {
        criterion: "Age of Applicant",
        userValue: "18-65 years",
        requiredValue: "Minimum 18 years at loan application",
        status: "passed",
        explanation: "Applicant is above 18 years old and eligible to sign loan contracts."
      },
      {
        criterion: "Credit History",
        userValue: "No known defaults",
        requiredValue: "Must not be a defaulter to any commercial or rural bank",
        status: "needs_verification",
        explanation: "Subject to verification of clean credit record by the lending bank branch."
      }
    ],
    documents: [
      {
        id: "aadhaar",
        name: "Aadhaar Card / Identity Proof",
        required: true,
        status: "available",
        description: "Official identity proof confirming name, age, and address."
      },
      {
        id: "business-proof",
        name: "Business Address / Enterprise Proof (Udyam / Trade)",
        required: true,
        status: "missing",
        description: "Udyam registration certificate, shop & establishment license, or electricity bill of enterprise."
      },
      {
        id: "bank-statement",
        name: "Bank Statement (Last 6 Months)",
        required: true,
        status: "available",
        description: "Applicant's bank account statements showing financial activity."
      },
      {
        id: "passport-photo",
        name: "Passport Size Photographs (2 Copies)",
        required: true,
        status: "available",
        description: "Recent color passport photos of the business applicant."
      }
    ],
    applicationSteps: [
      "Prepare a brief 1-page business plan highlighting your trading or micro-enterprise activity.",
      "Compile your Aadhaar, PAN card, address proof, bank statements, and quotations for machinery or stock.",
      "Visit the official Udyamimitra portal at udyamimitra.in or walk into any commercial/Gramin bank branch.",
      "Fill out the unified 1-page MUDRA Shishu Loan application form.",
      "Submit the documents to the branch manager or upload via the online portal.",
      "The lending bank reviews the proposal and verifies credit record within 7-14 business days.",
      "Upon loan sanction, sign the loan agreement without providing any collateral security.",
      "Receive sanctioned funds directly in your bank account along with a MUDRA RuPay Card."
    ],
    officialUrl: "https://www.mudra.org.in"
  },
  {
    id: "pm-awas-yojana-gramin",
    name: "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)",
    category: "Housing",
    department: "Ministry of Rural Development, Government of India",
    description: "Financial grant of ₹1,20,000 (plains) to ₹1,30,000 (hilly/difficult areas) for homeless rural families and those living in kutcha or dilapidated houses.",
    purpose: "To provide pucca houses with basic amenities (piped water, sanitation, clean cooking gas) to all houseless households and households living in kutcha and dilapidated houses in rural India.",
    benefits: [
      "Direct financial grant of ₹1,20,000 to ₹1,30,000 transferred in 3 construction-linked installments.",
      "Additional 90 to 95 person-days of unskilled labor support under MGNREGA (approx ₹20,000+).",
      "₹12,000 assistance for building an attached household toilet under Swachh Bharat Mission.",
      "Priority liquefied petroleum gas (LPG) connection under PM Ujjwala Yojana and electricity connection."
    ],
    defaultStatus: "potentially_eligible",
    criteriaConfig: {
      minAge: 18,
      maxAge: 100,
      maxIncome: 200000,
      requiresRural: true,
      states: ["All India"]
    },
    eligibility: [
      {
        criterion: "Area of Residence",
        userValue: "Rural Area",
        requiredValue: "Must reside in notified Rural Panchayat jurisdiction",
        status: "passed",
        explanation: "Your residential profile matches the rural targeting mandate of PMAY-G."
      },
      {
        criterion: "Housing Status",
        userValue: "Kutcha / No Pucca House",
        requiredValue: "Houseless or living in kutcha house with temporary roof/walls",
        status: "needs_verification",
        explanation: "Requires physical geo-tagged verification by Gram Panchayat housing officer."
      },
      {
        criterion: "Family Income Level",
        userValue: "Low Income / BPL",
        requiredValue: "Annual family income under rural poverty threshold",
        status: "passed",
        explanation: "Income falls below prescribed rural housing assistance benchmarks."
      }
    ],
    documents: [
      {
        id: "aadhaar",
        name: "Aadhaar Card",
        required: true,
        status: "available",
        description: "Aadhaar number of applicant and all adult family household members."
      },
      {
        id: "bank-passbook",
        name: "Bank Account Details",
        required: true,
        status: "available",
        description: "DBT-activated bank account passbook for housing installment deposits."
      },
      {
        id: "job-card",
        name: "MGNREGA Job Card",
        required: true,
        status: "missing",
        description: "Active job card number to receive 90 days of construction labor wages."
      },
      {
        id: "land-ownership",
        name: "Land / Homestead Site Document",
        required: true,
        status: "needs_verification",
        description: "Certificate of land ownership or NOC from local Gram Panchayat."
      }
    ],
    applicationSteps: [
      "Contact your local Gram Panchayat Pradhan or Panchayat Secretary to verify your Awaas+ list status.",
      "Provide your Aadhaar consent and MGNREGA Job Card details for beneficiary profiling.",
      "A designated Panchayat official visits your location to capture geo-tagged photos of existing shelter.",
      "Your application is uploaded to the AwaasSoft national portal by the Block Development Office (BDO).",
      "Upon sanction, the first installment of ₹25,000 to ₹40,000 is directly credited to your bank account.",
      "Complete foundation / plinth work and upload geo-tagged photo via the AwaasApp.",
      "Receive second and third installments upon verification of lintel level and roof completion.",
      "Complete toilet construction and collect additional ₹12,000 incentive under Swachh Bharat Mission."
    ],
    officialUrl: "https://pmayg.nic.in"
  },
  {
    id: "stand-up-india",
    name: "Stand-Up India Scheme for Women & SC/ST Entrepreneurs",
    category: "Business",
    department: "Department of Financial Services, Ministry of Finance, Government of India",
    description: "Bank loans between ₹10 Lakhs and ₹1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch.",
    purpose: "To support entrepreneurship among women and SC/ST communities for setting up greenfield enterprises in manufacturing, services, agri-allied, or trading sectors.",
    benefits: [
      "Bank credit from ₹10 Lakhs up to ₹1 Crore for setting up new greenfield enterprises.",
      "Composite loan comprising term loan and working capital components.",
      "Repayable in up to 7 years with a maximum moratorium period of 18 months.",
      "Convergence with Credit Guarantee Scheme for Stand-Up India (CGFSI) minimizing third-party collateral.",
      "Pre-loan and handholding support through SIDBI and Lead District Managers."
    ],
    defaultStatus: "potentially_eligible",
    criteriaConfig: {
      minAge: 18,
      maxAge: 70,
      requiresWomanOrSCST: true,
      states: ["All India"]
    },
    eligibility: [
      {
        criterion: "Target Demographic",
        userValue: "Woman Entrepreneur / SC / ST Citizen",
        requiredValue: "Woman entrepreneur or SC/ST citizen holding min 51% equity",
        status: "passed",
        explanation: "Your profile indicates eligibility under the women/diversity entrepreneurship quota."
      },
      {
        criterion: "Enterprise Type",
        userValue: "Greenfield Enterprise (New Venture)",
        requiredValue: "First-time venture in manufacturing, services, or trading sector",
        status: "passed",
        explanation: "Greenfield venture criteria appears satisfied."
      },
      {
        criterion: "Borrower Age",
        userValue: "Above 18 years",
        requiredValue: "Must be 18 years of age or older",
        status: "passed",
        explanation: "Age requirement satisfied for commercial borrowing."
      }
    ],
    documents: [
      {
        id: "aadhaar",
        name: "Identity & Address Proof (Aadhaar & PAN)",
        required: true,
        status: "available",
        description: "Official identity documents and PAN card of promoter."
      },
      {
        id: "project-report",
        name: "Detailed Project Report (DPR)",
        required: true,
        status: "missing",
        description: "Comprehensive financial projection and project report for proposed business."
      },
      {
        id: "category-cert",
        name: "Category Certificate (if SC/ST)",
        required: false,
        status: "needs_verification",
        description: "Official community certificate if applying under SC/ST category."
      },
      {
        id: "business-address",
        name: "Proposed Business Site / Lease Document",
        required: true,
        status: "missing",
        description: "Proof of location where new enterprise will be established."
      }
    ],
    applicationSteps: [
      "Formulate a detailed project report (DPR) indicating capital requirements and projected cash flows.",
      "Visit the Stand-Up India official portal at standupmitra.in.",
      "Register as a 'Borrower' and select your project category (Manufacturing, Services, or Trading).",
      "Select whether you require handholding support (trainee borrower) or are ready for direct loan (ready borrower).",
      "Submit your loan application linked to your preferred Scheduled Commercial Bank branch.",
      "Attend the branch interview with the Chief/Senior Branch Manager.",
      "Track your application status via the portal dashboard using your tracking number.",
      "Upon sanction, complete documentation and execute loan agreement to disburse term credit."
    ],
    officialUrl: "https://www.standupmitra.in"
  }
];

/**
 * Evaluates mock schemes against a citizen's profile to produce realistic
 * matching statuses, evidence-based criteria explanations, and recommendations.
 */
export function evaluateAllSchemes(schemes, profile) {
  if (!profile) return schemes;

  const age = Number(profile.age) || 0;
  const income = Number(profile.annualIncome) || 0;
  const isStudent = Boolean(profile.isStudent);
  const isFarmer = Boolean(profile.isFarmer);
  const isWoman = profile.gender === 'Female' || Boolean(profile.isWoman);
  const isBusinessOwner = Boolean(profile.isBusinessOwner);
  const areaType = profile.areaType || 'Rural';
  const state = profile.state || '';

  return schemes.map((scheme) => {
    let matchScore = 0;
    let totalChecks = 0;
    const dynamicEligibility = [];

    // Scheme-specific dynamic evaluation logic
    if (scheme.id === "post-matric-scholarship") {
      totalChecks = 4;
      
      // Check 1: Student Status
      if (isStudent) {
        matchScore += 2;
        dynamicEligibility.push({
          criterion: "Enrolled Student Status",
          userValue: "Currently Enrolled Student",
          requiredValue: "Must be a recognized post-matric student",
          status: "passed",
          explanation: "You indicated that you are currently a student pursuing studies."
        });
      } else {
        dynamicEligibility.push({
          criterion: "Enrolled Student Status",
          userValue: profile.occupation || "Non-student",
          requiredValue: "Must be a recognized post-matric student",
          status: "needs_verification",
          explanation: "This scholarship is reserved for actively enrolled students. Verification needed if you are planning to enroll."
        });
      }

      // Check 2: Age
      if (age >= 16 && age <= 30) {
        matchScore += 1;
        dynamicEligibility.push({
          criterion: "Age Requirement",
          userValue: `${age} years old`,
          requiredValue: "16 – 30 years",
          status: "passed",
          explanation: `Your age (${age}) falls inside the eligible range (16–30 years).`
        });
      } else if (age > 0) {
        dynamicEligibility.push({
          criterion: "Age Requirement",
          userValue: `${age} years old`,
          requiredValue: "16 – 30 years",
          status: "failed",
          explanation: `Your age (${age}) is outside the standard higher education bracket (16–30 years).`
        });
      } else {
        dynamicEligibility.push({
          criterion: "Age Requirement",
          userValue: "Not provided",
          requiredValue: "16 – 30 years",
          status: "needs_verification",
          explanation: "Age details not specified."
        });
      }

      // Check 3: Family Income
      if (income > 0 && income <= 250000) {
        matchScore += 1;
        dynamicEligibility.push({
          criterion: "Family Annual Income",
          userValue: `₹${income.toLocaleString('en-IN')}`,
          requiredValue: "Below ₹2,50,000",
          status: "passed",
          explanation: `Your family income (₹${income.toLocaleString('en-IN')}) is below the ₹2.5 Lakh limit.`
        });
      } else if (income > 250000) {
        dynamicEligibility.push({
          criterion: "Family Annual Income",
          userValue: `₹${income.toLocaleString('en-IN')}`,
          requiredValue: "Below ₹2,50,000",
          status: "failed",
          explanation: `Your declared income exceeds the ₹2,50,000 threshold for subsidized scholarship grants.`
        });
      } else {
        dynamicEligibility.push({
          criterion: "Family Annual Income",
          userValue: "Not provided",
          requiredValue: "Below ₹2,50,000",
          status: "needs_verification",
          explanation: "Income verification required."
        });
      }

      // Check 4: State Domicile
      dynamicEligibility.push({
        criterion: "State Residence",
        userValue: state || "India",
        requiredValue: "Resident Citizen of India",
        status: "passed",
        explanation: `Residency requirement appears satisfied${state ? ` for ${state}` : ''}.`
      });
    } 
    else if (scheme.id === "pm-kisan") {
      totalChecks = 3;

      // Check 1: Farmer Status
      if (isFarmer || profile.occupation?.toLowerCase().includes('farm') || profile.occupation?.toLowerCase().includes('agri')) {
        matchScore += 2;
        dynamicEligibility.push({
          criterion: "Occupation Category",
          userValue: "Farmer / Agricultural Worker",
          requiredValue: "Cultivable landholding farmer family",
          status: "passed",
          explanation: "Your profile indicates agricultural activity and farmer identity."
        });
      } else {
        dynamicEligibility.push({
          criterion: "Occupation Category",
          userValue: profile.occupation || "Other Occupation",
          requiredValue: "Cultivable landholding farmer family",
          status: "needs_verification",
          explanation: "Scheme is targeted specifically to landowning agricultural households."
        });
      }

      // Check 2: Age
      if (age >= 18) {
        matchScore += 1;
        dynamicEligibility.push({
          criterion: "Applicant Age",
          userValue: `${age} years old`,
          requiredValue: "18+ years",
          status: "passed",
          explanation: "Requirement satisfied for primary landholder applicant."
        });
      } else {
        dynamicEligibility.push({
          criterion: "Applicant Age",
          userValue: `${age} years old`,
          requiredValue: "18+ years",
          status: "needs_verification",
          explanation: "Applicant must be an adult citizen."
        });
      }

      // Check 3: Institutional Taxpayer Exclusion
      dynamicEligibility.push({
        criterion: "Taxpayer Exclusion Check",
        userValue: income < 1000000 ? "Non-high taxpayer" : "Higher income bracket",
        requiredValue: "Must not pay income tax under IT Act",
        status: income < 1000000 ? "passed" : "needs_verification",
        explanation: income < 1000000 
          ? "Income level indicates compliance with exclusion guidelines."
          : "Higher tax brackets may require verification against exclusion roster."
      });
    }
    else if (scheme.id === "ayushman-bharat-pmjay") {
      totalChecks = 3;

      // Check 1: Income Level
      if (income <= 300000) {
        matchScore += 2;
        dynamicEligibility.push({
          criterion: "Economic Benchmark",
          userValue: `₹${income.toLocaleString('en-IN')}`,
          requiredValue: "Under ₹3,00,000 / Low Income / SECC",
          status: "passed",
          explanation: `Your declared income of ₹${income.toLocaleString('en-IN')} matches the target socioeconomic group.`
        });
      } else {
        dynamicEligibility.push({
          criterion: "Economic Benchmark",
          userValue: `₹${income.toLocaleString('en-IN')}`,
          requiredValue: "Under ₹3,00,000 / Low Income / SECC",
          status: "needs_verification",
          explanation: "Above target threshold; eligibility depends on state-specific Ayushman health scheme guidelines."
        });
      }

      // Check 2: Family Coverage
      matchScore += 1;
      dynamicEligibility.push({
        criterion: "Universal Family Coverage",
        userValue: "Full household",
        requiredValue: "All members on Ration Card",
        status: "passed",
        explanation: "No restriction on age, family size, or pre-existing diseases."
      });

      // Check 3: State Availability
      dynamicEligibility.push({
        criterion: "Portability & State Participation",
        userValue: state || "National",
        requiredValue: "Participating States & UTs across India",
        status: "passed",
        explanation: "Accepted across 27,000+ public and private empaneled hospitals."
      });
    }
    else if (scheme.id === "pm-mudra-yojana") {
      totalChecks = 3;

      // Check 1: Self-employed / Business
      if (isBusinessOwner || profile.employmentStatus === 'Self-Employed' || profile.occupation?.toLowerCase().includes('business')) {
        matchScore += 2;
        dynamicEligibility.push({
          criterion: "Enterprise Activity",
          userValue: "Business Owner / Self-Employed",
          requiredValue: "Non-farm micro-business or commercial activity",
          status: "passed",
          explanation: "Your profile indicates self-employment or small business operation."
        });
      } else {
        dynamicEligibility.push({
          criterion: "Enterprise Activity",
          userValue: profile.occupation || "General",
          requiredValue: "Non-farm micro-business or commercial activity",
          status: "needs_verification",
          explanation: "Open to individuals planning to start or expand a micro-enterprise."
        });
      }

      // Check 2: Age
      if (age >= 18 && age <= 65) {
        matchScore += 1;
        dynamicEligibility.push({
          criterion: "Borrower Age",
          userValue: `${age} years old`,
          requiredValue: "18 – 65 years",
          status: "passed",
          explanation: "Applicant meets the legal borrowing age criteria."
        });
      } else {
        dynamicEligibility.push({
          criterion: "Borrower Age",
          userValue: `${age} years old`,
          requiredValue: "18 – 65 years",
          status: "needs_verification",
          explanation: "Applicant must be between 18 and 65 years."
        });
      }

      // Check 3: Credit Standing
      dynamicEligibility.push({
        criterion: "Credit Standing",
        userValue: "No prior default reported",
        requiredValue: "Clean banking record without active non-performing loans",
        status: "passed",
        explanation: "Subject to branch-level verification of clean credit record."
      });
    }
    else if (scheme.id === "pm-awas-yojana-gramin") {
      totalChecks = 3;

      // Check 1: Area
      if (areaType === 'Rural') {
        matchScore += 2;
        dynamicEligibility.push({
          criterion: "Area of Residence",
          userValue: "Rural Panchayat Area",
          requiredValue: "Must reside in notified Rural Panchayat",
          status: "passed",
          explanation: "Your residence matches the rural housing development mandate."
        });
      } else {
        dynamicEligibility.push({
          criterion: "Area of Residence",
          userValue: "Urban Area",
          requiredValue: "Rural Panchayat jurisdiction (Gramin)",
          status: "needs_verification",
          explanation: "Urban residents qualify under PMAY-Urban rather than PMAY-Gramin."
        });
      }

      // Check 2: Income
      if (income <= 250000) {
        matchScore += 1;
        dynamicEligibility.push({
          criterion: "Rural Income Bracket",
          userValue: `₹${income.toLocaleString('en-IN')}`,
          requiredValue: "Low income rural household",
          status: "passed",
          explanation: "Income conforms with rural housing grant requirements."
        });
      } else {
        dynamicEligibility.push({
          criterion: "Rural Income Bracket",
          userValue: `₹${income.toLocaleString('en-IN')}`,
          requiredValue: "Low income rural household",
          status: "needs_verification",
          explanation: "Higher incomes may qualify for interest subsidy instead of direct grant."
        });
      }

      // Check 3: Housing Status
      dynamicEligibility.push({
        criterion: "Shelter Need",
        userValue: "Subject to physical survey",
        requiredValue: "Kutcha house / Houseless family",
        status: "needs_verification",
        explanation: "Panchayat physical verification required for kutcha housing confirmation."
      });
    }
    else if (scheme.id === "stand-up-india") {
      totalChecks = 3;

      // Check 1: Gender / Category
      if (isWoman) {
        matchScore += 2;
        dynamicEligibility.push({
          criterion: "Target Demographic",
          userValue: "Woman Entrepreneur",
          requiredValue: "Woman entrepreneur or SC/ST promoter",
          status: "passed",
          explanation: "Your profile matches the targeted woman entrepreneur criteria."
        });
      } else {
        dynamicEligibility.push({
          criterion: "Target Demographic",
          userValue: profile.gender || "Male",
          requiredValue: "Woman entrepreneur or SC/ST citizen holding >= 51% share",
          status: "needs_verification",
          explanation: "Reserved for women or SC/ST enterprise promoters."
        });
      }

      // Check 2: Enterprise Stage
      matchScore += 1;
      dynamicEligibility.push({
        criterion: "Enterprise Type",
        userValue: "New venture (Greenfield)",
        requiredValue: "First venture in manufacturing, services, or trading",
        status: "passed",
        explanation: "Eligible for greenfield project bank credit."
      });

      // Check 3: Age
      if (age >= 18) {
        dynamicEligibility.push({
          criterion: "Borrower Age",
          userValue: `${age} years`,
          requiredValue: "18+ years",
          status: "passed",
          explanation: "Applicant is above 18 years."
        });
      } else {
        dynamicEligibility.push({
          criterion: "Borrower Age",
          userValue: `${age} years`,
          requiredValue: "18+ years",
          status: "needs_verification",
          explanation: "Applicant must be an adult."
        });
      }
    }
    else {
      // Default fallback
      return scheme;
    }

    // Determine status based on matchScore
    let calculatedStatus = "needs_verification";
    if (matchScore >= totalChecks) {
      calculatedStatus = "potentially_eligible";
    } else if (matchScore >= totalChecks - 1) {
      calculatedStatus = "likely_match";
    } else if (matchScore <= 1) {
      calculatedStatus = "needs_verification";
    }

    return {
      ...scheme,
      status: calculatedStatus,
      eligibility: dynamicEligibility.length > 0 ? dynamicEligibility : scheme.eligibility
    };
  });
}
