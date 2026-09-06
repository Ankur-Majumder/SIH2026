import React from "react";

export function LabourIdCardModal({ card, onClose }) {
  if (!card) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "540px" }}>
        <div className="india-bar" />

        <div className="modal-header" style={{ padding: "1.25rem 1.5rem" }}>
          <div>
            <div className="modal-title" style={{ fontSize: "1.1rem" }}>National Labour Identity Card</div>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>DigiLocker Verified · Ministry of Cooperation</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ padding: "1.5rem", textAlign: "center" }}>
          {/* Card Component */}
          <div
            className="labour-id-card"
            style={{
              background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
              borderRadius: "16px",
              padding: "1.5rem",
              color: "#ffffff",
              textAlign: "left",
              boxShadow: "0 12px 30px rgba(6, 78, 59, 0.3)",
              position: "relative",
              overflow: "hidden",
              border: "2px solid #34d399",
            }}
          >
            {/* Background watermark */}
            <div style={{ position: "absolute", right: -20, bottom: -20, opacity: 0.08, fontSize: "12rem", fontWeight: 900, pointerEvents: "none" }}>
              स
            </div>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
              <div>
                <div style={{ fontSize: "0.68rem", letterSpacing: "1px", color: "#a7f3d0", fontWeight: 700 }}>
                  GOVERNMENT OF INDIA · MINISTRY OF COOPERATION
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: 900, letterSpacing: "0.5px" }}>
                  SAHAYOGSEVA LABOUR IDENTITY CARD
                </div>
              </div>
              <div style={{ background: "#ffffff", color: "#065f46", padding: "4px 8px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 900 }}>
                DIGILOCKER VERIFIED
              </div>
            </div>

            {/* Body */}
            <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
              <div style={{ width: 78, height: 90, borderRadius: "10px", background: "#ffffff", border: "2px solid #a7f3d0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#065f46", fontWeight: 800, flexShrink: 0 }}>
                <span style={{ fontSize: "2.3rem" }}>{card.tradeEmoji || "🛠️"}</span>
                <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#065f46" }}>VERIFIED</span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#ffffff" }}>
                  {card.fullName || "Rajesh Kumar"}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#fef08a", fontWeight: 700 }}>
                  {card.trade || "Master Plumber"} · Grade A Member
                </div>
                <div style={{ fontSize: "0.75rem", color: "#d1fae5", marginTop: "4px" }}>
                  Reg No: <strong style={{ color: "#ffffff", fontFamily: "monospace" }}>{card.regNo || "SS-MSCS-2026-LAB-84920"}</strong>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#d1fae5" }}>
                  Aadhaar: <span style={{ fontFamily: "monospace" }}>{card.aadhaarMasked || "XXXX XXXX 8421"}</span>
                </div>
                <div style={{ fontSize: "0.72rem", color: "#a7f3d0" }}>
                  e-Shram: <span style={{ fontFamily: "monospace" }}>{card.eshramNumber || "UAN-9921-4821-0021"}</span>
                </div>
              </div>

              <div style={{ width: 68, height: 68, background: "#ffffff", borderRadius: "8px", padding: "4px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ fontSize: "2rem" }}>🏁</div>
                <span style={{ fontSize: "0.55rem", color: "#0f172a", fontWeight: 800 }}>SCAN KYC</span>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", color: "#a7f3d0" }}>
              <div>📍 Chapter: {card.district || "Karol Bagh, Delhi"}</div>
              <div>Valid: {card.validTill || "31/12/2031"}</div>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: "1rem 1.5rem", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
          <button className="btn btn-outline" onClick={() => alert(`Labour Card ${card.regNo || "ID"} saved to your device!`)}>
            📥 Download Card (PDF)
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
