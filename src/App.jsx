import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#060606",
  surface: "#0e0e0e",
  card: "rgba(22,22,22,0.7)",
  border: "rgba(255,255,255,0.07)",
  borderGlow: "rgba(0,255,136,0.2)",
  primary: "#00FF88",
  primaryDim: "#00cc6e",
  text: "#ffffff",
  muted: "#888",
  mutedLight: "#aaa",
};

const styles = {
  global: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${C.bg}; color: ${C.text}; font-family: 'Inter', sans-serif; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #0a0a0a; }
    ::-webkit-scrollbar-thumb { background: ${C.primaryDim}; border-radius: 2px; }
    ::selection { background: rgba(0,255,136,0.25); color: #fff; }
    .headline { font-family: 'Plus Jakarta Sans', sans-serif; }
    .neon { text-shadow: 0 0 20px rgba(0,255,136,0.6); }
    @keyframes glowPulse {
      0% { box-shadow: 0 0 10px rgba(0,255,136,0.3), 0 0 20px rgba(0,255,136,0.1); }
      100% { box-shadow: 0 0 30px rgba(0,255,136,0.7), 0 0 60px rgba(0,255,136,0.3); }
    }
    @keyframes float {
      0%,100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes confettiFall {
      0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 0.8; }
      100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
    }
    @keyframes orb {
      0%,100% { transform: translate(0,0) scale(1); }
      33% { transform: translate(40px,-30px) scale(1.1); }
      66% { transform: translate(-20px,20px) scale(0.95); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes checkPop {
      0% { transform: scale(0) rotate(-20deg); opacity: 0; }
      70% { transform: scale(1.2) rotate(5deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
  `,
};

function GlassCard({ children, style = {}, className = "", hover = true }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: C.card,
        backdropFilter: "blur(24px)",
        border: `1px solid ${hovered ? C.borderGlow : C.border}`,
        borderRadius: 24,
        transition: "all 0.3s ease",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,136,0.1)"
          : "0 8px 32px rgba(0,0,0,0.4)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function NeonButton({ children, onClick, size = "md", variant = "primary", style = {} }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
    cursor: "pointer", border: "none", fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 800, letterSpacing: "-0.01em", transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
    userSelect: "none",
  };
  const sizes = {
    sm: { padding: "10px 20px", fontSize: 13, borderRadius: 12 },
    md: { padding: "14px 28px", fontSize: 15, borderRadius: 16 },
    lg: { padding: "18px 40px", fontSize: 18, borderRadius: 20 },
    xl: { padding: "20px 48px", fontSize: 22, borderRadius: 20, width: "100%" },
  };
  const variants = {
    primary: {
      background: hovered ? "#00FF99" : C.primary,
      color: "#003820",
      boxShadow: hovered
        ? "0 0 40px rgba(0,255,136,0.7), 0 8px 24px rgba(0,0,0,0.3)"
        : "0 0 20px rgba(0,255,136,0.3)",
      transform: pressed ? "scale(0.97)" : hovered ? "scale(1.02)" : "scale(1)",
    },
    ghost: {
      background: hovered ? "rgba(0,255,136,0.08)" : "rgba(255,255,255,0.04)",
      color: hovered ? C.primary : C.mutedLight,
      border: `1px solid ${hovered ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.1)"}`,
      transform: pressed ? "scale(0.97)" : "scale(1)",
    },
    outline: {
      background: "transparent",
      color: C.primary,
      border: `2px solid rgba(0,255,136,0.4)`,
      transform: pressed ? "scale(0.97)" : hovered ? "scale(1.02)" : "scale(1)",
      boxShadow: hovered ? "0 0 20px rgba(0,255,136,0.2)" : "none",
    },
    white: {
      background: hovered ? "#f0f0f0" : "#fff",
      color: "#111",
      transform: pressed ? "scale(0.97)" : hovered ? "scale(1.01)" : "scale(1)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    },
  };
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}

function Nav({ page, setPage, user, onLogout }) {
  const links = ["Templates", "Editor", "Download"];
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  
  return (
    <nav style={{
      position: "fixed", top: 0, width: "100%", zIndex: 100,
      background: scrolled ? "rgba(6,6,6,0.85)" : "rgba(6,6,6,0.4)",
      backdropFilter: "blur(24px)",
      borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.06)" : "transparent"}`,
      transition: "all 0.4s ease",
      height: 72,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          onClick={() => setPage("landing")}
          className="headline neon"
          style={{ fontSize: 22, fontWeight: 900, color: C.primary, cursor: "pointer", letterSpacing: "-0.03em" }}
        >
          RefoxAI
        </div>
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {links.map(l => (
            <span
              key={l}
              onClick={() => setPage(l.toLowerCase())}
              style={{
                fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: page === l.toLowerCase() ? C.primary : C.muted,
                borderBottom: page === l.toLowerCase() ? `2px solid ${C.primary}` : "2px solid transparent",
                paddingBottom: 2,
                transition: "all 0.2s",
                letterSpacing: "0.02em",
              }}
            >
              {l}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!user ? (
             <NeonButton onClick={() => setPage("templates")} size="sm">Get Started</NeonButton>
          ) : (
             <div style={{ position: 'relative' }}>
                <div 
                   onClick={() => setShowDropdown(!showDropdown)}
                   style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)' }}
                >
                   <img src={user.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=" + (user.user_metadata?.full_name || "User") + "&background=00FF88&color=000"} alt="Avatar" style={{ width: 28, height: 28, borderRadius: '50%' }} />
                   <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{user.user_metadata?.full_name?.split(' ')[0] || "User"}</span>
                </div>
                {showDropdown && (
                  <div style={{ position: 'absolute', top: 50, right: 0, background: '#111', border: '1px solid #333', borderRadius: 12, padding: '8px', minWidth: 160, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                    <div style={{ padding: '8px 12px', fontSize: 13, color: '#888', borderBottom: '1px solid #222', marginBottom: 4 }}>
                       {user.email}
                    </div>
                    <div 
                      onClick={() => { setShowDropdown(false); onLogout && onLogout(); }}
                      style={{ padding: '10px 12px', fontSize: 13, color: '#ff4444', cursor: 'pointer', borderRadius: 8, transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255,0,0,0.1)'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      Sign Out
                    </div>
                  </div>
                )}
             </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function AmbientOrb({ color = C.primary, size = 600, x = "50%", y = "50%", opacity = 0.06 }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: size, height: size,
      transform: "translate(-50%,-50%)",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity, pointerEvents: "none", borderRadius: "50%",
      animation: "orb 12s ease-in-out infinite",
    }} />
  );
}

function TestimonialSection() {
  const reviews = [
    { name: "Rahul S.", role: "Software Engineer", company: "Google", text: "The ATS keyword optimization is next level. It told me exactly what I was missing. Got my interview call in 3 days!" },
    { name: "Priya M.", role: "Frontend Developer", company: "Amazon", text: "I was using standard templates for months with no luck. RefoxAI's format passed the ATS instantly." },
    { name: "Vikram K.", role: "Data Scientist", company: "Meta", text: "Finally a tool built for tech. The AI summary generator actually sounds like a real engineer wrote it, not a robot." },
  ];
  return (
    <section style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <h2 className="headline" style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.03em" }}>Engineers love our <span className="neon" style={{ color: C.primary, fontStyle: "italic" }}>ATS Resumes</span></h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {reviews.map((r) => (
          <GlassCard key={r.name} style={{ padding: 32 }}>
            <div style={{ display: "flex", gap: 4, color: C.primary, marginBottom: 16 }}>
              {"★★★★★"}
            </div>
            <p style={{ fontSize: 15, color: C.text, lineHeight: 1.7, marginBottom: 24 }}>"{r.text}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(0,255,136,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.primary }}>
                {r.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: C.mutedLight }}>{r.role} at <span style={{ color: "#fff", fontWeight: 600 }}>{r.company}</span></div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function SuccessStoriesSection() {
  const stories = [
    {
      name: "Aditya Verma", role: "SDE II", target: "Amazon",
      time: "2 days ago",
      text: "I'm thrilled to announce that I will be joining Amazon as a Software Development Engineer II! Huge thanks to RefoxAI for their incredible ATS resume builder that helped my profile get shortlisted almost immediately.",
      likes: "1,204", comments: "142"
    },
    {
      name: "Sneha Rao", role: "Product Manager", target: "Microsoft",
      time: "1 week ago",
      text: "After months of applying into the void, I finally cracked Microsoft! The real game-changer was switching my resume to a FAANG-ready format. RefoxAI's keyword optimization is magic.",
      likes: "892", comments: "76"
    }
  ];
  return (
    <section style={{ padding: "80px 32px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <h2 className="headline" style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.03em" }}>Real <span className="neon" style={{ color: C.primary, fontStyle: "italic" }}>Success Stories</span></h2>
        <p style={{ fontSize: 16, color: C.mutedLight, marginTop: 16 }}>Join the growing network of Indian engineers securing top MNC offers.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {stories.map(s => (
          <GlassCard key={s.name} style={{ padding: "24px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #222, #111)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                💼
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: C.mutedLight }}>{s.role} • {s.time}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "#eee", lineHeight: 1.6, marginBottom: 16 }}>
              {s.text}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.mutedLight }}>
                <span style={{ color: C.primary }}>👍</span> {s.likes}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.mutedLight }}>
                💬 {s.comments} Comments
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function LandingPage({ setPage }) {
  const features = [
    { icon: "\u{1F3AF}", title: "5 Resumes Got Into Google", desc: "We reverse-engineered the formatting and keyword density of successful profiles from Google, Meta, and Amazon." },
    { icon: "\u{1F916}", title: "ATS First, Design Second", desc: "Most builders focus on pretty colors. We force an ATS-friendly structure that ensures your data never gets lost in the systems." },
    { icon: "\u{1F1EE}\u{1F1F3}", title: "Built for Indian Tech Talent", desc: "Optimized for Indian recruiters and specific MNC requirements like Bangalore, Hyderabad, and Pune." },
  ];
  const steps = [
    { n: "01", title: "Sign in with Google", desc: "Instant access, no long forms. Sync your profile in seconds." },
    { n: "02", title: "Pick a FAANG-Backed Template", desc: "Choose from battle-tested layouts that human recruiters love." },
    { n: "03", title: "Optimize & Download", desc: "Edit with AI help, check your score, and pay just \u20B929 to get the PDF." },
  ];
  const featureGrid = [
    { icon: "\u2728", t: "AI-Written Summary", d: "Generates powerful professional summaries tailored to your target job sector to succeed." },
    { icon: "\u{1F511}", t: "ATS Keyword Optimization", d: "We score your draft and suggest strong keywords that specific recruiters are looking for." },
    { icon: "\u{1F441}\uFE0F", t: "Real-Time Preview", d: "We force on-brand ATS formatting. What you see is exactly what you get." },
    { icon: "\u{1F517}", t: "One-Click Google Login", d: "Seamless onboarding. No passwords to remember or accounts to verify." },
    { icon: "\u20B9", t: "Only \u20B929 Per Download", d: "Fair pricing for Indian engineers. No monthly subscriptions or hidden fees." },
    { icon: "\u{1F4C4}", t: "PDF Export Ready for ATS", d: "We output standard text-layer PDFs that are 100% readable by scanning software." },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 100 }}>
        <AmbientOrb x="30%" y="40%" size={700} />
        <AmbientOrb x="80%" y="60%" size={400} color="#7ee6ff" opacity={0.04} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", width: "100%" }}>
          <div style={{ animation: "fadeUp 0.8s ease forwards" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary, boxShadow: `0 0 8px ${C.primary}` }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.primary, letterSpacing: "0.12em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>#1 ATS RESUME BUILDER FOR FAANG</span>
            </div>
            <h1 className="headline" style={{ fontSize: "clamp(44px, 5vw, 72px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 24 }}>
              Build an <span className="neon" style={{ color: C.primary, fontStyle: "italic", background: "linear-gradient(135deg, #00FF88, #00D16E, #00FF88)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 3s linear infinite" }}>AI-Powered</span> ATS Resume in 10 minutes.
            </h1>
            <p style={{ fontSize: 17, color: C.mutedLight, lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>5 real resumes that got offers at Google and top MNCs — transformed by AI into your perfect template.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
              {["Smart AI keyword optimization.", "FAANG-ready ATS formatting.", "\u20B929 single download fee."].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="rgba(0,255,136,0.15)" /><path d="M5 8l2 2 4-4" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span style={{ fontSize: 14, color: C.mutedLight }}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <NeonButton onClick={() => setPage("templates")} size="lg">
                Get Started – Free Until Download
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </NeonButton>
              <span style={{ fontSize: 12, color: C.muted }}>No credit card required to start</span>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 32, flexWrap: "wrap" }}>
              {["Optimized for ATS", "Built for FAANG", "Designed for Indian Tech"].map(t => (
                <span key={t} style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{"\u2726"} {t}</span>
              ))}
            </div>
          </div>
          <div style={{ position: "relative", display: "flex", justifyContent: "center", animation: "float 6s ease-in-out infinite" }}>
            <div style={{ width: 340, background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 0 0 1px rgba(0,255,136,0.3), 0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(0,255,136,0.15)", transform: "perspective(1000px) rotateY(-8deg) rotateX(4deg)" }}>
              <div style={{ borderBottom: "2px solid #111", paddingBottom: 12, marginBottom: 12 }}>
                <div style={{ width: 160, height: 18, background: "#111", borderRadius: 3, marginBottom: 6 }} />
                <div style={{ width: 220, height: 10, background: "#ddd", borderRadius: 2 }} />
              </div>
              {["PROFESSIONAL SUMMARY", "EXPERIENCE", "SKILLS"].map((section, i) => (
                <div key={section} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", color: "#333", marginBottom: 6 }}>{section}</div>
                  {Array.from({ length: i === 2 ? 2 : 3 }).map((_, j) => (
                    <div key={j} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                      {i === 2 && <div style={{ width: 4, height: 4, background: C.primary, borderRadius: "50%", marginTop: 3, flexShrink: 0 }} />}
                      <div style={{ flex: 1, height: 7, background: j === 0 ? "rgba(0,255,136,0.3)" : "#eee", borderRadius: 2 }} />
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ position: "absolute", top: -12, right: -12, background: "#111", border: `1px solid ${C.primary}`, borderRadius: 10, padding: "8px 14px", boxShadow: `0 0 20px rgba(0,255,136,0.4)` }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: C.primary, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>95</div>
                <div style={{ fontSize: 8, color: C.muted, letterSpacing: "0.1em" }}>ATS SCORE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "100px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 className="headline" style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.03em" }}>Why RefoxAI works for{" "}<span className="neon" style={{ color: C.primary, fontStyle: "italic" }}>FAANG & Top MNCs</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {features.map((f) => (
            <GlassCard key={f.title} style={{ padding: 32 }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 className="headline" style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, letterSpacing: "-0.02em" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: C.mutedLight, lineHeight: 1.7 }}>{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 className="headline" style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.03em" }}>How RefoxAI gets you{" "}<span className="neon" style={{ color: C.primary, fontStyle: "italic" }}>interview-ready</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32 }}>
          {steps.map((s) => (
            <div key={s.n} style={{ position: "relative" }}>
              <div className="headline" style={{ fontSize: 80, fontWeight: 900, color: "rgba(0,255,136,0.06)", letterSpacing: "-0.05em", lineHeight: 1, marginBottom: -20 }}>{s.n}</div>
              <h3 className="headline" style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, letterSpacing: "-0.02em" }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: C.mutedLight, lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2 className="headline" style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-0.03em" }}>Features that help you beat{" "}<span className="neon" style={{ color: C.primary, fontStyle: "italic" }}>ATS and impress recruiters</span></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {featureGrid.map((f) => (
            <GlassCard key={f.t} style={{ padding: 28 }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{f.icon}</div>
              <h4 className="headline" style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>{f.t}</h4>
              <p style={{ fontSize: 13, color: C.mutedLight, lineHeight: 1.6 }}>{f.d}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <TestimonialSection />
      
      <SuccessStoriesSection />

      <section style={{ padding: "80px 32px", maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <GlassCard style={{ padding: "64px 48px" }}>
          <h2 className="headline" style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 16 }}>Ready to build your{" "}<span className="neon" style={{ color: C.primary, fontStyle: "italic" }}>FAANG-ready resume?</span></h2>
          <p style={{ fontSize: 16, color: C.mutedLight, marginBottom: 32 }}>Join thousands of Indian developers who have landed interviews at Top MNCs. No monthly fees. Just {"\u20B9"}29 per final download.</p>
          <div style={{ fontSize: 56, fontWeight: 900, color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.04em", marginBottom: 4 }}>{"\u20B9"}29</div>
          <div style={{ fontSize: 10, color: C.primary, letterSpacing: "0.2em", fontWeight: 700, marginBottom: 32, textTransform: "uppercase" }}>Per Resume Download</div>
          <NeonButton onClick={() => setPage("templates")} size="xl">
            Get Started Now
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </NeonButton>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 16 }}>No credit card required to start</p>
        </GlassCard>
      </section>
    </div>
  );
}

export { LandingPage, Nav, NeonButton, GlassCard, AmbientOrb, C, styles };
