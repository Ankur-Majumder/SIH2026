import React, { useState } from "react";
import { VOTES } from "../data/mockData";

export function CooperativePage({ onNav }) {
  const [votes, setVotes] = useState(VOTES.map(v => ({ ...v, myVote: null })));

  const handleVote = (id, choice) => {
    setVotes(prev => prev.map(v =>
      v.id === id && !v.myVote ? { ...v, myVote: choice,
        yes: choice === "yes" ? v.yes + 1 : v.yes,
        no: choice === "no" ? v.no + 1 : v.no
      } : v
    ));
  };

  const principles = [
    { n: 1, title: "Democratic Member Control", desc: "One member, one vote. Every registered cooperative member participates in decisions about platform policies, fees, and leadership." },
    { n: 2, title: "Fair Wage Distribution", desc: "Only a flat 8% cooperative fee is deducted per booking. 92% is paid directly to the worker — far above the 25-40% taken by corporate platforms." },
    { n: 3, title: "Community Ownership", desc: "Workers and household members are co-owners. Profits are re-invested in member welfare: health insurance, upskilling, and pension funds." },
    { n: 4, title: "Government Accountability", desc: "Registered under the Multi-State Cooperative Societies Act and backed by the Ministry of Cooperation, ensuring regulatory compliance and trust." },
  ];

  return (
    <div className="page-view coop-page">
      <div className="page-header-strip">
        <div className="section-inner" style={{ padding: "3rem 1.5rem 1.5rem" }}>
          <div className="section-label">Ministry of Cooperation Initiative</div>
          <div className="section-title">Multi-State Cooperative Model</div>
          <div className="section-desc">
            A platform built for — and by — people. Governed democratically under Govt of India bylaws.
          </div>
        </div>
      </div>

      <div className="section-inner">
        <div className="coop-grid">
          <div>
            <div className="principles-list">
              {principles.map(p => (
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
              <div className="coop-percent-label">of every payment goes directly to the worker</div>
            </div>
            {[
              { icon: "🏛️", iconClass: "icon-saffron", title: "Ministry of Cooperation", desc: "Registered & backed by Govt. of India" },
              { icon: "🛡️", iconClass: "icon-green", title: "Worker Welfare Fund", desc: "Health insurance & pension for members" },
              { icon: "🎓", iconClass: "icon-blue", title: "Free Skill Upgradation", desc: "Government-sponsored training modules" },
              { icon: "📊", iconClass: "icon-purple", title: "Transparent Governance", desc: "Open books, quarterly member meetings" },
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

        {/* Voting module */}
        <div style={{ marginTop: "4rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Democratic Governance</div>
            <div className="section-title">Active Member Proposals</div>
            <div className="section-desc" style={{ margin: "0 auto" }}>One member, one vote — no corporate override.</div>
          </div>
          <div className="votes-grid">
            {votes.map(v => (
              <div className={`vote-card${v.status === "passed" ? " passed" : ""}`} key={v.id}>
                <div className="vote-status-chip">
                  {v.status === "passed" ? "✅ Passed" : `🗳️ ${v.ends}`}
                </div>
                <div className="vote-title">{v.title}</div>
                <div className="vote-desc">{v.desc}</div>
                <div className="vote-bars">
                  <div className="vote-bar-row">
                    <span className="vote-bar-label">Yes — {v.yes}%</span>
                    <div className="vote-bar-track"><div className="vote-bar-yes" style={{ width: `${v.yes}%` }} /></div>
                  </div>
                  <div className="vote-bar-row">
                    <span className="vote-bar-label">No — {v.no}%</span>
                    <div className="vote-bar-track"><div className="vote-bar-no" style={{ width: `${v.no}%` }} /></div>
                  </div>
                </div>
                {v.status === "active" && !v.myVote && (
                  <div className="vote-actions">
                    <button className="vote-btn vote-yes" onClick={() => handleVote(v.id, "yes")}>👍 Vote Yes</button>
                    <button className="vote-btn vote-no" onClick={() => handleVote(v.id, "no")}>👎 Vote No</button>
                  </div>
                )}
                {v.myVote && <div className="vote-thankyou">✅ Your vote has been recorded — thank you!</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
