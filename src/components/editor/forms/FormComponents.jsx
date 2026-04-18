import React, { useState, useEffect } from "react";
import { C } from "../../../App";
import { Trash2, Plus, GripVertical, Edit2, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import './FormComponents.css';

export function SectionHeader({ title, icon, action, onAction, onRename, onDelete, id }) {
  const [editing, setEditing] = React.useState(false);
  const [val, setVal] = React.useState(title);

  React.useEffect(() => { setVal(title); }, [title]);

  const handleSave = () => {
     setEditing(false);
     if (val.trim() && val !== title && onRename) onRename(val.trim());
     else setVal(title);
  }

  const isCore = id === 'personal' || id === 'footer' || id === 'summary';

  return (
    <div className="fc-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="fc-section-header-title" style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
        <div className="fc-section-icon">{icon}</div>
        {editing ? (
           <input 
             autoFocus
             value={val}
             onChange={e => setVal(e.target.value)}
             onBlur={handleSave}
             onKeyDown={e => e.key === 'Enter' && handleSave()}
             className="fc-section-edit-input"
             style={{ background: 'transparent', border: 'none', borderBottom: `1px solid ${C.primary}`, color: '#fff', fontSize: 18, fontWeight: '700', outline: 'none', width: '60%' }}
           />
        ) : (
           <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }} className="fc-section-title-group">
             <span className="fc-headline" style={{ color: "#fff", display: 'flex', alignItems: 'center', gap: 12 }}>
               {title}
             </span>
             {!isCore && onRename && (
                <div style={{ display: 'flex', gap: 10, cursor: 'pointer', opacity: 0.6 }} className="fc-header-actions">
                  <Edit2 size={15} onClick={() => setEditing(true)} />
                  <Trash2 size={15} color="#ff4444" onClick={onDelete} />
                </div>
             )}
           </div>
        )}
      </div>
      {action && !editing && (
        <button onClick={onAction} className="fc-action-btn" style={{ color: C.primary, flexShrink: 0 }}>
          <Plus size={14} strokeWidth={3} /> {action}
        </button>
      )}
    </div>
  );
}

export function Label({ children }) {
  return <div className="fc-label">{children}</div>;
}

export function Input({ value, onChange, placeholder, style = {} }) {
  return (
    <input 
      value={value || ''} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder}
      className="fc-input"
      style={style}
    />
  );
}

// Define tech keywords for smart suggestions
const TECH_KEYWORDS = [
  "React.js", "Node.js", "Next.js", "Python", "JavaScript", "TypeScript", "AWS", "Docker", "Kubernetes",
  "PostgreSQL", "MongoDB", "GraphQL", "REST API", "TailwindCSS", "Redux", "CI/CD", "Agile", "Microservices",
  "Spring Boot", "Java", "C++", "C#", "Firebase", "Supabase", "Vue.js", "Angular"
];

function getSuggestions(text) {
  if (!text) return [];
  const words = text.split(/[\s,]+/);
  const lastWord = words[words.length - 1].toLowerCase();
  
  if (lastWord.length < 2) return [];
  
  const matches = TECH_KEYWORDS.filter(kw => kw.toLowerCase().startsWith(lastWord));
  return matches.slice(0, 3);
}

export function TextArea({ value, onChange, placeholder, rows = 3, style = {} }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setSuggestions(getSuggestions(value));
  }, [value]);

  const applySuggestion = (suggestion) => {
    const words = (value || '').split(/([\s,]+)/);
    // Determine the last actual word token to replace
    for (let i = words.length - 1; i >= 0; i--) {
      if (words[i].trim().length > 0) {
        words[i] = suggestion + " ";
        break;
      }
    }
    onChange(words.join(''));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
      <textarea 
        value={value || ''} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
        rows={rows}
        className="fc-textarea"
        style={style}
      />
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}
          >
            <Sparkles size={12} color="#00ff88" />
            <span style={{ fontSize: 10, color: '#888', fontWeight: 600 }}>SUGGESTIONS:</span>
            {suggestions.map(s => (
              <button 
                key={s} 
                onClick={() => applySuggestion(s)}
                style={{ 
                  background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)', 
                  color: '#00ff88', fontSize: 11, padding: '2px 8px', borderRadius: 12, cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ItemCard({ children, onRemove, title = "Item", subtitle = "" }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="fc-item-card" style={{ padding: collapsed ? '12px 16px' : undefined }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: collapsed ? 0 : 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', flex: 1 }} onClick={() => setCollapsed(!collapsed)}>
          <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{title || 'New Item'}</div>
          {subtitle && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{subtitle}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setCollapsed(!collapsed)} className="fc-remove-btn" style={{ color: '#aaa' }} title="Toggle Expand">
             {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
          {onRemove && (
            <button onClick={onRemove} className="fc-remove-btn" title="Delete item">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {!collapsed && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
