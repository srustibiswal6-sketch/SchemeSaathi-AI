import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import { useChat } from '../hooks/useChat';
import ChatBubble from '../components/ChatBubble';
import { 
  Send, Bot, Sparkles, RefreshCw, Globe,
  ArrowRight, ShieldCheck, Info
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'Which schemes am I eligible for?',
  'What documents do I need?',
  'How do I apply for a scholarship?',
  'Are there any housing schemes for me?',
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'or', label: 'ଓଡ଼ିଆ' },
];

export default function Chat() {
  const { profile } = useProfile();
  const { messages, loading, language, setLanguage, sendMessage, clearChat } = useChat(profile);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input);
    setInput('');
  };

  const handleSuggestion = (q) => {
    sendMessage(q);
    inputRef.current?.focus();
  };

  return (
    <div className="page-chat-container">
      {/* Page Header */}
      <div className="chat-page-header">
        <div className="chat-header-content">
          <span className="chat-eyebrow">
            <Sparkles className="w-4 h-4 text-amber-500 mr-1.5 inline" />
            AI SCHEME ASSISTANT
          </span>
          <h1 className="chat-page-title">SchemeSaathi AI</h1>
          <p className="chat-page-subtitle">
            Ask me about government schemes, eligibility criteria, required documents, or how to apply.
          </p>
        </div>

        <div className="chat-header-actions">
          {/* Language Selector */}
          <div className="chat-language-selector">
            <Globe className="w-4 h-4 text-slate-500 mr-1.5" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="chat-lang-select"
              aria-label="Select language"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>

          {/* Clear Chat */}
          <button
            type="button"
            onClick={clearChat}
            className="btn btn-secondary btn-sm"
            title="Clear conversation"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Active Profile Snapshot */}
      {profile?.age && (
        <div className="chat-profile-snapshot">
          <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
          <span>
            Using profile: Age {profile.age} • {profile.gender || '—'} • {profile.state || 'India'}
            {profile.isStudent ? ' • Student' : ''}
            {profile.isFarmer ? ' • Farmer' : ''}
            {' '}• ₹{Number(profile.annualIncome || 0).toLocaleString('en-IN')}/yr
          </span>
          <Link to="/profile" className="chat-edit-profile-link">
            Edit Profile <ArrowRight className="w-3 h-3 inline" />
          </Link>
        </div>
      )}

      <div className="chat-layout">
        {/* Message Thread */}
        <div className="chat-thread-panel">
          <div className="chat-messages-area" role="log" aria-label="Chat messages" aria-live="polite">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="chat-bubble-row chat-row-assistant">
                <div className="chat-avatar chat-avatar-assistant">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="chat-bubble chat-bubble-assistant chat-typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-panel">
            {/* Quick Suggestions */}
            <div className="chat-suggestions">
              <span className="chat-suggestions-label">Suggested prompts:</span>
              <div className="chat-suggestions-row">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSuggestion(q)}
                    className="chat-suggestion-chip"
                    disabled={loading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSend} className="chat-input-form">
              <label htmlFor="chat-input" className="sr-only">Type your message</label>
              <input
                ref={inputRef}
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about schemes, documents, or eligibility..."
                className="chat-input-field"
                disabled={loading}
                autoComplete="off"
                aria-label="Chat message input"
              />
              <button
                type="submit"
                className="btn btn-primary chat-send-btn"
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="chat-disclaimer">
              <Info className="w-3.5 h-3.5 mr-1.5 shrink-0 text-slate-400" />
              <span>
                AI explanations are grounded in scheme data and do not constitute legal eligibility guarantees.
                Always verify on the official government portal.
              </span>
            </div>
          </div>
        </div>

        {/* Right Sidebar — Quick Links */}
        <aside className="chat-sidebar">
          <div className="chat-sidebar-card">
            <h3 className="chat-sidebar-title">Quick Actions</h3>
            <div className="chat-sidebar-actions">
              <Link to="/profile" className="chat-sidebar-link">
                <ArrowRight className="w-4 h-4 mr-2 shrink-0" />
                <span>Update my profile</span>
              </Link>
              <Link to="/schemes" className="chat-sidebar-link">
                <ArrowRight className="w-4 h-4 mr-2 shrink-0" />
                <span>View all matched schemes</span>
              </Link>
              <Link to="/documents" className="chat-sidebar-link">
                <ArrowRight className="w-4 h-4 mr-2 shrink-0" />
                <span>Check document readiness</span>
              </Link>
            </div>
          </div>

          <div className="chat-sidebar-card chat-sidebar-trust">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
            <p className="chat-sidebar-trust-text">
              SchemeSaathi AI explains pre-calculated eligibility results. It does not decide your eligibility
              or process your application.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
