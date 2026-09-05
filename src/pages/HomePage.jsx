import React, { useState } from "react";
import { SERVICES, PROVIDERS } from "../data/mockData";

export function HomePage({ onBook, onNav }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
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

  const handleSelectService = (service) => {
    setSelectedCategoryId(service.id);
    document.getElementById("providers")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page-view home-page">
      {/* Hero Section */}
      <section className="hero" id="top">
        <div className="hero-bg" />
        <div className="hero-grid" />

        <div className="hero-inner">
          <div>
            <div className="hero-badge">
              <div className="dot" />
              Ministry of Cooperation · Govt. of India Initiative
            </div>

            <h1>
              Local services,<br />
              <span className="accent">community owned,</span><br />
              <span className="saffron">workers empowered.</span>
            </h1>

            <p className="hero-desc">
              SahayogSeva is India's first cooperative gig marketplace — connecting households with trusted
              local plumbers, tutors, caregivers & more, where every worker earns fairly and every community
              has a stake.
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>
                Find a Service →
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => document.getElementById("cooperative")?.scrollIntoView({ behavior: "smooth" })}>
                Learn the Model
              </button>
            </div>

            <div className="hero-trust">
              <div className="trust-chip"><span className="chip-icon">✅</span> Government Registered</div>
              <div className="trust-chip"><span className="chip-icon">🔒</span> ID & Skill Verified</div>
              <div className="trust-chip"><span className="chip-icon">💚</span> 92% to Workers</div>
            </div>
          </div>

          <div className="hero-visual">
            <div style={{ position: "relative" }}>
              <div className="hero-card-main">
                <div className="card-header">
                  <div className="card-header-icon">🔧</div>
                  <div className="card-header-text">
                    <strong>Plumbers nearby</strong>
                    <span>3 available · New Delhi</span>
                  </div>
                </div>
                <div className="provider-list">
                  {PROVIDERS.slice(0, 2).map((p, i) => (
                    <div className="provider-row" key={i} onClick={() => onBook(p)}>
                      <div className={`avatar ${p.avatar}`}>
                        {p.initials}
                        <div className="verified-dot">✓</div>
                      </div>
                      <div className="provider-info">
                        <div className="provider-name">{p.name}</div>
                        <div className="provider-meta">{p.location} · {p.distance}</div>
                      </div>
                      <div className="provider-right">
                        <span style={{ fontSize: "0.8rem", color: "var(--yellow-500)", fontWeight: 700 }}>★ {p.rating}</span>
                        <div className="price-tag">{p.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="book-slot">
                  <div className="slot-info">
                    <small>📅 Next slot</small>
                    <strong>Today · 4:00 PM</strong>
                  </div>
                  <button className="slot-btn" onClick={() => onBook(PROVIDERS[0])}>Book Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section" id="services">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <div className="section-label">Services</div>
              <div className="section-title">Every service your community needs</div>
              <div className="section-desc">All providers are cooperative members — ID verified, skill-tested and community-rated.</div>
            </div>
          </div>

          <div className="services-grid">
            {SERVICES.map((s) => (
              <button 
                className={`service-card ${currentCatId === s.id ? "active" : ""}`} 
                key={s.id} 
                onClick={() => handleSelectService(s)}
              >
                <div className="service-emoji-box" style={{ background: `${s.color}18` }}>{s.emoji}</div>
                <div className="service-content">
                  <div className="service-title">{s.title}</div>
                  <div className="service-text">{s.text}</div>
                  <div className="service-count">{s.count}</div>
                </div>
                <div className="service-arrow">›</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Providers Section on Same Page */}
      <section className="section" id="providers">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <div className="section-label">Featured Members</div>
              <div className="section-title">Meet your community providers</div>
              <div className="section-desc">Every one of these professionals is a co-op member with verified ID, skills & background check.</div>
            </div>
            {currentCatId !== "all" && (
              <button className="btn btn-outline" onClick={() => setSelectedCategoryId("all")}>
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
      </section>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-bg" />
        <div className="cta-inner">
          <div className="cta-badge">🇮🇳 Made for Bharat · Ministry of Cooperation</div>
          <div className="cta-title">Ready to join your local cooperative?</div>
          <div className="cta-desc">Whether you need a service or want to provide one, SahayogSeva is your community-owned platform.</div>
          <div className="cta-actions">
            <button className="btn btn-primary btn-lg" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>Find a Service →</button>
            <button className="btn btn-saffron btn-lg" onClick={() => document.getElementById("providers")?.scrollIntoView({ behavior: "smooth" })}>Become a Provider</button>
          </div>
        </div>
      </div>
    </div>
  );
}
