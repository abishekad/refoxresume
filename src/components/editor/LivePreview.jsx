import { useEffect, useRef } from "react";
import Watermark from "./Watermark";

export default function LivePreview({ renderHTML, data, activeTab, isPaid }) {
  const previewRef = useRef(null);
  const scrollPosRef = useRef(0);
  const lastTabRef = useRef(activeTab);

  useEffect(() => {
    const iframe = previewRef.current;
    if (!iframe || !renderHTML) return;

    const htmlString = renderHTML(data);
    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;

    // Using iframe content document injection preserves scroll and prevents iframe flashing
    if (doc && win) {
      // Capture current scroll state before DOM overwrite
      const prevScroll = win.scrollY || doc.documentElement.scrollTop || 0;
      
      // Inject new DOM instantly
      doc.open();
      doc.write(htmlString);
      doc.close();

      // Detect if user clicked a new left-sidebar tab
      let tabChanged = false;
      if (activeTab !== lastTabRef.current) {
         tabChanged = true;
         lastTabRef.current = activeTab;
      }

      // Automatically snap preview right to the active section they are editing!
      if (tabChanged) {
         const map = {
            personal: '.name',
            summary: 'Summary',
            skills: 'Skills',
            keyMetrics: 'Metrics',
            experience: 'Experience',
            projects: 'Projects',
            education: 'Education',
            achievements: 'Achievements',
            certifications: 'Certifications',
            footer: '.footer-tagline'
         };
         
         const titleMatch = map[activeTab];
         let targetEl = null;

         if (titleMatch) {
             if (titleMatch.startsWith('.')) {
                targetEl = doc.querySelector(titleMatch);
             } else {
                const titles = Array.from(doc.querySelectorAll('.section-title'));
                // Find matching section title element
                targetEl = titles.find(t => t.textContent.includes(titleMatch));
             }
         }

         if (targetEl) {
            setTimeout(() => {
               targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
               setTimeout(() => { scrollPosRef.current = win.scrollY; }, 500);
            }, 10);
         } else {
            win.scrollTo(0, prevScroll);
         }
      } else {
         // User is just typing actively: keep scroll perfectly frozen where they are looking
         win.scrollTo(0, prevScroll);
         scrollPosRef.current = prevScroll;
      }
    } else {
      // Fallback 
      const blob = new Blob([htmlString], { type: 'text/html' });
      iframe.src = URL.createObjectURL(blob);
    }
  }, [data, renderHTML, activeTab]);

  return (
    <div style={{ overflow: "hidden", background: "#d0d7de", display: "flex", justifyContent: "center", alignItems: "flex-start", width: "100%", height: "100%" }}>
      <div style={{
        width: "100%", height: "100%", padding: "40px",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        overflowY: "auto"
      }}>
        <div style={{ position: 'relative', width: 780, height: 1100, transform: "scale(0.85)", transformOrigin: "top center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", borderRadius: 4, background: "#fff", overflow: "hidden" }}>
          <iframe
            ref={previewRef}
            title="Live Resume Preview"
            style={{
              width: '100%',
              height: '100%',
              border: "none"
            }}
          />
          {!isPaid && <Watermark />}
        </div>
      </div>
    </div>
  );
}
