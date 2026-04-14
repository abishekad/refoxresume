import React from "react";
import { C } from "../../../App";
import { Trash2, Plus, GripVertical, Edit2 } from "lucide-react";
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

export function TextArea({ value, onChange, placeholder, rows = 3, style = {} }) {
  return (
    <textarea 
      value={value || ''} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder} 
      rows={rows}
      className="fc-textarea"
      style={style}
    />
  );
}

export function ItemCard({ children, onRemove }) {
  return (
    <div className="fc-item-card">
      {onRemove && (
        <button onClick={onRemove} className="fc-remove-btn" title="Delete item">
          <Trash2 size={16} />
        </button>
      )}
      {children}
    </div>
  );
}
