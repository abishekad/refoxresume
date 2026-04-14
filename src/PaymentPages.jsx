import { useState, useEffect } from "react";
import { NeonButton, GlassCard, AmbientOrb, C } from "./App";
import { supabase } from "./services/supabase";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/razorpay-payment`;

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

function PaymentPage({ setPage, user }) {
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  const callEdge = async (body, token) => {
    const res = await fetch(EDGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Server error (${res.status}): ${err}`);
    }
    return res.json();
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in. Please sign in first.");

      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay SDK failed to load. Are you online?");

      // Create Razorpay order via Edge Function
      const order = await callEdge({ action: "create_order" }, session.access_token);
      if (!order.id) throw new Error("Failed to create payment order. Please try again.");

      const token = session.access_token;

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,        // in paise
        currency: order.currency,
        name: "RefoxAI",
        description: "One-Time Resume Download – ₹29",
        image: "https://refoxresume.vercel.app/logo.png",
        order_id: order.id,
        handler: async function (response) {
          // Payment succeeded — verify on backend
          setLoading(true);
          try {
            const verifyData = await callEdge(
              {
                action: "verify_payment",
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              token
            );
            if (verifyData.success) {
              await supabase.auth.refreshSession();
              setTimeout(() => setPage("download"), 600);
            } else {
              alert("Payment verification failed. Contact support with your payment ID: " + response.razorpay_payment_id);
              setLoading(false);
            }
          } catch (e) {
            alert("Verification error: " + e.message);
            setLoading(false);
          }
        },
        prefill: {
          name: user?.user_metadata?.full_name || "",
          email: user?.email || "",
        },
        theme: { color: "#00FF88" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert("Payment failed: " + response.error.description);
        setLoading(false);
      });
      rzp.open();

    } catch (e) {
      alert("Checkout Error: " + (e.message || "Something went wrong."));
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 100, position: "relative", overflow: "hidden" }}>
      <AmbientOrb x="50%" y="40%" size={600} />
      <div style={{ maxWidth: 580, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48, animation: "fadeUp 0.6s ease forwards" }}>
          <h1 className="headline" style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 12 }}>
            RefoxAI – Secure Checkout{" "}<span className="neon" style={{ color: C.primary, fontStyle: "italic" }}>({"₹"}29 only)</span>
          </h1>
          <p style={{ color: C.mutedLight, fontSize: 16 }}>Your career deserves a premium start. Unlock your professional future in seconds.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <GlassCard style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📄</div>
                <div>
                  <div className="headline" style={{ fontWeight: 800, fontSize: 16 }}>Your Google Template Resume</div>
                  <div style={{ fontSize: 12, color: C.muted }}>Optimized for FAANG & Tech</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="headline neon" style={{ fontSize: 28, fontWeight: 900, color: C.primary }}>95/100</div>
                <div style={{ fontSize: 9, letterSpacing: "0.18em", color: C.muted, fontWeight: 700 }}>ATS SCORE</div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span className="headline" style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-0.05em" }}>{"₹"}29</span>
                <div style={{ fontSize: 9, color: C.primary, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", marginTop: 4 }}>ONE-TIME. NO SUBSCRIPTION.</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100, padding: "10px 18px" }}>
                <span style={{ color: C.primary, fontSize: 14 }}>✓</span>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>ATS Ready Export</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ padding: 32, position: "relative" }}>
            <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "7px 20px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.5)" }}>
              <span style={{ color: "#ba84ff", fontSize: 13 }}>🔒</span>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: C.muted, textTransform: "uppercase" }}>Secure SSL Connection</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[{ icon: "🏦", label: "UPI / Wallets", key: "upi" }, { icon: "💳", label: "Credit / Debit", key: "card" }].map((m) => (
                  <div key={m.key} onClick={() => setMethod(m.key)} style={{ background: method === m.key ? "rgba(0,255,136,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${method === m.key ? "rgba(0,255,136,0.4)" : "rgba(255,255,255,0.06)"}`, borderRadius: 16, padding: "20px 16px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{m.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: method === m.key ? C.primary : C.muted }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={handlePay}
                disabled={loading}
                style={{ width: "100%", height: 72, background: loading ? "#00cc6e" : `linear-gradient(135deg, ${C.primary}, #00d16e)`, border: "none", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, cursor: loading ? "default" : "pointer", fontSize: 22, fontWeight: 900, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#003820", letterSpacing: "-0.02em", animation: "glowPulse 3s alternate infinite", transition: "all 0.3s" }}
              >
                {loading ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⚡</span> Processing...</> : <>Pay Now →</>}
              </button>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>100% secure. Instant download after payment.</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 24, opacity: 0.25 }}>
                  {["Razorpay", "UPI", "Visa", "Mastercard"].map((b) => (
                    <span key={b} style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.08em" }}>{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard style={{ padding: 24, display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(0,255,136,0.08)", border: "1px solid rgba(0,255,136,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 24 }}>🛡️</div>
            <div>
              <h4 className="headline" style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Bank-Grade Encryption</h4>
              <p style={{ fontSize: 13, color: C.mutedLight, lineHeight: 1.6 }}>We use 256-bit SSL encryption to ensure that your payment information is 100% safe and secure.</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function SuccessPage({ setPage }) {
  const confettiColors = ["#00FF88", "#a4ffb9", "#00fd87", "#ffffff", "#7ee6ff"];
  const pieces = Array.from({ length: 12 }, (_, i) => ({ left: `${8 + i * 7.5}%`, delay: `${(i * 0.7) % 6}s`, color: confettiColors[i % confettiColors.length], size: 6 + (i % 3) * 3 }));
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 48px", position: "relative", overflow: "hidden" }}>
      {pieces.map((p, i) => (<div key={i} style={{ position: "fixed", top: 0, left: p.left, width: p.size, height: p.size, background: p.color, borderRadius: i % 2 === 0 ? "50%" : 2, animation: `confettiFall 8s linear ${p.delay} infinite`, pointerEvents: "none", zIndex: 200 }} />))}
      <div style={{ maxWidth: 640, width: "100%", textAlign: "center" }}>
        <GlassCard style={{ padding: "64px 48px", position: "relative" }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 40 }}>
            <div style={{ position: "absolute", inset: -20, background: "rgba(0,255,136,0.15)", borderRadius: "50%", filter: "blur(40px)", animation: "glowPulse 2s alternate infinite" }} />
            <div style={{ position: "relative", width: 100, height: 100, borderRadius: "50%", background: "#111", border: "2px solid rgba(0,255,136,0.4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(0,255,136,0.4)", animation: "checkPop 0.6s cubic-bezier(0.4,0,0.2,1) 0.2s both" }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M12 24l8 8 16-16" stroke={C.primary} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
          <h1 className="headline" style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 16 }}>
            🎉 Resume Downloaded!<br /><span className="neon" style={{ color: C.primary, fontStyle: "italic" }}>You're FAANG-Ready.</span>
          </h1>
          <p style={{ fontSize: 17, color: C.mutedLight, lineHeight: 1.7, marginBottom: 40, maxWidth: 420, margin: "0 auto 40px" }}>Your ATS-optimized resume is ready.<br />Good luck with <strong style={{ color: "#fff" }}>Google & top MNCs!</strong></p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 360, margin: "0 auto" }}>
            <NeonButton onClick={() => setPage("templates")} size="xl" style={{ animation: "glowPulse 2s alternate infinite" }}><span>＋</span> Build New Resume</NeonButton>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <NeonButton variant="ghost" size="md" style={{ flexDirection: "column", height: 64 }}><span>⬇ Download Again</span><span style={{ fontSize: 9, color: C.primary, letterSpacing: "0.12em", fontWeight: 800 }}>₹29 ONLY</span></NeonButton>
              <NeonButton variant="outline" size="md">↑ Share Success</NeonButton>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 40, opacity: 0.35 }}>
            {["🟢 Google Ready", "🔵 Meta Optimized", "🟠 AWS Compatible"].map((b) => (<span key={b} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{b}</span>))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.6)", padding: "48px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div>
          <div className="headline neon" onClick={() => setPage("landing")} style={{ fontSize: 20, fontWeight: 900, color: C.primary, cursor: "pointer", marginBottom: 6 }}>RefoxAI</div>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: "0.1em", fontWeight: 600 }}>© 2024 REFOXAI. BUILT WITH PRECISION IN INDIA.</div>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Templates", "Editor", "ATS Check", "Support"].map((l) => (
            <span key={l} onClick={() => setPage(l.toLowerCase().replace(" ", ""))} style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => (e.target.style.color = C.primary)} onMouseLeave={(e) => (e.target.style.color = C.muted)}>{l}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

export { PaymentPage, SuccessPage, Footer };
