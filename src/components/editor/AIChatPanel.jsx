import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, Check, AlertCircle, ChevronDown } from 'lucide-react';
import { sendChatMessage, parseResumeResponse, mergeIntoForm } from '../../services/deepseekService';
import './AIChatPanel.css';

const SUGGESTION_PROMPTS = [
  {
    icon: '🎓',
    text: "I'm a fresher B.Tech CSE graduate. Create my resume with my projects and skills.",
  },
  {
    icon: '💼',
    text: "I have 2 years of experience as a React developer. Generate a professional resume.",
  },
  {
    icon: '✏️',
    text: "Make my professional summary more impactful and technical.",
  },
  {
    icon: '🚀',
    text: "Add 2 more impressive project entries to my resume.",
  },
];

export default function AIChatPanel({ form, setForm }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { role, content, displayContent, hasResume, parsedData, action }
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appliedIdx, setAppliedIdx] = useState(null); // index of the message that was applied
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (overrideText) => {
    const text = overrideText || input.trim();
    if (!text || isLoading) return;

    // Add user message
    const userMsg = { role: 'user', content: text, displayContent: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for API (only role + content)
      const apiMessages = updatedMessages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const rawResponse = await sendChatMessage(apiMessages);

      // Try to parse as resume JSON
      let displayContent = '';
      let hasResume = false;
      let parsedData = null;
      let action = 'full';

      try {
        const result = parseResumeResponse(rawResponse);
        parsedData = result.data;
        action = result.action;
        hasResume = true;

        // Create a human-readable summary of what was generated
        displayContent = generateSummary(parsedData, action);
      } catch (parseErr) {
        // Not valid resume JSON — just show as text
        displayContent = rawResponse;
      }

      const aiMsg = {
        role: 'assistant',
        content: rawResponse,
        displayContent,
        hasResume,
        parsedData,
        action,
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      // Add error message
      const errorMsg = {
        role: 'assistant',
        content: '',
        displayContent: error.message || 'Something went wrong. Please try again.',
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    }

    setIsLoading(false);
  };

  const handleApply = (msgIdx) => {
    const msg = messages[msgIdx];
    if (!msg?.parsedData) return;

    const merged = mergeIntoForm(form, msg.parsedData, msg.action);
    setForm(merged);
    setAppliedIdx(msgIdx);

    // Reset applied state after animation
    setTimeout(() => setAppliedIdx(null), 2500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text) => {
    setInput(text);
    handleSend(text);
  };

  return (
    <div style={{ marginTop: 20 }}>
      {/* ─── Trigger Button ─── */}
      {!isOpen && (
        <motion.div
          className="ai-chat-trigger"
          onClick={() => setIsOpen(true)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="ai-chat-trigger-icon">✨</div>
          <div className="ai-chat-trigger-text">
            <div className="ai-chat-trigger-title">Create Resume with AI</div>
            <div className="ai-chat-trigger-desc">
              Describe yourself and let DeepSeek AI build your professional resume instantly
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── Chat Panel ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-chat-panel"
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* ─── Header ─── */}
            <div className="ai-chat-header">
              <div className="ai-chat-header-left">
                <div className="ai-chat-header-avatar">🤖</div>
                <div className="ai-chat-header-info">
                  <h4>RefoxAI Assistant</h4>
                  <span>POWERED BY DEEPSEEK</span>
                </div>
              </div>
              <button className="ai-chat-close-btn" onClick={() => setIsOpen(false)}>
                <ChevronDown size={16} />
              </button>
            </div>

            {/* ─── Messages Area ─── */}
            <div className="ai-chat-messages">
              {messages.length === 0 ? (
                <div className="ai-chat-welcome">
                  <div className="ai-chat-welcome-icon">🧠</div>
                  <h3>AI Resume Generator</h3>
                  <p>
                    Describe yourself — your name, education, skills, projects, and experience.
                    I'll generate a professional, ATS-optimized resume for you instantly.
                  </p>
                  <div className="ai-chat-suggestions">
                    {SUGGESTION_PROMPTS.map((s, i) => (
                      <div
                        key={i}
                        className="ai-suggestion-chip"
                        onClick={() => handleSuggestionClick(s.text)}
                      >
                        <span>{s.icon}</span>
                        <span>{s.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`ai-msg ${msg.role === 'user' ? 'ai-msg-user' : ''}`}>
                      <div
                        className={`ai-msg-avatar ${
                          msg.role === 'user' ? 'ai-msg-avatar-user' : 'ai-msg-avatar-ai'
                        }`}
                      >
                        {msg.role === 'user' ? '👤' : '🤖'}
                      </div>
                      <div>
                        {msg.isError ? (
                          <div className="ai-msg-error">
                            <AlertCircle size={14} />
                            <span>{msg.displayContent}</span>
                          </div>
                        ) : (
                          <div
                            className={`ai-msg-bubble ${
                              msg.role === 'user' ? 'ai-msg-bubble-user' : 'ai-msg-bubble-ai'
                            }`}
                          >
                            <div style={{ whiteSpace: 'pre-wrap' }}>{msg.displayContent}</div>

                            {/* Apply to Resume button for AI messages with resume data */}
                            {msg.hasResume && msg.role === 'assistant' && (
                              <button
                                className={`ai-apply-btn ${appliedIdx === idx ? 'ai-apply-success' : ''}`}
                                onClick={() => handleApply(idx)}
                                disabled={appliedIdx === idx}
                              >
                                {appliedIdx === idx ? (
                                  <>
                                    <Check size={14} strokeWidth={3} />
                                    Applied to Resume!
                                  </>
                                ) : (
                                  <>
                                    <Sparkles size={14} />
                                    Apply to Resume
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Typing indicator */}
              {isLoading && (
                <div className="ai-msg">
                  <div className="ai-msg-avatar ai-msg-avatar-ai">🤖</div>
                  <div className="ai-typing-indicator">
                    <div className="ai-typing-dots">
                      <div className="ai-typing-dot" />
                      <div className="ai-typing-dot" />
                      <div className="ai-typing-dot" />
                    </div>
                    <span className="ai-typing-text">Generating your resume...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ─── Input Area ─── */}
            <div className="ai-chat-input-area">
              <textarea
                ref={inputRef}
                className="ai-chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  messages.length === 0
                    ? "Describe yourself: name, education, skills, projects..."
                    : "Ask for changes: 'make summary more technical', 'add more projects'..."
                }
                rows={1}
                disabled={isLoading}
              />
              <button
                className="ai-chat-send-btn"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
              >
                <Send size={18} color="#003820" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


/**
 * Generate a human-readable summary of what the AI produced.
 */
function generateSummary(data, action) {
  const parts = [];

  if (action === 'partial') {
    parts.push('✅ Updated Sections:\n');
  } else {
    parts.push('🎉 I\'ve generated your resume content!\n');
  }

  if (data.personal?.fullName) {
    parts.push(`👤 ${data.personal.fullName} — ${data.personal.professionalTitle || data.personal.subhead || ''}\n`);
  }

  if (data.summary) {
    parts.push(`📝 SUMMARY:\n${data.summary}\n`);
  }

  if (data.skills?.length) {
    parts.push(`⚡ SKILLS:`);
    data.skills.forEach(skill => {
      parts.push(`• ${skill.category}: ${skill.items}`);
    });
    parts.push('');
  }

  if (data.experience?.length) {
    parts.push(`💼 EXPERIENCE:`);
    data.experience.forEach(exp => {
      parts.push(`• ${exp.jobTitle} at ${exp.company}`);
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach(b => parts.push(`  - ${b}`));
      }
    });
    parts.push('');
  }

  if (data.projects?.length) {
    parts.push(`🚀 PROJECTS:`);
    data.projects.forEach(proj => {
      parts.push(`• ${proj.title} ${proj.subtitle ? `(${proj.subtitle})` : ''}`);
      if (proj.bullets && proj.bullets.length > 0) {
        proj.bullets.forEach(b => parts.push(`  - ${b}`));
      } else if (proj.description) {
        parts.push(`  - ${proj.description}`);
      }
    });
    parts.push('');
  }

  if (data.education?.length) {
    parts.push(`🎓 EDUCATION:`);
    data.education.forEach(edu => {
      parts.push(`• ${edu.degree} at ${edu.school}`);
    });
    parts.push('');
  }

  if (data.achievements?.length) {
    parts.push(`🏆 ACHIEVEMENTS:`);
    data.achievements.forEach(ach => {
      parts.push(`• ${ach.text}`);
    });
    parts.push('');
  }

  if (data.certifications?.length) {
    parts.push(`📜 CERTIFICATIONS:`);
    data.certifications.forEach(cert => {
      parts.push(`• ${cert.name} (${cert.issuer})`);
    });
    parts.push('');
  }

  parts.push('✨ Click "Apply to Resume" below to auto-fill your resume with this content.');

  return parts.join('\n').trim();
}
