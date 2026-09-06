import React from "react";

export function CooperativePage({ onNav }) {
  const principles = [
    { n: 1, title: "Democratic Member Control", desc: "One member, one vote. Every registered cooperative member participates in decisions about platform policies, welfare fees, and regional leadership." },
    { n: 2, title: "Fair Wage Distribution (92%)", desc: "Only a flat 8% cooperative fee is deducted per booking. 92% is paid directly to the worker — far above the 25-40% extracted by corporate aggregators." },
    { n: 3, title: "DigiLocker Trust & Accountability", desc: "Workers and household members are officially verified via DigiLocker Aadhaar e-KYC, providing safety, transparency, and government-grade trust." },
    { n: 4, title: "Government Regulatory Backing", desc: "Registered under the Multi-State Cooperative Societies Act and guided by the Ministry of Cooperation, ensuring full compliance and community asset protection." },
  ];

  return (
    <div className="page-view coop-page">
      <div className="page-header-strip">
        <div className="section-inner" style={{ padding: "3rem 1.5rem 2rem" }}>
          <div className="section-label">Cooperative Model</div>
          <div className="section-title">A Platform Built For — and By — People</div>
          <div className="section-desc">
            Unlike corporate gig platforms that extract value from workers, SahayogSeva is structured as a national multi-stakeholder cooperative.
          </div>
        </div>
      </div>

      <div className="section-inner" style={{ padding: "2rem 1.5rem 4rem" }}>
        <div className="coop-grid">
          <div>
            <div className="section-label">Core Principles</div>
            <div className="section-title" style={{ fontSize: "1.6rem" }}>Democratizing the Gig Economy</div>
            <p style={{ color: "var(--slate-500)", margin: "1rem 0 2rem", lineHeight: 1.7, fontSize: "0.95rem" }}>
              Workers are co-op members, not expendable contractors. Households are co-owners, not merely customers.
              Surplus is re-invested into member healthcare, child education grants, and retirement funds.
            </p>
            <div className="principles-list">
              {principles.map((p) => (
                <div className="principle" key={p.n}>
                  <div className="principle-num">{p.n}</div>
                  <div>
                    <div className="principle-title">{p.title}</div>
                    <div className="principle-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="coop-visual">
            <div className="coop-highlight">
              <div className="coop-percent">92%</div>
              <div className="coop-percent-label">of every booking payment goes directly to the worker</div>
            </div>
            {[
              { icon: "🏛️", iconClass: "icon-saffron", title: "Ministry of Cooperation", desc: "Registered & supported under MSCS Act, Govt. of India" },
              { icon: "🪪", iconClass: "icon-blue", title: "DigiLocker Aadhaar e-KYC", desc: "Instant UIDAI digital verification for all workers" },
              { icon: "🛡️", iconClass: "icon-green", title: "Worker Welfare Fund", desc: "Health insurance, pension & emergency pool" },
              { icon: "💳", iconClass: "icon-purple", title: "Protected Bharat Escrow", desc: "Funds locked safely until job completion PIN" },
            ].map((c, i) => (
              <div className="coop-card" key={i}>
                <div className={`coop-card-icon ${c.iconClass}`}>{c.icon}</div>
                <div>
                  <div className="coop-card-title">{c.title}</div>
                  <div className="coop-card-desc">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <button className="btn btn-primary btn-lg" onClick={() => onNav && onNav("services")}>
            Explore Verified Cooperative Services →
          </button>
        </div>
      </div>
    </div>
  );
}
