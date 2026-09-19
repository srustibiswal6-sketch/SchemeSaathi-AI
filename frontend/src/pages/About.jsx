import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass, Sparkles, FileCheck2, ExternalLink,
  ShieldCheck, Lock, Landmark, Bot, Database, ArrowRight,
  CheckCircle2, AlertCircle
} from 'lucide-react';

const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    icon: Compass,
    iconColor: 'text-sky-700',
    iconBg: 'bg-sky-50',
    title: 'Fill Your Citizen Profile',
    description:
      'Answer a few questions about your age, location, income, and situation. Your data stays on your device — we never share it with third parties.',
  },
  {
    step: 2,
    icon: Sparkles,
    iconColor: 'text-amber-700',
    iconBg: 'bg-amber-50',
    title: 'Discover Matching Schemes',
    description:
      'Our deterministic eligibility engine compares your profile against published government scheme criteria — no guesswork, just transparent rule-by-rule matching.',
  },
  {
    step: 3,
    icon: FileCheck2,
    iconColor: 'text-emerald-700',
    iconBg: 'bg-emerald-50',
    title: 'Check Your Documents',
    description:
      'See which documents you already have and which ones are missing. Upload files for automatic classification — results are labelled "Detected", not officially verified.',
  },
  {
    step: 4,
    icon: ExternalLink,
    iconColor: 'text-indigo-700',
    iconBg: 'bg-indigo-50',
    title: 'Apply Through Official Portal',
    description:
      'We guide you step-by-step to the verified official government portal. SchemeSaathi never processes applications or charges any fee.',
  },
];

const FAQS = [
  {
    q: 'Is SchemeSaathi AI free?',
    a: 'Yes, completely free. SchemeSaathi never charges fees for scheme discovery, eligibility guidance, or document checking.',
  },
  {
    q: 'Does SchemeSaathi guarantee my eligibility?',
    a: 'No. We use "Potentially Eligible" to indicate that your profile appears to match available published criteria. Final eligibility is always determined by the administering government department on the official portal.',
  },
  {
    q: 'Is my personal data safe?',
    a: 'Your profile is stored only in your browser\'s local storage. We do not send your name, Aadhaar number, income, or personal details to any third-party service.',
  },
  {
    q: 'Where does scheme information come from?',
    a: 'Scheme data is sourced from official government portals (scholarships.gov.in, pmkisan.gov.in, nha.gov.in, etc.). All records carry a source URL and last-verified date. Demo records are clearly labelled.',
  },
  {
    q: 'Can I use this on my phone?',
    a: 'Yes. SchemeSaathi AI is fully mobile-responsive and designed for citizens accessing it on a smartphone.',
  },
  {
    q: 'What languages are supported?',
    a: 'Currently English. Hindi and Odia language support is available through the AI Chat feature when Amazon Bedrock is configured.',
  },
];

export default function About() {
  return (
    <div className="page-about-container">
      {/* Hero */}
      <section className="about-hero">
        <span className="about-eyebrow">ABOUT SCHEMESAATHI AI</span>
        <h1 className="about-title">How SchemeSaathi AI Works</h1>
        <p className="about-subtitle">
          A transparent, explainable, citizen-first platform for discovering Indian government welfare schemes.
        </p>
      </section>

      {/* 4-Step Process */}
      <section className="about-steps-section">
        <div className="section-header">
          <span className="section-eyebrow">THE PROCESS</span>
          <h2 className="section-title">From profile to official portal in four steps</h2>
        </div>
        <div className="about-steps-grid">
          {HOW_IT_WORKS_STEPS.map(({ step, icon: Icon, iconColor, iconBg, title, description }) => (
            <div key={step} className="about-step-card">
              <div className="about-step-number">{step}</div>
              <div className={`about-step-icon-box ${iconBg}`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <h3 className="about-step-title">{title}</h3>
              <p className="about-step-desc">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="about-principles-section">
        <div className="about-principles-card">
          <div className="section-header" style={{ marginBottom: '1.5rem' }}>
            <span className="section-eyebrow">DESIGN PRINCIPLES</span>
            <h2 className="section-title">Built to be trustworthy</h2>
          </div>

          <div className="principles-grid">
            <div className="principle-item">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mr-3 shrink-0" />
              <div>
                <h4>Government-Source First</h4>
                <p>Every scheme links to an official government URL. We never invent application portals.</p>
              </div>
            </div>
            <div className="principle-item">
              <Bot className="w-5 h-5 text-sky-700 mr-3 shrink-0" />
              <div>
                <h4>AI Explains, Not Decides</h4>
                <p>The LLM only explains deterministic eligibility results. It does not independently calculate eligibility.</p>
              </div>
            </div>
            <div className="principle-item">
              <Database className="w-5 h-5 text-amber-700 mr-3 shrink-0" />
              <div>
                <h4>Deterministic Engine</h4>
                <p>Eligibility is computed using strict rule comparisons (==, &gt;=, &lt;=). Zero eval(), zero guessing.</p>
              </div>
            </div>
            <div className="principle-item">
              <Lock className="w-5 h-5 text-indigo-700 mr-3 shrink-0" />
              <div>
                <h4>Privacy by Design</h4>
                <p>Your profile is stored in your browser only. No Aadhaar numbers or sensitive data sent to servers.</p>
              </div>
            </div>
            <div className="principle-item">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3 shrink-0" />
              <div>
                <h4>Transparent Uncertainty</h4>
                <p>We always say "Potentially Eligible". We never claim to guarantee government eligibility.</p>
              </div>
            </div>
            <div className="principle-item">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-3 shrink-0" />
              <div>
                <h4>Honest Document Detection</h4>
                <p>Uploaded documents are "Detected" — not officially verified. We clearly label this distinction.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="about-tech-section">
        <div className="section-header">
          <span className="section-eyebrow">TECHNOLOGY</span>
          <h2 className="section-title">Powered by reliable, modern infrastructure</h2>
        </div>
        <div className="tech-stack-grid">
          <div className="tech-item"><span className="tech-badge">React + Vite</span><span>Frontend</span></div>
          <div className="tech-item"><span className="tech-badge">FastAPI</span><span>Backend API</span></div>
          <div className="tech-item"><span className="tech-badge">SQLite / PostgreSQL</span><span>Database</span></div>
          <div className="tech-item"><span className="tech-badge">Amazon Bedrock</span><span>LLM Explanations</span></div>
          <div className="tech-item"><span className="tech-badge">Amazon S3</span><span>Document Storage</span></div>
          <div className="tech-item"><span className="tech-badge">Amazon Textract</span><span>Document OCR</span></div>
          <div className="tech-item"><span className="tech-badge">SQLAlchemy ORM</span><span>Data Modeling</span></div>
          <div className="tech-item"><span className="tech-badge">Deterministic Engine</span><span>Eligibility Logic</span></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="about-faq-section">
        <div className="section-header">
          <span className="section-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="section-title">Common questions</h2>
        </div>
        <div className="faq-list">
          {FAQS.map(({ q, a }) => (
            <div key={q} className="faq-item">
              <h4 className="faq-question">{q}</h4>
              <p className="faq-answer">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-section">
        <div className="about-cta-card">
          <Landmark className="w-8 h-8 text-sky-700 mb-3" />
          <h3>Ready to discover your schemes?</h3>
          <p>Fill your citizen profile and get personalized scheme recommendations in under a minute.</p>
          <Link to="/profile" className="btn btn-primary mt-4">
            <span>Find My Schemes</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
