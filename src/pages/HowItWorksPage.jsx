import React from "react";

export function HowItWorksPage({ onNav }) {
  const steps = [
    { n: "01", icon: "🔍", title: "Find a Verified Member", text: "Browse cooperative-certified workers in your locality. Every provider is ID verified and skill tested by the local co-op chapter." },
    { n: "02", icon: "📅", title: "Book & Get It Done", text: "Choose a time, describe your need, and confirm. Real-time updates keep you informed. Full transparency on pricing — no surprise fees." },
    { n: "03", icon: "🤝", title: "Everyone Prospers", text: "The worker keeps 92%. Your rating improves the community. The co-op fee funds member welfare — healthcare, insurance & training." },
  ];

  return (
    <div className="page-view how-page">
      <div className="page-header-strip">
        <div className="section-inner" style={{ padding: "3rem 1.5rem 1.5rem" }}>
          <div className="section-label">How SahayogSeva Works</div>
          <div className="section-title">Transparent, Democratic & Fair</div>
          <div className="section-desc">
            Built on cooperative principles to protect gig workers and serve households with trust.
          </div>
        </div>
      </div>

      <div className="section-inner">
        <div className="steps-grid" style={{ marginTop: "1rem" }}>
          {steps.map((s) => (
            <div className="step-card" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div className="step-icon">{s.icon}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-text">{s.text}</div>
            </div>
          ))}
        </div>

        {/* Comparison section */}
        <div style={{ marginTop: "3.5rem", padding: "2.5rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Cooperative vs Corporate Platforms</h3>
            <p style={{ color: "var(--slate-400)", fontSize: "0.9rem" }}>Why SahayogSeva is better for workers and households alike</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ padding: "1.5rem", background: "#0c831f10", border: "1.5px solid #0c831f", borderRadius: "var(--radius)" }}>
              <div style={{ fontWeight: 800, color: "#0c831f", fontSize: "1.1rem", marginBottom: "0.75rem" }}>💚 SahayogSeva Cooperative</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.88rem" }}>
                <li>✅ 92% earnings to the worker</li>
                <li>✅ Democratic one member, one vote</li>
                <li>✅ Free health insurance & pension pool</li>
                <li>✅ Backed by Ministry of Cooperation</li>
              </ul>
            </div>

            <div style={{ padding: "1.5rem", background: "#ef444410", border: "1.5px solid #ef444450", borderRadius: "var(--radius)" }}>
              <div style={{ fontWeight: 800, color: "#ef4444", fontSize: "1.1rem", marginBottom: "0.75rem" }}>❌ Corporate Gig Apps</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.88rem" }}>
                <li>❌ 25% – 40% extracted in commissions</li>
                <li>❌ Zero worker voting rights or say</li>
                <li>❌ No health benefits or insurance</li>
                <li>❌ Unchecked algorithm price spikes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
