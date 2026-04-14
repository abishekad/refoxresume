import React, { useState } from 'react';
import { C } from "../../App";
import { Plus } from 'lucide-react';

const ICON_MAP = {
  'personal': '👤',
  'textarea': '📝',
  'skills-repeater': '⚡',
  'exp-repeater': '💼',
  'project-repeater': '🚀',
  'edu-repeater': '🎓',
  'bullet-repeater': '🏆',
  'footer': '🏷️'
};

export default function SidebarNav({ sections, activeTab, onChange, onAdd }) {
  const [hoverId, setHoverId] = useState(null);

  return (
    <div style={{ width: 170, borderRight: "1px solid rgba(255,255,255,0.05)", padding: "0 12px", display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
        {sections.map(tab => {
           return (
             <div
               key={tab.id}
               onMouseEnter={() => setHoverId(tab.id)}
               onMouseLeave={() => setHoverId(null)}
               onClick={() => onChange(tab.id)}
               style={{
                 padding: "10px 14px",
                 borderRadius: 12,
                 cursor: "pointer",
                 position: "relative",
                 display: "flex", alignItems: "flex-start", gap: 10,
                 background: activeTab === tab.id ? "rgba(0,255,136,0.06)" : "transparent",
                 border: `1px solid ${activeTab === tab.id ? "rgba(0,255,136,0.3)" : "transparent"}`,
                 transition: "all 0.2s"
               }}
             >
               <span style={{ fontSize: 16, marginTop: 1 }}>{ICON_MAP[tab.type] || '📄'}</span>
               <span style={{ flex: 1, fontSize: 12, fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? C.primary : C.mutedLight, lineHeight: 1.2, wordBreak: 'break-word' }}>
                 {tab.label}
               </span>
             </div>
           );
        })}
      </div>
      
      <div style={{ marginTop: 24, padding: "10px 0" }}>
         <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 8, paddingLeft: 4 }}>ADD SECTION</div>
         {['exp-repeater', 'project-repeater', 'edu-repeater', 'skills-repeater', 'bullet-repeater', 'textarea'].map(t => (
            <button 
               key={t}
               onClick={() => onAdd(t)}
               style={{ display: 'flex', alignItems: 'center', gap: 6, width: "100%", padding: "6px 8px", background: "transparent", border: "none", color: C.mutedLight, fontSize: 11, cursor: "pointer", textAlign: "left", borderRadius: 6 }}
               onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
               onMouseLeave={e => e.target.style.background = 'transparent'}
            >
               <Plus size={12} /> {t.includes('exp') ? 'Experience' : t.includes('proj') ? 'Projects' : t.includes('edu') ? 'Education' : t.includes('skills') ? 'Skills' : t.includes('text') ? 'Summary' : 'Custom Bullets'}
            </button>
         ))}
      </div>
    </div>
  );
}
