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
        <div className="comparison-section">
          <div className="comparison-header">
            <h3 className="comparison-title">Cooperative vs Corporate Platforms</h3>
            <p className="comparison-subtitle">Why SahayogSeva is better for workers and households alike</p>
          </div>

          <div className="comparison-grid">
            <div className="comparison-card coop">
              <div className="comparison-card-title">💚 SahayogSeva Cooperative</div>
              <ul className="comparison-list">
                <li>✅ 92% earnings to the worker</li>
                <li>✅ Democratic one member, one vote</li>
                <li>✅ Free health insurance & pension pool</li>
                <li>✅ Backed by Ministry of Cooperation</li>
              </ul>
            </div>

            <div className="comparison-card corp">
              <div className="comparison-card-title">❌ Corporate Gig Apps</div>
              <ul className="comparison-list">
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
