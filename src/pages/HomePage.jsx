import React from "react";
import { SERVICES, PROVIDERS, VOTES, TESTIMONIALS } from "../data/mockData";

export function HomePage({ onBook, onNav, onSelectService }) {
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
              <button className="btn btn-primary btn-lg" onClick={() => onNav("services")}>
                Find a Service →
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => onNav("cooperative")}>
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

      {/* Services Section Preview */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <div className="section-label">Services</div>
              <div className="section-title">Every service your community needs</div>
              <div className="section-desc">All providers are cooperative members — ID verified, skill-tested and community-rated.</div>
            </div>
            <button className="btn btn-ghost" onClick={() => onNav("services")}>View all 24 categories →</button>
          </div>

          <div className="services-grid">
            {SERVICES.slice(0, 6).map((s) => (
              <button className="service-card" key={s.id} onClick={() => onSelectService(s)}>
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

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-bg" />
        <div className="cta-inner">
          <div className="cta-badge">🇮🇳 Made for Bharat · Ministry of Cooperation</div>
          <div className="cta-title">Ready to join your local cooperative?</div>
          <div className="cta-desc">Whether you need a service or want to provide one, SahayogSeva is your community-owned platform.</div>
          <div className="cta-actions">
            <button className="btn btn-primary btn-lg" onClick={() => onNav("services")}>Find a Service →</button>
            <button className="btn btn-saffron btn-lg" onClick={() => onNav("providers")}>Become a Provider</button>
          </div>
        </div>
      </div>
    </div>
  );
}
