import React from "react";

export function HowItWorksPage({ onNav }) {
  const steps = [
    {
      n: "01",
      icon: "🎙️",
      title: "Problem Media & Voice-First Explanation",
      text: "Customers upload a photo or video of their issue and describe it by text or Voice Recording with real-time speech translation — designed especially for users who cannot type or are uneducated.",
    },
    {
      n: "02",
      icon: "📍",
      title: "Worker Standby Location & Live Route Tracking",
      text: "Explore verified cooperative workers near you with transparent daily charges. View their exact current location on map, and upon payment, watch the worker's live transit movement navigating to your doorstep.",
    },
    {
      n: "03",
      icon: "🛡️",
      title: "On-Site Dual Photo Verification Handshake",
      text: "Upon arrival, the worker takes an on-site verification photo. The platform AI matches both customer and worker data for visual similarity & GPS accuracy before authorizing work.",
    },
    {
      n: "04",
      icon: "✅",
      title: "Final Work Proof & Customer Sign-Off",
      text: "When repairs are complete, the worker submits final work proof. The customer reviews the side-by-side Before/After comparison and approves completion to release 85% escrow payment safely.",
    },
  ];


  return (
    <div className="page-view how-it-works-page">
      <div className="page-header-strip">
        <div className="section-inner" style={{ padding: "3rem 1.5rem 2rem", textAlign: "center" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Cooperative Process</div>
          <div className="section-title">How SahayogSeva Works</div>
          <div className="section-desc" style={{ margin: "0 auto" }}>
            A fair, transparent, government-backed workflow built on cooperative ownership and digital trust.
          </div>
        </div>
      </div>

      <div className="section-inner" style={{ padding: "2rem 1.5rem 4rem" }}>
        <div className="steps-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {steps.map((s) => (
            <div className="step-card" key={s.n} style={{ textAlign: "left" }}>
              <div className="step-num">{s.n}</div>
              <div className="step-icon">{s.icon}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-text" style={{ lineHeight: 1.6 }}>{s.text}</div>
            </div>
          ))}
        </div>

        {/* Dual Actions CTA */}
        <div style={{ marginTop: "3.5rem", padding: "2.5rem", background: "#f8fafc", borderRadius: "18px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.25rem" }}>
              Ready to get started?
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
              Join thousands of households and verified workers across India today.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => onNav && onNav("services")}>
              Find a Service →
            </button>
            <button className="btn btn-outline" onClick={() => onNav && onNav("cooperative")}>
              Learn the Model
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
