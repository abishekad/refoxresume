import React from "react";
import { GlassCard, C } from "../App";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", paddingTop: 120, paddingBottom: 60, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 800, width: "100%", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 40, animation: "fadeUp 0.6s ease forwards" }}>
          <h1 className="headline" style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 12 }}>
            About <span className="neon" style={{ color: C.primary, fontStyle: "italic" }}>RefoxAI</span>
          </h1>
          <p style={{ color: C.mutedLight, fontSize: 16 }}>The ultimate ATS resume builder tailored for FAANG and top product companies.</p>
        </div>

        <GlassCard style={{ padding: 40, marginBottom: 32 }}>
          <h2 className="headline" style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Our Mission</h2>
          <p style={{ color: C.mutedLight, fontSize: 15, lineHeight: 1.8 }}>
            RefoxAI was built to solve a simple problem: incredibly talented engineers in India were getting rejected by automatic Applicant Tracking Systems (ATS) simply due to poor formatting, missing keywords, and non-parsable designs.
            We reverse-engineered the formatting of resumes that successfully secured offers at Google, Meta, Amazon, Apple, and Microsoft.
          </p>
        </GlassCard>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          <GlassCard style={{ padding: 32 }}>
             <div style={{ fontSize: 32, marginBottom: 16 }}>🤖</div>
             <h3 className="headline" style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>ATS-First Engine</h3>
             <p style={{ color: C.mutedLight, fontSize: 14, lineHeight: 1.6 }}>We strip out fluff and enforce a highly-readable layout for Taleo, Workday, and Greenhouse.</p>
          </GlassCard>
          <GlassCard style={{ padding: 32 }}>
             <div style={{ fontSize: 32, marginBottom: 16 }}>🔒</div>
             <h3 className="headline" style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Privacy First</h3>
             <p style={{ color: C.mutedLight, fontSize: 14, lineHeight: 1.6 }}>Your career data is yours. We secure everything via SSL and use Supabase row-level security.</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
