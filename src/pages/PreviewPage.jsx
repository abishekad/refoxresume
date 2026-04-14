import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Watermark from "../components/editor/Watermark";
import { NeonButton, C } from "../App";
import { supabase } from "../services/supabase";

export default function PreviewPage({ user, isPaid, selectedTemplate }) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      if (!selectedTemplate) return;
      
      let loaded = null;
      // 1. Try Supabase
      if (user) {
        const { data: dbData } = await supabase
          .from('resumes')
          .select('data')
          .eq('user_id', user.id)
          .eq('template_id', selectedTemplate.id)
          .maybeSingle();
        if (dbData && dbData.data) loaded = dbData.data;
      }
      
      // 2. Try LocalStorage
      if (!loaded) {
        const saved = localStorage.getItem('refox_resume_draft_' + selectedTemplate.id);
        if (saved) {
          try { loaded = JSON.parse(saved); } catch(e) {}
        }
      }
      
      setData(loaded || {});
    }
    loadData();
  }, [user, selectedTemplate]);

  useEffect(() => {
    if (!data || !selectedTemplate?.renderHTML || !iframeRef.current) return;
    
    const htmlString = selectedTemplate.renderHTML(data);
    const doc = iframeRef.current.contentDocument;
    if (doc) {
      doc.open();
      doc.write(htmlString);
      doc.close();
    }
  }, [data, selectedTemplate]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!selectedTemplate) {
    return <Navigate to="/templates" replace />;
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: 72, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Sticky CTA for Unpaid Users */}
      {!isPaid && (
        <div style={{
          position: "sticky", top: 72, zIndex: 100, width: "100%", background: "linear-gradient(90deg, #1A0B2E, #2A1150)", 
          borderBottom: `1px solid ${C.primary}`, borderTop: `1px solid ${C.primary}`, padding: "12px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }}>
          <div>
            <span style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>Unlock your flawless resume</span>
            <div style={{ color: '#aaa', fontSize: 13, marginTop: 2 }}>Remove watermark and enable unlimited PDF / Word exports forever.</div>
          </div>
          <NeonButton size="sm" onClick={() => navigate('/payment')}>
            Remove Watermark – Pay ₹29
          </NeonButton>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ width: 800, maxWidth: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0" }}>
        <button onClick={() => navigate(`/editor/${selectedTemplate.id}`)} style={{ background: "transparent", color: C.mutedLight, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
          <span>← Back to Editor</span>
        </button>
        <NeonButton onClick={() => navigate(isPaid ? '/download' : '/payment')} size="sm">
          {isPaid ? "Download Options" : "Download (₹29)"}
        </NeonButton>
      </div>

      {/* Document Area */}
      <div style={{ width: 800, maxWidth: "100%", background: "#fff", position: "relative", minHeight: 1100, marginBottom: 100, boxShadow: "0 20px 60px rgba(0,0,0,0.4)", borderRadius: 4, overflow: "hidden" }}>
        <iframe
          ref={iframeRef}
          style={{ width: "100%", height: "100%", border: "none", position: "absolute", inset: 0 }}
          title="Print Preview"
        />
        {!isPaid && <Watermark />}
      </div>
    </div>
  );
}
