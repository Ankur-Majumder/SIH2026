import React, { useState } from "react";
import { PROVIDERS } from "../data/mockData";

export function ProvidersPage({ onBook }) {
  const [filter, setFilter] = useState("all");

  const filtered = PROVIDERS.filter((p) => {
    if (filter === "online") return p.online;
    if (filter === "top") return p.rating >= 4.8;
    return true;
  });

  return (
    <div className="page-view providers-page">
      <div className="page-header-strip">
        <div className="section-inner" style={{ padding: "3rem 1.5rem 2rem" }}>
          <div className="section-label">Cooperative Members</div>
          <div className="section-title">Verified Skilled Workers & Artisans</div>
          <div className="section-desc">
            All providers are certified cooperative members with DigiLocker Aadhaar e-KYC background checks.
          </div>
        </div>
      </div>

      <div className="section-inner" style={{ padding: "2rem 1.5rem 4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div className="filter-tabs">
            {[["all", "All Providers"], ["online", "🟢 Online Now"], ["top", "⭐ Top Rated"]].map(([key, label]) => (
              <button key={key} className={`filter-tab${filter === key ? " active" : ""}`} onClick={() => setFilter(key)}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="providers-grid">
          {filtered.map((p) => (
            <div className="provider-card" key={p.id} id={`provider-${p.id}`}>
              <div className="provider-card-header">
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div className={`provider-avatar-lg ${p.avatar}`}>
                    {p.initials}
                    <div className="pcard-verified">✓</div>
                  </div>
                  {p.online && <div className="online-dot" title="Online Now" />}
                </div>
                <div>
                  <div className="pcard-name" style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexWrap: "wrap" }}>
                    {p.name}
                    <span style={{ fontSize: "0.6rem", background: "#e0f2fe", color: "#0369a1", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>
                      DigiLocker
                    </span>
                  </div>
                  <div className="pcard-role">{p.role}</div>
                  <div className="pcard-location">📍 {p.location} · {p.distance}</div>
                </div>
              </div>
              <div className="provider-card-body">
                <div className="pcard-stats">
                  <div className="pcard-stat">
                    <span className="pcard-stat-val">⭐ {p.rating}</span>
                    <span className="pcard-stat-key">Rating</span>
                  </div>
                  <div className="pcard-stat">
                    <span className="pcard-stat-val">{p.reviews}</span>
                    <span className="pcard-stat-key">Reviews</span>
                  </div>
                  <div className="pcard-stat">
                    <span className="pcard-stat-val">{p.jobs}</span>
                    <span className="pcard-stat-key">Jobs done</span>
                  </div>
                </div>
                <div className="pcard-tags">
                  {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <div style={{ flex: 1, textAlign: "center", padding: "6px 0", borderRadius: "var(--radius-sm)", background: "var(--bg-card)", fontSize: "0.8rem", fontWeight: 700, color: "var(--emerald-400)" }}>
                    {p.price}
                  </div>
                  <button className="btn btn-primary" style={{ flex: 2, justifyContent: "center", padding: "8px 16px", borderRadius: "var(--radius-sm)", fontSize: "0.82rem" }} onClick={() => onBook(p)}>
                    Book with Escrow →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
