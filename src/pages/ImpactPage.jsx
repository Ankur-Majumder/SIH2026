import React from "react";

export function ImpactPage({ onNav, onOpenLabourReg }) {
  return (
    <div className="page-view impact-page">
      <div className="page-header-strip">
        <div className="section-inner" style={{ padding: "3rem 1.5rem 2rem", textAlign: "center" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>National Impact</div>
          <div className="section-title">Measurable Social & Economic Empowerment</div>
          <div className="section-desc" style={{ margin: "0 auto" }}>
            Every booking on SahayogSeva directly strengthens local livelihoods, community resilience, and economic sovereignty.
          </div>
        </div>
      </div>

      <div className="section-inner" style={{ padding: "2rem 1.5rem 4rem" }}>
        <div className="impact-grid">
          <div className="impact-card-highlight">
            <div className="impact-big">92%</div>
            <div className="impact-label">Worker Earnings Share</div>
            <div className="impact-sub">vs ~60-65% on corporate apps</div>
            <div className="impact-bar-wrap" style={{ marginTop: "1.5rem" }}>
              <div className="impact-bar-row-label">
                <span>SahayogSeva</span>
                <span style={{ color: "var(--emerald-500)", fontWeight: 800 }}>92%</span>
              </div>
              <div className="impact-bar">
                <div className="impact-bar-fill" style={{ width: "92%", background: "#0c831f" }} />
              </div>
              <div className="impact-bar-row-label" style={{ marginTop: "0.75rem" }}>
                <span>Corporate platforms</span>
                <span style={{ color: "#ef4444", fontWeight: 800 }}>~65%</span>
              </div>
              <div className="impact-bar">
                <div className="impact-bar-fill" style={{ width: "65%", background: "#ef4444" }} />
              </div>
            </div>
          </div>

          <div className="impact-stats-col">
            {[
              { icon: "🛠️", cls: "icon-green", num: "2,400+", label: "DigiLocker Verified Workers" },
              { icon: "🏘️", cls: "icon-saffron", num: "64", label: "Village & Urban Co-ops Active" },
              { icon: "📋", cls: "icon-blue", num: "47,800+", label: "Total Bookings Completed" },
              { icon: "💰", cls: "icon-purple", num: "₹4.2 Cr+", label: "Paid Out Directly to Workers" },
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
          <div className="sdg-title">Aligned with UN Sustainable Development Goals</div>
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
      </div>
    </div>
  );
}
