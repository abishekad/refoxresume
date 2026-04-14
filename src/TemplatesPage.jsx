import { useState, useEffect, useRef } from "react";
import { LandingPage, Nav, NeonButton, GlassCard, AmbientOrb, C, styles } from "./App";
import resumeTemplates from "./data/templateRegistry";

function TemplateThumbnail({ template }) {
  const iframeRef = useRef(null);

  if (template.preview) {
    return (
      <div style={{ width: "100%", aspectRatio: "1 / 1.4", overflow: "hidden", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "#fff", position: "relative" }}>
        <img src={template.preview} alt={`${template.name} preview`} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
      </div>
    );
  }

  useEffect(() => {
    if (iframeRef.current && template.renderHTML && template.createDefaultFormData) {
      const defaultData = template.createDefaultFormData();
      // Provide some dummy data for a better visual preview
      defaultData.personal = {
        ...defaultData.personal,
        fullName: "JOHN DOE",
        professionalTitle: "Full Stack Developer & Software Engineer",
        targetRole: defaultData.personal.targetRole || "Software Engineer",
        email: "john@example.com",
        phone: "+1 234 567 8900",
        location: "New York, USA",
        github: "github.com/johndoe",
        linkedin: "linkedin.com/in/johndoe"
      };
      
      defaultData.summary = "Passionate engineer with experience in building scalable web applications. Recognized for improving system efficiency by 40% using modern stack solutions.";
      
      defaultData.skills = {
        languages: "JavaScript, TypeScript, Python, Java",
        frontend: "React, Next.js, Redux, Tailwind CSS",
        backend: "Node.js, Express, Django, Spring Boot",
        aiAutomation: "TensorFlow, PyTorch, OpenAI API",
        cloudDatabases: "AWS, Azure, PostgreSQL, MongoDB",
        devopsTools: "Docker, Kubernetes, GitHub Actions"
      };
      
      defaultData.experience = [
        {
          jobTitle: "Senior Software Engineer",
          company: "TechNova Solutions",
          startDate: "Jan 2021",
          endDate: "Present",
          duration: "3 Yrs",
          bullets: ["Led the transition to a microservices architecture improving uptime to 99.99%.", "Mentored a team of 5 junior developers on React and Node.js best practices.", "Reduced application load time by 35% through image optimization."]
        },
        {
          jobTitle: "Software Developer",
          company: "Innovate Inc.",
          startDate: "Jun 2018",
          endDate: "Dec 2020",
          bullets: ["Developed core features for the product dashboard serving 10k users.", "Integrated payment gateway processing $1M+ daily transactions.", "Wrote 100+ comprehensive automation unit tests using Jest."]
        }
      ];
      
      defaultData.projects = [
        { title: "E-Commerce Platform", description: "Built a fully responsive e-commerce site using Next.js and Stripe." },
        { title: "AI Customer Support Chatbot", description: "Integrated large language models to resolve 50% of customer support inquiries." },
        { title: "FinTech Dashboard Analytics", description: "Visualized real-time crypto trading volume using D3.js and WebSockets." }
      ];
      
      defaultData.education = [
        { degree: "Bachelor of Engineering (B.E) in Computer Science Engineering", school: "St. Joseph's College of Engineering", location: "Sriperumbudur", cgpa: "8.4/10", date: "2025", coursework: "Data Structures, Cloud Computing, AI Fundamentals, Web Technologies" }
      ];
      
      defaultData.keyMetrics = [
        { text: "<span class='metric'>500+ concurrent users</span> supported on mobility platform backend" },
        { text: "<span class='metric'>10,000+ daily ride requests</span> handled during peak hours" },
        { text: "<span class='metric'>30% improvement</span> in pricing efficiency via dynamic pricing engine" },
        { text: "<span class='metric'>40% lower API latency</span> (from ~280ms to ~165ms) after concurrency optimizations" }
      ];
      
      defaultData.achievements = [
        { text: "<span class='metric'>Published mobile app</span> on Play Store with real-time ride coordination and dynamic pricing live in production." },
        { text: "Reduced infrastructure cost by <span class='metric'>25%</span> through optimized cloud resource allocation on AWS and GCP." },
        { text: "Successfully integrated AI prompt engineering for automated customer support workflows (n8n automation)." }
      ];
      
      const htmlString = template.renderHTML(defaultData);
      const blob = new Blob([htmlString], { type: 'text/html' });
      iframeRef.current.src = URL.createObjectURL(blob);
    }
  }, [template]);

  return (
    <div style={{ width: "100%", aspectRatio: "1 / 1.4", overflow: "hidden", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "#fff", position: "relative" }}>
      <iframe
        ref={iframeRef}
        title={`${template.name} preview`}
        style={{
          width: 800,
          height: 1120, 
          border: "none",
          transform: "scale(0.25)", // Assumes wrapper width will be ~200px
          transformOrigin: "top left",
          pointerEvents: "none"
        }}
      />
      <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "rgba(0,0,0,0)" }} />
    </div>
  );
}

function TemplatesPage({ setPage, onSelectTemplate }) {
  const [selected, setSelected] = useState(null);

  const handleNext = () => {
    if (selected !== null) {
      if (onSelectTemplate) onSelectTemplate(resumeTemplates[selected]);
      setPage("editor");
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 100 }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <AmbientOrb x="20%" y="30%" size={500} />
        <AmbientOrb x="80%" y="70%" size={400} color="#7ee6ff" opacity={0.03} />
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 64, animation: "fadeUp 0.6s ease forwards" }}>
          <h1 className="headline" style={{ fontSize: "clamp(36px,5vw,64px)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 16 }}>
            RefoxAI – Pick Your{" "}<span className="neon" style={{ color: C.primary, fontStyle: "italic" }}>FAANG Template</span>
          </h1>
          <p style={{ fontSize: 18, color: C.mutedLight, maxWidth: 600, margin: "0 auto" }}>
            Choose from{" "}<span style={{ color: C.primary, fontWeight: 700, fontStyle: "italic" }}>{resumeTemplates.length} templates</span>{" "}based on real resumes selected at top MNCs. All ATS-optimized for maximum visibility.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20, marginBottom: 56 }}>
          {resumeTemplates.map((t, idx) => (
            <div key={t.id} onClick={() => setSelected(idx)} style={{ position: "relative", cursor: "pointer", border: `2px solid ${selected === idx ? C.primary : "rgba(255,255,255,0.06)"}`, borderRadius: 20, overflow: "hidden", background: selected === idx ? "rgba(0,255,136,0.04)" : C.card, backdropFilter: "blur(16px)", transition: "all 0.3s ease", boxShadow: selected === idx ? `0 0 30px rgba(0,255,136,0.3)` : "0 4px 20px rgba(0,0,0,0.3)", animation: `fadeUp 0.5s ease ${idx * 0.08}s forwards`, opacity: 0 }}>
              {t.tag && (<div style={{ position: "absolute", top: 12, left: 12, zIndex: 2, background: t.badge === "primary" ? C.primary : "rgba(255,255,255,0.1)", color: t.badge === "primary" ? "#003820" : "#fff", fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", padding: "4px 10px", borderRadius: 100, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.tag}</div>)}
              
              <div style={{ padding: "40px 16px 20px", background: "linear-gradient(135deg, #111 0%, #0a0a0a 100%)", minHeight: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <TemplateThumbnail template={t} />
                <div style={{ marginTop: 10, textAlign: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: C.primary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.score}/100 ATS</span>
                </div>
              </div>

              <div style={{ padding: "16px 18px 18px" }}>
                <h3 className="headline" style={{ fontSize: 14, fontWeight: 800, marginBottom: 4, letterSpacing: "-0.01em" }}>{t.name}</h3>
                <p style={{ fontSize: 11, color: C.muted }}>{t.sub || t.year}</p>
                <NeonButton onClick={(e) => { e.stopPropagation(); setSelected(idx); }} size="sm" variant={selected === idx ? "primary" : "ghost"} style={{ marginTop: 14, width: "100%", fontSize: 12 }}>{selected === idx ? "\u2713 Selected" : "Select"}</NeonButton>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <NeonButton onClick={handleNext} size="xl" style={{ maxWidth: 420, margin: "0 auto", opacity: selected !== null ? 1 : 0.4, animation: selected !== null ? "glowPulse 2s alternate infinite" : "none" }}>
            Next: Edit Resume
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 11h14M11 4l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </NeonButton>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 16, letterSpacing: "0.08em", fontWeight: 600 }}>JOIN 50,000+ CANDIDATES WHO SECURED INTERVIEWS AT TOP TECH FIRMS.</p>
        </div>
      </div>
    </div>
  );
}

export default TemplatesPage;
