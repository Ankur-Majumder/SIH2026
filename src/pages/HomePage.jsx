import React, { useState } from "react";
import { PROVIDERS, SERVICES } from "../data/mockData";

export function HomePage({ onBook, onNav, onSelectService }) {
  const [query, setQuery] = useState("");
  const [stateLocation, setStateLocation] = useState("Select State");

  const handleSearch = () => {
    if (onNav) {
      onNav("services");
    }
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
              local plumbers, tutors, caregivers & more, where every worker earns fairly (92% payout) and every community
              has a stake.
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => onNav && onNav("services")}>
                Find a Service →
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => onNav && onNav("cooperative")}>
                Learn the Model
              </button>
            </div>

            <div className="hero-trust">
              <div className="trust-chip"><span className="chip-icon">✅</span> Govt. Registered (MSCS Act)</div>
              <div className="trust-chip"><span className="chip-icon">🔒</span> DigiLocker Aadhaar Verified</div>
              <div className="trust-chip"><span className="chip-icon">💚</span> 92% Direct to Workers</div>
              <div className="trust-chip"><span className="chip-icon">💳</span> Protected Bharat Escrow</div>
            </div>

            {/* Search bar */}
            <div className="search-bar-wrap" style={{ maxWidth: "100%", marginTop: "2.5rem" }}>
              <div className="search-bar">
                <span className="search-bar-icon">⌕</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search for a service... e.g. Plumber, Electrician, Tutor"
                />
                <div className="search-divider" />
                <select
                  className="search-location-select"
                  value={stateLocation}
                  onChange={(e) => setStateLocation(e.target.value)}
                >
                  <option value="Select State">📍 Select State</option>
                  <option value="Delhi NCR">📍 Delhi NCR</option>
                  <option value="Uttar Pradesh">📍 Uttar Pradesh</option>
                  <option value="Maharashtra">📍 Maharashtra</option>
                  <option value="Bihar">📍 Bihar</option>
                  <option value="Karnataka">📍 Karnataka</option>
                  <option value="West Bengal">📍 West Bengal</option>
                  <option value="Tamil Nadu">📍 Tamil Nadu</option>
                  <option value="Rajasthan">📍 Rajasthan</option>
                  <option value="Gujarat">📍 Gujarat</option>
                  <option value="Punjab">📍 Punjab</option>
                  <option value="Haryana">📍 Haryana</option>
                  <option value="Madhya Pradesh">📍 Madhya Pradesh</option>
                </select>
                <button className="btn btn-primary" style={{ borderRadius: "var(--radius-full)", padding: "8px 20px" }} onClick={handleSearch}>
                  Search
                </button>
              </div>
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
                    <div className="provider-row" key={i} onClick={() => onBook && onBook(p)}>
                      <div className={`avatar ${p.avatar}`}>
                        {p.initials}
                        <div className="verified-dot">✓</div>
                      </div>
                      <div className="provider-info">
                        <div className="provider-name" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          {p.name}
                          <span style={{ fontSize: "0.6rem", background: "#e0f2fe", color: "#0369a1", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>
                            DigiLocker
                          </span>
                        </div>
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
                  <button className="slot-btn" onClick={() => onBook && onBook(PROVIDERS[0])}>Book with Escrow →</button>
                </div>
              </div>

              <div className="float-badge float-badge-1">
                <span className="fb-icon">💚</span>
                <div className="fb-text">
                  <strong>92% Payout</strong>
                  <small>Direct to worker bank</small>
                </div>
              </div>
              <div className="float-badge float-badge-2">
                <span className="fb-icon">🏛️</span>
                <div className="fb-text">
                  <strong>DigiLocker e-KYC</strong>
                  <small>100% Aadhaar Verified</small>
                </div>
              </div>
              <div className="float-badge float-badge-3">
                <span className="fb-icon">⭐</span>
                <div className="fb-text">
                  <strong>4.8 avg</strong>
                  <small>18,600+ reviews</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="stats-strip">
        <div className="stats-inner">
          <div className="stat-item">
            <div className="stat-icon-box icon-green">🛠️</div>
            <div>
              <div className="stat-num">2,400+</div>
              <div className="stat-label">Verified Co-op Members</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-box icon-saffron">🏠</div>
            <div>
              <div className="stat-num">18,600+</div>
              <div className="stat-label">Households Served</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-box icon-blue">🏘️</div>
            <div>
              <div className="stat-num">64</div>
              <div className="stat-label">Village Cooperatives</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-box icon-purple">💚</div>
            <div>
              <div className="stat-num">92%</div>
              <div className="stat-label">Direct Wage to Workers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Preview */}
      <section className="section" id="services">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <div className="section-label">Popular Services</div>
              <div className="section-title">Every service your community needs</div>
              <div className="section-desc">All providers are cooperative members — DigiLocker ID verified, skill-tested and community-rated.</div>
            </div>
            <button className="btn btn-ghost" onClick={() => onNav && onNav("services")}>View all categories →</button>
          </div>

          <div className="services-grid">
            {SERVICES.slice(0, 6).map((s) => (
              <button
                className="service-card"
                key={s.id}
                onClick={() => onSelectService ? onSelectService(s) : onNav && onNav("services")}
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
        </div>
      </section>
    </div>
  );
}
