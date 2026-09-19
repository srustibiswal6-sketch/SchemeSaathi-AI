import { useState, useCallback, useRef } from 'react';
import { sendChatMessage } from '../services/api';

const INITIAL_MESSAGE = {
  id: 'init-0',
  role: 'assistant',
  text: 'Namaste! I\'m SchemeSaathi AI.\n\nI can help you:\n• Find government schemes relevant to your situation\n• Understand why you may qualify\n• Identify missing documents\n• Reach the official application portal\n\nTry asking: "Which schemes am I eligible for?" or "What documents do I need?"',
  timestamp: new Date().toISOString(),
  matchedSchemes: null,
};

export function useChat(profile) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const messageIdCounter = useRef(1);

  const nextId = () => {
    messageIdCounter.current += 1;
    return `msg-${messageIdCounter.current}`;
  };

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = {
      id: nextId(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const result = await sendChatMessage(text, profile, language);
      const assistantMsg = {
        id: nextId(),
        role: 'assistant',
        text: result.response,
        timestamp: new Date().toISOString(),
        matchedSchemes: result.matched_schemes || null,
        context: result.grounded_context || null,
        mode: result.mode,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setError('AI explanation is temporarily unavailable. You can still view scheme information and eligibility criteria.');
      const errorMsg = {
        id: nextId(),
        role: 'assistant',
        text: 'AI explanation is temporarily unavailable. You can still browse the Schemes page for verified scheme information and eligibility criteria.',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [profile, language, loading]);

  const clearChat = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
    setError(null);
    messageIdCounter.current = 1;
  }, []);

  return { messages, loading, error, language, setLanguage, sendMessage, clearChat };
}
