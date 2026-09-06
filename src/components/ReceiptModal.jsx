import React from "react";

export function ReceiptModal({ txn, onClose }) {
  if (!txn) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "560px" }}>
        <div className="india-bar" />

        <div className="modal-header" style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e2e8f0" }}>
          <div>
            <div className="modal-title" style={{ fontSize: "1.1rem" }}>Cooperative Payment Receipt</div>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Ministry of Cooperation · Multi-State Cooperative Society</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ padding: "1.5rem" }}>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", fontFamily: "inherit" }}>
            {/* Header with National Emblem */}
            <div style={{ textAlign: "center", borderBottom: "2px solid #0c831f", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "1.3rem" }}>🏛️</div>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px", color: "#64748b" }}>
                GOVERNMENT OF INDIA · MINISTRY OF COOPERATION
              </div>
              <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#0f172a" }}>
                SAHAYOGSEVA COOPERATIVE PLATFORM
              </div>
              <div style={{ fontSize: "0.75rem", color: "#0c831f", fontWeight: 700 }}>
                OFFICIAL SERVICE INVOICE & CO-OP SETTLEMENT RECEIPT
              </div>
            </div>

            {/* Receipt Metadata */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.78rem", marginBottom: "1rem" }}>
              <div>
                <span style={{ color: "#64748b" }}>Receipt No:</span>
                <div style={{ fontWeight: 800, color: "#0f172a", fontFamily: "monospace" }}>{txn.txnId}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#64748b" }}>Date & Time:</span>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>{txn.timestamp}</div>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>Customer:</span>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>Ananya Singh (Member)</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ color: "#64748b" }}>Payment Mode:</span>
                <div style={{ fontWeight: 700, color: "#0c831f" }}>{txn.paymentMethod}</div>
              </div>
            </div>

            {/* Itemized Table */}
            <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden", marginBottom: "1rem", fontSize: "0.8rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", background: "#f1f5f9", padding: "8px 12px", fontWeight: 800, color: "#1e293b" }}>
                <span>Service Description</span>
                <span style={{ textAlign: "right" }}>Amount</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", padding: "10px 12px", borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>{txn.providerRole} Service</div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>Provided by: {txn.providerName} (Co-op Member)</div>
                </div>
                <div style={{ textAlign: "right", fontWeight: 700 }}>₹{txn.amount}</div>
              </div>
            </div>

            {/* Cooperative Split Transparency */}
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "0.85rem", fontSize: "0.78rem", color: "#166534", marginBottom: "1rem" }}>
              <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>🤝 Cooperative Settlement Breakdown:</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span>92% Directly Credited to Worker Bank:</span>
                <strong>₹{txn.workerShare}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span>8% Member Welfare & Healthcare Pool:</span>
                <strong>₹{txn.coopFee}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #86efac", paddingTop: "4px", marginTop: "4px", fontWeight: 800, fontSize: "0.85rem" }}>
                <span>Total Paid:</span>
                <span style={{ color: "#0c831f" }}>₹{txn.amount}</span>
              </div>
            </div>

            {/* Footer with Verification Note */}
            <div style={{ textAlign: "center", fontSize: "0.7rem", color: "#64748b", borderTop: "1px solid #e2e8f0", paddingTop: "0.75rem" }}>
              Registered under Multi-State Cooperative Societies Act, 2002 · GST Exempt for Primary Member Services.
              <br />
              <strong style={{ color: "#0c831f" }}>Thank you for empowering local workers through cooperative ownership!</strong>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: "1rem 1.5rem", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
          <button className="btn btn-outline" onClick={() => window.print()}>
            🖨️ Print Receipt
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
