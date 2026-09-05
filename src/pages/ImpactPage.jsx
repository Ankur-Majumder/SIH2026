import React from "react";
import { TESTIMONIALS } from "../data/mockData";

export function ImpactPage({ onNav }) {
  return (
    <div className="page-view impact-page">
      <div className="page-header-strip">
        <div className="section-inner" style={{ padding: "3rem 1.5rem 1.5rem" }}>
          <div className="section-label">Live Platform Impact</div>
          <div className="section-title">Real numbers. Real change across Bharat.</div>
          <div className="section-desc">
            Every booking on SahayogSeva directly improves livelihoods, not corporate balance sheets.
          </div>
        </div>
      </div>

      <div className="section-inner">
        <div className="impact-grid" style={{ marginTop: "1rem" }}>
          <div className="impact-card-highlight">
            <div className="impact-big">92%</div>
            <div className="impact-label">Worker Earnings Share</div>
            <div className="impact-sub">vs ~65% on Urbancompany, Ola, Swiggy</div>
            <div className="impact-bar-wrap">
              <div className="impact-bar-row-label"><span>SahayogSeva</span><span style={{ color: "var(--emerald-400)" }}>92%</span></div>
              <div className="impact-bar"><div className="impact-bar-fill" style={{ width: "92%" }} /></div>
              <div className="impact-bar-row-label"><span>Corporate platforms</span><span style={{ color: "#ef4444" }}>~65%</span></div>
              <div className="impact-bar"><div className="impact-bar-fill" style={{ width: "65%", background: "linear-gradient(90deg, #ef4444, #dc2626)" }} /></div>
            </div>
          </div>

          <div className="impact-stats-col">
            {[
              { icon: "🛠️", cls: "icon-green", num: "2,400+", label: "Verified Co-op Members" },
              { icon: "🏘️", cls: "icon-saffron", num: "64", label: "Village Cooperatives Active" },
              { icon: "📋", cls: "icon-blue", num: "47,800+", label: "Total Bookings Completed" },
              { icon: "💰", cls: "icon-purple", num: "₹4.2 Cr+", label: "Paid Out to Workers" },
            ].map((s, i) => (
              <div className="impact-stat-card" key={i}>
                <div className={`impact-stat-icon ${s.cls}`}>{s.icon}</div>
                <div>
                  <div className="impact-stat-num">{s.num}</div>
                  <div className="impact-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sdg-strip" style={{ marginTop: "3rem" }}>
          <div className="sdg-title">Contributing to UN SDGs</div>
          {[
            { num: "SDG 8", text: "Decent Work & Economic Growth" },
            { num: "SDG 10", text: "Reduced Inequalities" },
            { num: "SDG 11", text: "Sustainable Communities" },
            { num: "SDG 17", text: "Partnerships for the Goals" },
          ].map((s, i) => (
            <div className="sdg-chip" key={i}>
              <span className="sdg-num">{s.num}</span>
              <span>{s.text}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "4rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Testimonials</div>
            <div className="section-title">Real voices, real impact</div>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-quote">"</div>
                <div className="testimonial-text">{t.quote}</div>
                <div className="testimonial-footer">
                  <div className={`avatar ${t.avatar}`} style={{ width: 40, height: 40, borderRadius: 10, fontSize: "0.8rem", flexShrink: 0 }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
