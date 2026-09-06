import React, { useState, useEffect } from "react";

export function PaymentGatewayModal({ provider, bookingDetails, onClose, onPaymentSuccess }) {
  const [method, setMethod] = useState("upi"); // upi | card | netbanking | escrow | cash
  const [upiMode, setUpiMode] = useState("app"); // app | qr | id
  const [upiId, setUpiId] = useState("");
  const [qrTimer, setQrTimer] = useState(300); // 5 minutes countdown
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [selectedBank, setSelectedBank] = useState("sbi");
  const [paymentState, setPaymentState] = useState("input"); // input | processing | 3dsecure | success | error
  const [cardOtp, setCardOtp] = useState("");
  const [txnResult, setTxnResult] = useState(null);

  // Price calculations based on provider or booking details
  const priceRaw = parseInt(provider?.price?.replace(/\D/g, "") || "400", 10);
  const baseAmount = priceRaw;
  const workerShare = Math.round(baseAmount * 0.92);
  const coopWelfareFee = baseAmount - workerShare;
  const totalPayable = baseAmount;

  // QR Code timer countdown
  useEffect(() => {
    let interval;
    if (paymentState === "input" && method === "upi" && upiMode === "qr" && qrTimer > 0) {
      interval = setInterval(() => setQrTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [paymentState, method, upiMode, qrTimer]);

  const formatCardNumber = (val) => {
    const raw = val.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardData((prev) => ({ ...prev, number: formatted }));
  };

  const formatExpiry = (val) => {
    const raw = val.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      setCardData((prev) => ({ ...prev, expiry: `${raw.slice(0, 2)}/${raw.slice(2)}` }));
    } else {
      setCardData((prev) => ({ ...prev, expiry: raw }));
    }
  };

  const handleInitiatePayment = (customMethodName) => {
    if (method === "card") {
      if (!cardData.number || cardData.number.replace(/\s/g, "").length < 15) {
        alert("Please enter a valid 16-digit card number.");
        return;
      }
      setPaymentState("3dsecure");
      return;
    }

    if (method === "upi" && upiMode === "id") {
      if (!upiId || !upiId.includes("@")) {
        alert("Please enter a valid UPI ID (e.g., yourname@okhdfcbank).");
        return;
      }
    }

    // Process payment
    setPaymentState("processing");
    setTimeout(() => {
      completeTransaction(customMethodName);
    }, 2000);
  };

  const completeTransaction = (customMethodName) => {
    const chosenMethod =
      customMethodName ||
      (method === "upi"
        ? `UPI (${upiMode === "app" ? "Direct App" : upiMode.toUpperCase()})`
        : method === "card"
        ? "RuPay / Visa Debit Card"
        : method === "netbanking"
        ? `Net Banking (${selectedBank.toUpperCase()})`
        : method === "escrow"
        ? "Sahayog Escrow Wallet"
        : "Cash on Delivery");

    const txn = {
      txnId: `TXN_SS_${new Date().getFullYear()}_${Math.floor(10000000 + Math.random() * 90000000)}`,
      rrn: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "medium" }),
      amount: totalPayable,
      workerShare: workerShare,
      coopFee: coopWelfareFee,
      providerName: provider?.name || "Rajesh Kumar",
      providerRole: provider?.role || "Master Plumber",
      paymentMethod: chosenMethod,
      status: "SUCCESS",
      slot: bookingDetails?.slot || "Today · 4:00 PM",
      address: bookingDetails?.address || "Karol Bagh, New Delhi",
    };

    setTxnResult(txn);
    setPaymentState("success");
    if (onPaymentSuccess) {
      onPaymentSuccess(txn);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const paymentMethods = [
    { id: "upi", icon: "⚡", title: "UPI & Apps", fullTitle: "UPI (Google Pay, PhonePe, Paytm)", sub: "Instant · 0 Fee", badge: "FASTEST" },
    { id: "card", icon: "💳", title: "Cards", fullTitle: "Credit / Debit Card", sub: "RuPay, Visa, Master", badge: null },
    { id: "netbanking", icon: "🏛️", title: "Net Banking", fullTitle: "Net Banking", sub: "SBI, HDFC, ICICI + 50", badge: null },
    { id: "escrow", icon: "🛡️", title: "Escrow", fullTitle: "Co-op Escrow Guarantee", sub: "Release after job", badge: "SAFE" },
    { id: "cash", icon: "💵", title: "Cash", fullTitle: "Cash on Delivery", sub: "Pay to worker", badge: null },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="india-bar" />

        {/* Header */}
        <div className="payment-modal-header">
          <div className="payment-modal-title-wrap">
            <div className="payment-modal-icon">💳</div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                className="payment-modal-title"
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  flexWrap: "wrap",
                }}
              >
                <span>Bharat Payment Gateway</span>
                <span
                  style={{
                    fontSize: "0.62rem",
                    padding: "2px 6px",
                    background: "#f0fdf4",
                    color: "#166534",
                    borderRadius: "100px",
                    fontWeight: 800,
                    border: "1px solid #bbf7d0",
                    whiteSpace: "nowrap",
                  }}
                >
                  🔒 100% Escrow
                </span>
              </div>
              <div className="payment-modal-sub" style={{ fontSize: "0.72rem", color: "#64748b" }}>
                Govt-Backed Co-op Settlement Engine · NPCI / RBI Compliant
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose} style={{ flexShrink: 0 }}>
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="payment-modal-body">
          {/* STATE: PAYMENT PROCESSING */}
          {paymentState === "processing" && (
            <div style={{ textAlign: "center", padding: "2.5rem 0.5rem" }}>
              <div
                className="payment-spinner"
                style={{
                  width: 52,
                  height: 52,
                  border: "4px solid #e2e8f0",
                  borderTopColor: "#0c831f",
                  borderRadius: "50%",
                  margin: "0 auto 1.25rem",
                  animation: "spin 1s linear infinite",
                }}
              />
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.4rem" }}>
                Connecting to Secure Gateway...
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#64748b", maxWidth: "340px", margin: "0 auto" }}>
                Please do not refresh or tap back. Locking ₹{totalPayable} directly into provider's co-operative escrow.
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  marginTop: "1.25rem",
                  padding: "5px 12px",
                  background: "#f8fafc",
                  borderRadius: "100px",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.72rem",
                  color: "#475569",
                }}
              >
                🔒 256-Bit SSL Encrypted by NPCI Bharat Pay
              </div>
            </div>
          )}

          {/* STATE: 3D SECURE OTP */}
          {paymentState === "3dsecure" && (
            <div style={{ maxWidth: "420px", margin: "0 auto", textAlign: "center", padding: "0.5rem 0" }}>
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  marginBottom: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 800, color: "#1e3a8a", fontSize: "0.88rem" }}>
                  🏛️ RuPay 3D Secure / Verified by Visa
                </span>
                <span style={{ fontWeight: 800, color: "#0c831f", fontSize: "1rem" }}>₹{totalPayable}</span>
              </div>

              <div style={{ fontSize: "0.82rem", color: "#475569", marginBottom: "1rem", lineHeight: 1.4 }}>
                Enter the 6-digit OTP sent to registered mobile for card ending in{" "}
                <strong>{cardData.number.slice(-4) || "8821"}</strong>
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <input
                  type="password"
                  maxLength="6"
                  className="form-input"
                  placeholder="• • • • • •"
                  value={cardOtp}
                  onChange={(e) => setCardOtp(e.target.value)}
                  style={{
                    textAlign: "center",
                    fontSize: "1.3rem",
                    letterSpacing: "8px",
                    fontWeight: 800,
                    padding: "10px",
                  }}
                />
              </div>

              <div
                style={{
                  padding: "0.55rem 0.75rem",
                  background: "#fef3c7",
                  borderRadius: "8px",
                  fontSize: "0.73rem",
                  color: "#92400e",
                  marginBottom: "1.25rem",
                }}
              >
                💡 <strong>Demo Test:</strong> Enter any 6 digits (e.g., 123456) to approve payment.
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn btn-ghost" style={{ flex: 1, padding: "8px" }} onClick={() => setPaymentState("input")}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 2, justifyContent: "center", padding: "10px" }}
                  onClick={() => {
                    setPaymentState("processing");
                    setTimeout(() => completeTransaction(), 1600);
                  }}
                >
                  Authorize ₹{totalPayable} →
                </button>
              </div>
            </div>
          )}

          {/* STATE: SUCCESS */}
          {paymentState === "success" && txnResult && (
            <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#0c831f",
                  color: "#fff",
                  fontSize: "1.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 0.75rem",
                  boxShadow: "0 6px 18px rgba(12, 131, 31, 0.3)",
                }}
              >
                ✓
              </div>

              <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a", marginBottom: "0.2rem" }}>
                Payment Successful!
              </div>
              <div style={{ fontSize: "0.78rem", color: "#64748b", marginBottom: "1rem" }}>
                Txn ID: <strong style={{ color: "#0f172a", fontFamily: "monospace" }}>{txnResult.txnId}</strong>
              </div>

              {/* Receipt Summary Card */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "1rem",
                  textAlign: "left",
                  maxWidth: "460px",
                  margin: "0 auto 1.25rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px dashed #cbd5e1",
                    paddingBottom: "0.6rem",
                    marginBottom: "0.6rem",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>{txnResult.providerName}</div>
                    <div style={{ fontSize: "0.72rem", color: "#0c831f", fontWeight: 700 }}>{txnResult.providerRole}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#0c831f" }}>₹{txnResult.amount}</div>
                    <div style={{ fontSize: "0.68rem", color: "#64748b" }}>{txnResult.paymentMethod}</div>
                  </div>
                </div>

                {/* Cooperative 92/8 Split Transparency */}
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    fontSize: "0.75rem",
                    color: "#166534",
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: "0.35rem", display: "flex", justifyContent: "space-between" }}>
                    <span>🤝 Cooperative Transparency Split</span>
                    <span>100% Accounted</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                    <span>Worker Payout (92% direct):</span>
                    <strong style={{ color: "#0c831f" }}>₹{txnResult.workerShare}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                    <span>Co-op Welfare Fund (8%):</span>
                    <strong>₹{txnResult.coopFee}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Platform Commission / Middleman:</span>
                    <strong style={{ color: "#0c831f" }}>₹0.00 (Zero)</strong>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "0.65rem",
                    fontSize: "0.72rem",
                    color: "#64748b",
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "4px",
                  }}
                >
                  <span>Scheduled: {txnResult.slot}</span>
                  <span>RRN: {txnResult.rrn}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  className="btn btn-outline"
                  onClick={() => alert(`Receipt #${txnResult.txnId} downloaded successfully!`)}
                  style={{ padding: "8px 14px", fontSize: "0.8rem", flex: 1, minWidth: "140px", justifyContent: "center" }}
                >
                  🧾 Tax Invoice
                </button>
                <button
                  className="btn btn-primary"
                  onClick={onClose}
                  style={{ padding: "8px 18px", fontSize: "0.8rem", flex: 1, minWidth: "120px", justifyContent: "center" }}
                >
                  Done ✓
                </button>
              </div>
            </div>
          )}

          {/* STATE: INITIAL PAYMENT INPUT */}
          {paymentState === "input" && (
            <div>
              {/* Top Summary Banner */}
              <div className="payment-summary-banner">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>👤</span>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0f172a" }}>
                      {provider?.name || "Verified Cooperative Professional"}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#15803d", fontWeight: 700 }}>
                      {provider?.role || "Service"} · {bookingDetails?.slot || "Today"}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#0c831f" }}>
                    ₹{totalPayable}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#64748b" }}>Total Payable</div>
                </div>
              </div>

              {/* Mobile Horizontal Pill Selector */}
              <div className="payment-mobile-chips-wrapper">
                {paymentMethods.map((m) => (
                  <button
                    key={m.id}
                    className={`payment-mobile-chip ${method === m.id ? "active" : ""}`}
                    onClick={() => setMethod(m.id)}
                  >
                    <span>{m.icon}</span>
                    <span>{m.title}</span>
                    {m.badge && (
                      <span
                        style={{
                          fontSize: "0.58rem",
                          padding: "1px 4px",
                          borderRadius: "4px",
                          background: method === m.id ? "rgba(255,255,255,0.3)" : "#e2e8f0",
                          color: method === m.id ? "#fff" : "#475569",
                          fontWeight: 800,
                        }}
                      >
                        {m.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Main Responsive Grid (Desktop: 2 columns, Mobile: 1 column) */}
              <div className="payment-grid">
                {/* Desktop Left Column: Vertical Methods List */}
                <div className="payment-methods-list">
                  <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.4rem" }}>
                    Payment Mode
                  </div>
                  {paymentMethods.map((m) => (
                    <button
                      key={m.id}
                      className={`payment-method-item ${method === m.id ? "active" : ""}`}
                      onClick={() => setMethod(m.id)}
                    >
                      <span style={{ fontSize: "1.2rem" }}>{m.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            color: method === m.id ? "#166534" : "#0f172a",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {m.fullTitle}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "#64748b" }}>{m.sub}</div>
                      </div>
                      {m.badge && (
                        <span
                          style={{
                            fontSize: "0.58rem",
                            fontWeight: 800,
                            padding: "2px 5px",
                            borderRadius: "4px",
                            background: method === m.id ? "#0c831f" : "#e2e8f0",
                            color: method === m.id ? "#fff" : "#475569",
                          }}
                        >
                          {m.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Right / Full-width Column: Details Panel */}
                <div className="payment-details-card">
                  {/* METHOD: UPI */}
                  {method === "upi" && (
                    <div>
                      {/* Sub-tabs for UPI */}
                      <div className="tabs" style={{ width: "100%", marginBottom: "0.85rem" }}>
                        <button
                          className={`tab ${upiMode === "app" ? "active" : ""}`}
                          style={{ flex: 1, fontSize: "0.72rem", padding: "6px 2px", textAlign: "center" }}
                          onClick={() => setUpiMode("app")}
                        >
                          📱 UPI Apps
                        </button>
                        <button
                          className={`tab ${upiMode === "qr" ? "active" : ""}`}
                          style={{ flex: 1, fontSize: "0.72rem", padding: "6px 2px", textAlign: "center" }}
                          onClick={() => setUpiMode("qr")}
                        >
                          📷 Bharat QR
                        </button>
                        <button
                          className={`tab ${upiMode === "id" ? "active" : ""}`}
                          style={{ flex: 1, fontSize: "0.72rem", padding: "6px 2px", textAlign: "center" }}
                          onClick={() => setUpiMode("id")}
                        >
                          🪪 UPI ID
                        </button>
                      </div>

                      {/* UPI SUBMODE 1: 1-Tap UPI Apps (Recommended on Mobile) */}
                      {upiMode === "app" && (
                        <div>
                          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem", textAlign: "center" }}>
                            Select installed UPI app to pay ₹{totalPayable} instantly:
                          </div>

                          <div className="payment-upi-apps-grid">
                            {[
                              { name: "Google Pay", icon: "🟢", color: "#4285F4" },
                              { name: "PhonePe", icon: "🟣", color: "#5f259f" },
                              { name: "Paytm UPI", icon: "🔵", color: "#00b9f5" },
                              { name: "BHIM UPI", icon: "🇮🇳", color: "#005a9c" },
                              { name: "CRED Pay", icon: "⚫", color: "#000000" },
                              { name: "Amazon Pay", icon: "🟡", color: "#ff9900" },
                            ].map((app) => (
                              <button
                                key={app.name}
                                className="payment-upi-app-btn"
                                onClick={() => handleInitiatePayment(`UPI (${app.name})`)}
                              >
                                <span style={{ fontSize: "1.25rem" }}>{app.icon}</span>
                                <span>{app.name}</span>
                              </button>
                            ))}
                          </div>

                          <button
                            className="btn btn-primary"
                            style={{ width: "100%", justifyContent: "center", fontSize: "0.82rem", padding: "9px" }}
                            onClick={() => handleInitiatePayment("UPI Default App")}
                          >
                            ⚡ Pay ₹{totalPayable} via Default UPI App →
                          </button>
                        </div>
                      )}

                      {/* UPI SUBMODE 2: Bharat QR */}
                      {upiMode === "qr" && (
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              width: 130,
                              height: 130,
                              background: "#ffffff",
                              border: "2px solid #0c831f",
                              borderRadius: "12px",
                              margin: "0 auto 0.5rem",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                              padding: "6px",
                            }}
                          >
                            <div style={{ fontSize: "3.5rem", lineHeight: 1 }}>🏁</div>
                            <div
                              style={{
                                position: "absolute",
                                bottom: 3,
                                fontSize: "0.55rem",
                                fontWeight: 800,
                                color: "#0c831f",
                              }}
                            >
                              BHARAT QR · ₹{totalPayable}
                            </div>
                          </div>

                          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#475569", marginBottom: "0.25rem" }}>
                            Scan using GPay, PhonePe, Paytm, or BHIM
                          </div>

                          <div style={{ fontSize: "0.72rem", color: "#dc2626", fontWeight: 700, marginBottom: "0.6rem" }}>
                            ⏱️ QR expires in: {formatTimer(qrTimer)}
                          </div>

                          <button
                            className="btn btn-primary"
                            style={{ width: "100%", justifyContent: "center", fontSize: "0.82rem", padding: "9px" }}
                            onClick={() => handleInitiatePayment("Bharat QR")}
                          >
                            Simulate App Payment (₹{totalPayable}) →
                          </button>
                        </div>
                      )}

                      {/* UPI SUBMODE 3: UPI ID */}
                      {upiMode === "id" && (
                        <div>
                          <div className="form-group" style={{ marginBottom: "0.6rem" }}>
                            <label className="form-label" style={{ fontSize: "0.75rem" }}>
                              Enter UPI ID / VPA
                            </label>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="e.g. mobile@okhdfcbank"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              style={{ fontSize: "0.85rem", padding: "8px 10px" }}
                            />
                          </div>

                          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
                            {["@okaxis", "@okhdfcbank", "@paytm", "@ibl", "@ybl"].map((handle) => (
                              <button
                                key={handle}
                                onClick={() =>
                                  setUpiId((prev) => (prev ? prev.split("@")[0] + handle : "user" + handle))
                                }
                                style={{
                                  padding: "3px 7px",
                                  background: "#ffffff",
                                  border: "1px solid #cbd5e1",
                                  borderRadius: "6px",
                                  fontSize: "0.68rem",
                                  cursor: "pointer",
                                }}
                              >
                                {handle}
                              </button>
                            ))}
                          </div>

                          <button
                            className="btn btn-primary"
                            style={{ width: "100%", justifyContent: "center", fontSize: "0.82rem", padding: "9px" }}
                            onClick={() => handleInitiatePayment("UPI VPA")}
                          >
                            Verify & Pay ₹{totalPayable} →
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* METHOD: CARD */}
                  {method === "card" && (
                    <div>
                      <div className="form-group" style={{ marginBottom: "0.6rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <label className="form-label" style={{ fontSize: "0.75rem" }}>Card Number</label>
                          <span style={{ fontSize: "0.68rem", color: "#1e40af", fontWeight: 700 }}>RuPay / Visa / MC</span>
                        </div>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="4532  8921  0031  9281"
                          value={cardData.number}
                          onChange={(e) => formatCardNumber(e.target.value)}
                          style={{ fontSize: "0.88rem", letterSpacing: "1px", padding: "8px 10px" }}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: "0.6rem" }}>
                        <label className="form-label" style={{ fontSize: "0.75rem" }}>Cardholder Name</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Rajesh Sharma"
                          value={cardData.name}
                          onChange={(e) => setCardData((prev) => ({ ...prev, name: e.target.value }))}
                          style={{ fontSize: "0.85rem", padding: "8px 10px" }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.75rem" }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.75rem" }}>Expiry (MM/YY)</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="MM/YY"
                            value={cardData.expiry}
                            onChange={(e) => formatExpiry(e.target.value)}
                            style={{ fontSize: "0.85rem", padding: "8px 10px" }}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.75rem" }}>CVV</label>
                          <input
                            type="password"
                            maxLength="3"
                            className="form-input"
                            placeholder="•••"
                            value={cardData.cvv}
                            onChange={(e) => setCardData((prev) => ({ ...prev, cvv: e.target.value }))}
                            style={{ fontSize: "0.85rem", padding: "8px 10px" }}
                          />
                        </div>
                      </div>

                      <button
                        className="btn btn-primary"
                        style={{ width: "100%", justifyContent: "center", fontSize: "0.82rem", padding: "9px" }}
                        onClick={() => handleInitiatePayment("RuPay Card")}
                      >
                        Pay Securely ₹{totalPayable} →
                      </button>
                    </div>
                  )}

                  {/* METHOD: NET BANKING */}
                  {method === "netbanking" && (
                    <div>
                      <div className="form-group" style={{ marginBottom: "0.6rem" }}>
                        <label className="form-label" style={{ fontSize: "0.75rem" }}>Select Popular Bank</label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "0.5rem" }}>
                          {[
                            { id: "sbi", name: "SBI Bank" },
                            { id: "hdfc", name: "HDFC Bank" },
                            { id: "icici", name: "ICICI Bank" },
                            { id: "axis", name: "Axis Bank" },
                          ].map((b) => (
                            <button
                              key={b.id}
                              onClick={() => setSelectedBank(b.id)}
                              style={{
                                padding: "6px 8px",
                                background: selectedBank === b.id ? "#f0fdf4" : "#ffffff",
                                border: `1.5px solid ${selectedBank === b.id ? "#0c831f" : "#e2e8f0"}`,
                                borderRadius: "8px",
                                fontSize: "0.74rem",
                                fontWeight: 700,
                                color: selectedBank === b.id ? "#166534" : "#1e293b",
                                cursor: "pointer",
                                textAlign: "center",
                              }}
                            >
                              🏛️ {b.name}
                            </button>
                          ))}
                        </div>

                        <label className="form-label" style={{ fontSize: "0.72rem", marginTop: "0.4rem" }}>Or Other Banks (50+)</label>
                        <select
                          className="form-input form-select"
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          style={{ fontSize: "0.82rem", padding: "7px 10px" }}
                        >
                          <option value="sbi">State Bank of India (SBI)</option>
                          <option value="hdfc">HDFC Bank</option>
                          <option value="icici">ICICI Bank</option>
                          <option value="pnb">Punjab National Bank (PNB)</option>
                          <option value="bob">Bank of Baroda</option>
                          <option value="axis">Axis Bank</option>
                          <option value="canara">Canara Bank</option>
                          <option value="union">Union Bank of India</option>
                          <option value="kotak">Kotak Mahindra Bank</option>
                        </select>
                      </div>

                      <div
                        style={{
                          padding: "0.6rem",
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          fontSize: "0.72rem",
                          color: "#475569",
                          marginBottom: "0.85rem",
                        }}
                      >
                        You will authenticate securely on <strong>{selectedBank.toUpperCase()}</strong> internet banking portal.
                      </div>

                      <button
                        className="btn btn-primary"
                        style={{ width: "100%", justifyContent: "center", fontSize: "0.82rem", padding: "9px" }}
                        onClick={() => handleInitiatePayment(`Net Banking (${selectedBank})`)}
                      >
                        Proceed to Bank Portal →
                      </button>
                    </div>
                  )}

                  {/* METHOD: ESCROW */}
                  {method === "escrow" && (
                    <div>
                      <div
                        style={{
                          padding: "0.75rem",
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: "10px",
                          marginBottom: "0.85rem",
                          fontSize: "0.75rem",
                          color: "#166534",
                          lineHeight: 1.4,
                        }}
                      >
                        🛡️ <strong>Cooperative Escrow Guarantee:</strong> Your payment of ₹{totalPayable} is locked in the society's escrow smart account. The worker is paid only when you share the completion 4-digit PIN upon satisfied service.
                      </div>

                      <button
                        className="btn btn-primary"
                        style={{ width: "100%", justifyContent: "center", fontSize: "0.82rem", padding: "9px" }}
                        onClick={() => handleInitiatePayment("Sahayog Escrow")}
                      >
                        Deposit in Escrow & Confirm Booking →
                      </button>
                    </div>
                  )}

                  {/* METHOD: CASH */}
                  {method === "cash" && (
                    <div>
                      <div
                        style={{
                          padding: "0.75rem",
                          background: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          borderRadius: "10px",
                          marginBottom: "0.85rem",
                          fontSize: "0.75rem",
                          color: "#1e3a8a",
                          lineHeight: 1.4,
                        }}
                      >
                        💵 <strong>Direct Cash Settlement:</strong> Hand over ₹{totalPayable} in cash directly to {provider?.name || "the worker"} upon job completion. No advance payment required.
                      </div>

                      <button
                        className="btn btn-primary"
                        style={{ width: "100%", justifyContent: "center", fontSize: "0.82rem", padding: "9px" }}
                        onClick={() => handleInitiatePayment("Cash on Delivery")}
                      >
                        Confirm Booking with Cash →
                      </button>
                    </div>
                  )}

                  {/* Bill Breakdown Summary */}
                  <div
                    style={{
                      marginTop: "0.85rem",
                      paddingTop: "0.65rem",
                      borderTop: "1px dashed #cbd5e1",
                      fontSize: "0.74rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px", color: "#475569" }}>
                      <span>Worker Direct (92%):</span>
                      <strong style={{ color: "#0c831f" }}>₹{workerShare}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px", color: "#475569" }}>
                      <span>Co-op Welfare Fee (8%):</span>
                      <span>₹{coopWelfareFee}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: 800,
                        color: "#0f172a",
                        fontSize: "0.82rem",
                        marginTop: "3px",
                      }}
                    >
                      <span>Total Amount:</span>
                      <span style={{ color: "#0c831f" }}>₹{totalPayable}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
