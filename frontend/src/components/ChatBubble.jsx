import React, { useState } from 'react';
import { Bot, User, AlertTriangle, ExternalLink, ArrowRight, Check, Copy, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ChatBubble({ message }) {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!message.text) return;
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse markdown-style bold, bullet lists, and newlines
  const formatText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const cleanLine = isBullet ? line.trim().replace(/^[•-]\s*/, '') : line;

      const formattedLine = cleanLine.split(/\*\*(.*?)\*\*/).map((part, j) =>
        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
      );

      if (isBullet) {
        return (
          <div key={i} className="chat-bullet-line">
            <span className="bullet-dot">•</span>
            <span>{formattedLine}</span>
          </div>
        );
      }

      return (
        <span key={i} className="chat-text-line">
          {formattedLine}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className={`chat-bubble-row ${isUser ? 'chat-row-user' : 'chat-row-assistant'}`}>
      {!isUser && (
        <div className={`chat-avatar chat-avatar-assistant ${isError ? 'avatar-error' : ''}`}>
          {isError ? <AlertTriangle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
      )}

      <div className={`chat-bubble ${
        isUser ? 'chat-bubble-user' : isError ? 'chat-bubble-error' : 'chat-bubble-assistant'
      }`}>
        <div className="chat-bubble-text">{formatText(message.text)}</div>

        {/* Inline matched scheme rich cards */}
        {message.matchedSchemes && message.matchedSchemes.length > 0 && (
          <div className="chat-scheme-rich-list">
            <div className="chat-scheme-list-header">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1.5 inline" />
              <span>Matching Government Programs:</span>
            </div>
            {message.matchedSchemes.map((scheme) => (
              <div key={scheme.id} className="chat-scheme-rich-card">
                <div className="rich-card-top">
                  <div className="rich-card-info">
                    <span className="rich-card-category">{scheme.category}</span>
                    <h4 className="rich-card-title">{scheme.name}</h4>
                  </div>
                  <span className="rich-card-status">
                    {scheme.status === 'potentially_eligible' ? '✓ Eligible' : 'Needs Info'}
                  </span>
                </div>
                <div className="rich-card-actions">
                  <Link to={`/scheme/${scheme.id}`} className="rich-card-link-details">
                    <span>View Checklist & Criteria</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                  {scheme.application_url && scheme.application_url !== '#' && (
                    <a
                      href={scheme.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rich-card-link-portal"
                      title="Open official government portal"
                    >
                      <span>Gov Portal</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer info & copy action for assistant messages */}
        {!isUser && (
          <div className="chat-bubble-footer">
            <div className="chat-bubble-meta">
              {message.mode === 'demo_mock' && (
                <span className="chat-mode-tag">Deterministic AI • Grounded in Scheme Rules</span>
              )}
              {message.mode === 'bedrock_grounded' && (
                <span className="chat-mode-tag chat-mode-live">Powered by Amazon Bedrock</span>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="chat-copy-btn"
              title="Copy message text"
              aria-label="Copy message"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600 mr-1 inline" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400 mr-1 inline" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <div className="chat-avatar chat-avatar-user">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}

