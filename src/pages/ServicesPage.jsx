import React, { useState } from "react";
import { SERVICES, PROVIDERS } from "../data/mockData";

export function ServicesPage({ onBook, selectedCategoryId, onSelectCategory }) {
  const [filter, setFilter] = useState("all");

  const currentCatId = selectedCategoryId || "all";

  const filteredProviders = PROVIDERS.filter(p => {
    if (currentCatId !== "all") {
      if (p.category !== currentCatId) return false;
    }
    if (filter === "online") return p.online;
    if (filter === "top") return p.rating >= 4.8;
    return true;
  });

  const handleCardClick = (service) => {
    onSelectCategory(service.id);
    setTimeout(() => {
      document.getElementById("providers-section")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="page-view services-page">
      {/* Services Header */}
      <div className="page-header-strip">
        <div className="section-inner" style={{ padding: "2.5rem 1.5rem 1.5rem" }}>
          <div className="section-label">Services Directory</div>
          <div className="section-title">All Cooperative Service Categories</div>
          <div className="section-desc">
            Select any service category to view verified cooperative providers near you.
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="section-inner">
        <div className="services-grid" style={{ marginTop: "1rem" }}>
          {SERVICES.map((s) => (
            <button
              className={`service-card ${currentCatId === s.id ? "active" : ""}`}
              key={s.id}
              onClick={() => handleCardClick(s)}
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

        {/* Providers Section on Same Page */}
        <div id="providers-section" style={{ paddingTop: "4rem", marginTop: "2rem", borderTop: "1px solid var(--border)" }}>
          <div className="section-header">
            <div>
              <div className="section-label">Featured Members</div>
              <div className="section-title">Meet your community providers</div>
              <div className="section-desc">Every one of these professionals is a co-op member with verified ID, skills & background check.</div>
            </div>
            {currentCatId !== "all" && (
              <button className="btn btn-outline" onClick={() => onSelectCategory("all")}>
                Show All Providers ✕
              </button>
            )}
          </div>

          {/* Status filters */}
          <div className="filter-tabs" style={{ marginBottom: "1.5rem" }}>
            {[["all","All Providers"],["online","🟢 Online Now"],["top","⭐ Top Rated"]].map(([key, label]) => (
              <button key={key} className={`filter-tab${filter === key ? " active" : ""}`} onClick={() => setFilter(key)}>
                {label}
              </button>
            ))}
          </div>

          {filteredProviders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔎</div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>No providers found in this category</div>
              <div style={{ color: "var(--slate-400)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Try selecting another service category above.</div>
            </div>
          ) : (
            <div className="providers-grid">
              {filteredProviders.map((p) => (
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
                      <div className="pcard-name">{p.name}</div>
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
                      {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <div style={{ flex: 1, textAlign: "center", padding: "6px 0", borderRadius: "var(--radius-sm)", background: "var(--bg-card)", fontSize: "0.8rem", fontWeight: 700, color: "var(--emerald-400)" }}>
                        {p.price}
                      </div>
                      <button className="btn btn-primary" style={{ flex: 2, justifyContent: "center", padding: "8px 16px", borderRadius: "var(--radius-sm)", fontSize: "0.82rem" }} onClick={() => onBook(p)}>
                        Book Now →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
