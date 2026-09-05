import React from "react";
import { SERVICES } from "../data/mockData";

export function ServicesPage({ onSelectService, onNav }) {
  return (
    <div className="page-view services-page">
      <div className="page-header-strip">
        <div className="section-inner" style={{ padding: "3rem 1.5rem 1.5rem" }}>
          <div className="section-label">Services Directory</div>
          <div className="section-title">All 24 Cooperative Service Categories</div>
          <div className="section-desc">
            Select any service category to instantly view verified cooperative providers near you.
          </div>
        </div>
      </div>

      <div className="section-inner">
        <div className="services-grid" style={{ marginTop: "1rem" }}>
          {SERVICES.map((s) => (
            <button
              className="service-card"
              key={s.id}
              onClick={() => onSelectService(s)}
            >
              <div className="service-emoji-box" style={{ background: `${s.color}18` }}>
                {s.emoji}
              </div>
              <div className="service-content">
                <div className="service-title">{s.title}</div>
                <div className="service-text">{s.text}</div>
                <div className="service-count">{s.count}</div>
              </div>
              <div className="service-arrow">›</div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: "3rem", padding: "2rem", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>💡 How Service Booking Works</h3>
          <p style={{ color: "var(--slate-400)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            Every service category connects you directly with ID-verified local cooperative members.
            92% of your payment is directly transferred to the service provider, while the 8% flat cooperative fee funds member healthcare & skill training.
          </p>
        </div>
      </div>
    </div>
  );
}
