import { useState, useEffect } from "react";
import { NeonButton, C } from "./App";
import SidebarNav from "./components/editor/SidebarNav";
import LivePreview from "./components/editor/LivePreview";
import FormBuilder from "./components/editor/FormBuilder";
import { createDefaultFormData } from "./data/resumeSchema";
import { supabase } from "./services/supabase";
import { useUndoRedo } from "./hooks/useUndoRedo";
import ATSScoreBar from "./components/editor/ATSScoreBar";
import { Undo2, Redo2 } from "lucide-react";

// Fallback configuration if template strictly hasn't loaded yet
const DEFAULT_SECTIONS = [
  { id: 'personal', type: 'personal', label: 'Personal Info' },
  { id: 'summary', type: 'textarea', label: 'Summary' },
  { id: 'skills', type: 'skills-repeater', label: 'Skills' },
  { id: 'experience', type: 'exp-repeater', label: 'Experience' },
  { id: 'education', type: 'edu-repeater', label: 'Education' },
  { id: 'footer', type: 'footer', label: 'Footer Tagline' }
];

export default function EditorPage({ setPage, selectedTemplate, user, isPaid }) {
  // We will derive sections strictly from the user's saved layout state now.
  // We initialize it into form state, rather than calculating it on every render.

  const { state: form, setState: setForm, undo, redo, canUndo, canRedo } = useUndoRedo(() => {
    // Try localStorage first for instant visual render
    const saved = localStorage.getItem('refox_resume_draft_' + (selectedTemplate?.id || 'default'));
    if (saved) {
      try { 
        const parsed = JSON.parse(saved); 
        if (!parsed.layout) {
           parsed.layout = selectedTemplate?.sections || DEFAULT_SECTIONS;
           if (!parsed.layout.find(s => s.id === 'footer')) parsed.layout.push({ id: 'footer', type: 'footer', label: 'Footer Tagline' });
        }
        return parsed;
      } catch(e) {}
    }
    const def = selectedTemplate?.createDefaultFormData ? selectedTemplate.createDefaultFormData() : createDefaultFormData();
    def.layout = [...(selectedTemplate?.sections || DEFAULT_SECTIONS)];
    if (!def.layout.find(s => s.id === 'footer')) def.layout.push({ id: 'footer', type: 'footer', label: 'Footer Tagline' });
    return def;
  });

  const templateSections = form.layout || [];
  const sectionIds = templateSections.map(s => typeof s === 'string' ? s : s.id);
  const [activeTab, setActiveTab] = useState(sectionIds[0] || "personal");

  // Pull actual source of truth from Supabase
  useEffect(() => {
    if (!user || !selectedTemplate?.id) return;
    
    async function fetchSavedResume() {
      const { data, error } = await supabase
        .from('resumes')
        .select('data')
        .eq('user_id', user.id)
        .eq('template_id', selectedTemplate.id)
        .maybeSingle();

      if (data && data.data) {
        let loadedData = data.data;
        if (!loadedData.layout) {
           loadedData.layout = selectedTemplate?.sections || DEFAULT_SECTIONS;
           if (!loadedData.layout.find(s => s.id === 'footer')) loadedData.layout.push({ id: 'footer', type: 'footer', label: 'Footer Tagline' });
        }
        setForm(loadedData);
      }
    }
    fetchSavedResume();
  }, [user, selectedTemplate?.id]);

  // Ensure active tab is valid for the current template
  useEffect(() => {
    if (!sectionIds.includes(activeTab)) {
      setActiveTab(sectionIds[0] || "personal");
    }
  }, [templateSections, activeTab]);

  // Force beautifully populated default data if the form is stuck in the old empty state
  useEffect(() => {
    if (!form.personal?.fullName && !form.personal?.email) {
      setForm(selectedTemplate?.createDefaultFormData ? selectedTemplate.createDefaultFormData() : createDefaultFormData());
    }
  }, [selectedTemplate]);

  // Auto-Save to Supabase & LocalStorage (Debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
       // Local instant persistence
       localStorage.setItem('refox_resume_draft_' + (selectedTemplate?.id || 'default'), JSON.stringify(form));
       
       // Supabase Cloud persistence
       if (user && selectedTemplate?.id) {
         await supabase.from('resumes').upsert({
           user_id: user.id,
           template_id: selectedTemplate.id,
           data: form,
           updated_at: new Date().toISOString()
         }, { onConflict: 'user_id,template_id' });
       }
    }, 1500);
    return () => clearTimeout(timer);
  }, [form, selectedTemplate, user]);

  const updateData = (section, payload) => setForm(f => ({ ...f, [section]: payload }));

  const renameSection = (id, newLabel) => {
    setForm(f => {
      const layout = [...(f.layout || [])];
      const idx = layout.findIndex(l => l.id === id);
      if (idx > -1) layout[idx] = { ...layout[idx], label: newLabel };
      return { ...f, layout };
    });
  };

  const deleteSection = (id) => {
    if (['personal', 'footer', 'summary'].includes(id)) return; // Critical core sections protected
    setForm(f => ({ ...f, layout: f.layout.filter(l => l.id !== id) }));
    if (activeTab === id) setActiveTab('personal');
  };

  const addSection = (type) => {
     let newId = type === 'textarea' ? 'summary' : type.replace('-repeater', '');
     newId = newId + '-' + crypto.randomUUID().slice(0, 4);
     
     const labels = {
        'exp-repeater': 'New Experience',
        'project-repeater': 'New Projects',
        'edu-repeater': 'New Education',
        'skills-repeater': 'New Skills',
        'bullet-repeater': 'Custom Bullets'
     };

     const newLayout = { id: newId, type, label: labels[type] || 'New Section' };
     setForm(f => {
       const layout = [...f.layout];
       // insert before footer
       const footerIdx = layout.findIndex(l => l.id === 'footer');
       if (footerIdx > -1) {
          layout.splice(footerIdx, 0, newLayout);
       } else {
          layout.push(newLayout);
       }
       return { ...f, layout, [newId]: [] };
     });
     setActiveTab(newId);
  };

  // Find the active section config to pass to FormBuilder
  const activeSectionConfig = templateSections.find(s => (typeof s === 'string' ? s : s.id) === activeTab) || 
                              { id: activeTab, type: activeTab };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 72 }}>
      {/* ─── Top toolbar ─── */}
      <div style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 50, background: "rgba(6,6,6,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "12px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="headline" style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>
            Edit Your {selectedTemplate?.name || 'Resume'}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary, boxShadow: `0 0 8px ${C.primary}` }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: C.primary, letterSpacing: "0.12em", marginRight: 16 }}>ATS-OPTIMIZED LIVE PREVIEW</span>
            <ATSScoreBar data={form} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, marginRight: 8, borderRight: "1px solid rgba(255,255,255,0.1)", paddingRight: 16 }}>
             <button onClick={undo} disabled={!canUndo} style={{ background: 'transparent', border: 'none', color: canUndo ? '#fff' : 'rgba(255,255,255,0.2)', cursor: canUndo ? 'pointer' : 'default', padding: '6px' }} title="Undo"><Undo2 size={18} /></button>
             <button onClick={redo} disabled={!canRedo} style={{ background: 'transparent', border: 'none', color: canRedo ? '#fff' : 'rgba(255,255,255,0.2)', cursor: canRedo ? 'pointer' : 'default', padding: '6px' }} title="Redo"><Redo2 size={18} /></button>
          </div>
          <NeonButton variant="ghost" size="sm" onClick={() => setPage("preview")}>Preview</NeonButton>
          <NeonButton onClick={() => setPage("download")} size="sm">Download Resume (Test)</NeonButton>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(400px, 1fr) 800px", minHeight: "calc(100vh - 72px)", marginTop: 60 }}>
        {/* ─── Sidebar Nav & Content ─── */}
        <div style={{ borderRight: "1px solid rgba(255,255,255,0.05)", padding: "28px 0", overflowY: "auto", background: "rgba(8,8,8,0.8)", display: "flex", height: "calc(100vh - 132px)", position: "sticky", top: 132 }}>


          <SidebarNav 
             sections={form.layout || []} 
             activeTab={activeTab} 
             onChange={setActiveTab}
             onReorder={(newLayout) => setForm(f => ({ ...f, layout: newLayout }))} 
             onRename={renameSection} 
             onDelete={deleteSection} 
             onAdd={addSection} 
          />

          <div style={{ flex: 1, padding: "0 24px", overflowY: "auto", paddingBottom: "100px" }}>
            <FormBuilder 
              sectionConfig={activeSectionConfig} 
              data={form} 
              onChange={updateData} 
              onRename={renameSection}
              onDelete={deleteSection}
            />
          </div>
        </div>

        {/* ─── Right Live Preview ─── */}
        <LivePreview renderHTML={selectedTemplate?.renderHTML} data={form} activeTab={activeTab} isPaid={isPaid} />
      </div>
    </div>
  );
}
