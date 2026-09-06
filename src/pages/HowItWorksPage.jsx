import React from "react";

export function HowItWorksPage({ onNav }) {
  const steps = [
    {
      n: "01",
      icon: "🪪",
      title: "DigiLocker Aadhaar e-KYC Verification",
      text: "Every worker connects their UIDAI Aadhaar via DigiLocker. Instant digital verification prevents fake profiles, assures safety for households, and mints an official National Labour ID Card.",
    },
    {
      n: "02",
      icon: "📅",
      title: "Direct Community Booking & Slots",
      text: "Households select verified local plumbers, tutors, electricians, or caregivers. Choose preferred arrival time slots with transparent upfront pricing and no surge fees.",
    },
    {
      n: "03",
      icon: "💳",
      title: "Protected Bharat Escrow Payment",
      text: "Pay securely via UPI (GPay/PhonePe/Paytm), RuPay Cards, or Net Banking. Funds are held in safe Cooperative Escrow and released to the worker only when you provide the 4-digit completion code.",
    },
    {
      n: "04",
      icon: "🤝",
      title: "92% Direct Payout to Worker",
      text: "The worker keeps 92% of the payment directly in their bank account or UPI. The 8% flat co-op fee funds member healthcare, life insurance, and free vocational upskilling.",
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
