import React, { useState, useEffect } from "react";

export function PaymentGatewayModal({ provider, bookingDetails, onClose, onPaymentSuccess }) {
  const [method, setMethod] = useState("upi"); // upi | card | netbanking | escrow | cash
  const [upiMode, setUpiMode] = useState("qr"); // qr | id | app
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
  const taxGst = 0; // Co-op 0% exemption
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

  const handleInitiatePayment = () => {
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
      completeTransaction();
    }, 2200);
  };

  const completeTransaction = () => {
    const txn = {
      txnId: `TXN_SS_${new Date().getFullYear()}_${Math.floor(10000000 + Math.random() * 90000000)}`,
      rrn: `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "medium" }),
      amount: totalPayable,
      workerShare: workerShare,
      coopFee: coopWelfareFee,
      providerName: provider?.name || "Rajesh Kumar",
      providerRole: provider?.role || "Master Plumber",
      paymentMethod:
        method === "upi"
          ? `UPI (${upiMode.toUpperCase()})`
          : method === "card"
          ? "RuPay / Visa Debit Card"
          : method === "netbanking"
          ? `Net Banking (${selectedBank.toUpperCase()})`
          : method === "escrow"
          ? "Sahayog Escrow Wallet"
          : "Cash on Delivery",
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "720px" }}>
        <div className="india-bar" />

        {/* Modal Header */}
        <div className="modal-header" style={{ padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "8px", background: "#0c831f", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.2rem" }}>
              💳
            </div>
            <div>
              <div className="modal-title" style={{ fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                SahayogSeva Bharat Payment Gateway
                <span style={{ fontSize: "0.65rem", padding: "2px 8px", background: "#f0fdf4", color: "#166534", borderRadius: "100px", fontWeight: 800, border: "1px solid #bbf7d0" }}>
                  🔒 100% Escrow Protected
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Govt. Backed Multi-State Co-operative Settlement Engine · NPCI / RBI Compliant
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Modal Content */}
        <div className="modal-body" style={{ maxHeight: "72vh", overflowY: "auto", padding: "1.5rem" }}>
          {/* STATE: PAYMENT PROCESSING */}
          {paymentState === "processing" && (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <div className="payment-spinner" style={{ width: 56, height: 56, border: "4px solid #e2e8f0", borderTopColor: "#0c831f", borderRadius: "50%", margin: "0 auto 1.5rem", animation: "spin 1s linear infinite" }} />
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
                Contacting Payment Gateway & Bank...
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#64748b", maxWidth: "380px", margin: "0 auto" }}>
                Please do not refresh or press back. Allocating 92% directly to provider's cooperative escrow account.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem", padding: "6px 14px", background: "#f8fafc", borderRadius: "100px", border: "1px solid #e2e8f0", fontSize: "0.75rem", color: "#475569" }}>
                🔒 256-Bit SSL Encrypted by Bharat Payment Network
              </div>
            </div>
          )}

          {/* STATE: 3D SECURE CARD OTP VERIFICATION */}
          {paymentState === "3dsecure" && (
            <div style={{ maxWidth: "440px", margin: "0 auto", textAlign: "center", padding: "1rem 0" }}>
              <div style={{ padding: "0.75rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, color: "#1e3a8a", fontSize: "0.95rem" }}>🏛️ RuPay 3D Secure / Verified by Visa</span>
                <span style={{ fontWeight: 800, color: "#0c831f", fontSize: "1rem" }}>₹{totalPayable}</span>
              </div>

              <div style={{ fontSize: "0.85rem", color: "#475569", marginBottom: "1.25rem" }}>
                Enter the 6-digit OTP sent to your registered mobile number for card ending in{" "}
                <strong>{cardData.number.slice(-4) || "8821"}</strong>
              </div>

              <div className="form-group">
                <input
                  type="password"
                  maxLength="6"
                  className="form-input"
                  placeholder="Enter 6-digit Bank OTP"
                  value={cardOtp}
                  onChange={(e) => setCardOtp(e.target.value)}
                  style={{ textAlign: "center", fontSize: "1.3rem", letterSpacing: "6px", fontWeight: 800 }}
                />
              </div>

              <div style={{ padding: "0.6rem", background: "#fef3c7", borderRadius: "8px", fontSize: "0.75rem", color: "#92400e", marginBottom: "1.5rem" }}>
                💡 <strong>Demo Test:</strong> Enter any 6 digits (e.g., 123456) to approve payment.
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setPaymentState("input")}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 2, justifyContent: "center" }}
                  onClick={() => {
                    setPaymentState("processing");
                    setTimeout(() => completeTransaction(), 1800);
                  }}
                >
                  Authorize Payment (₹{totalPayable}) →
                </button>
              </div>
            </div>
          )}

          {/* STATE: SUCCESS SCREEN */}
          {paymentState === "success" && txnResult && (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#0c831f", color: "#fff", fontSize: "2rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", boxShadow: "0 8px 20px rgba(12, 131, 31, 0.3)" }}>
                ✓
              </div>

              <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#0f172a", marginBottom: "0.25rem" }}>
                Payment Successful!
              </div>
              <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.25rem" }}>
                Transaction ID: <strong style={{ color: "#0f172a", fontFamily: "monospace" }}>{txnResult.txnId}</strong>
              </div>

              {/* Receipt Summary Card */}
              <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem", textAlign: "left", maxWidth: "480px", margin: "0 auto 1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed #cbd5e1", paddingBottom: "0.75rem", marginBottom: "0.75rem" }}>
                  <div>
                    <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem" }}>{txnResult.providerName}</div>
                    <div style={{ fontSize: "0.75rem", color: "#0c831f", fontWeight: 700 }}>{txnResult.providerRole}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#0c831f" }}>₹{txnResult.amount}</div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Paid via {txnResult.paymentMethod}</div>
                  </div>
                </div>

                {/* Cooperative 92/8 Split Transparency */}
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "0.85rem", fontSize: "0.78rem", color: "#166534" }}>
                  <div style={{ fontWeight: 800, marginBottom: "0.4rem", display: "flex", justifyContent: "space-between" }}>
                    <span>🤝 Cooperative Transparency Split</span>
                    <span>100% Accounted</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                    <span>Worker Payout (92% direct to bank):</span>
                    <strong style={{ color: "#0c831f" }}>₹{txnResult.workerShare}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                    <span>Co-op Welfare & Healthcare Fund (8%):</span>
                    <strong>₹{txnResult.coopFee}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Platform Commission / Middleman Cut:</span>
                    <strong style={{ color: "#0c831f" }}>₹0.00 (Zero)</strong>
                  </div>
                </div>

                <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "#64748b", display: "flex", justifyContent: "space-between" }}>
                  <span>Scheduled Time: {txnResult.slot}</span>
                  <span>RRN: {txnResult.rrn}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                <button
                  className="btn btn-outline"
                  onClick={() => alert(`Receipt #${txnResult.txnId} downloaded successfully!`)}
                  style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                >
                  🧾 Download Tax Invoice
                </button>
                <button
                  className="btn btn-primary"
                  onClick={onClose}
                  style={{ padding: "8px 20px", fontSize: "0.85rem" }}
                >
                  Done ✓
                </button>
              </div>
            </div>
          )}

          {/* STATE: INITIAL PAYMENT METHOD INPUT */}
          {paymentState === "input" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Left Column: Payment Method Selection */}
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.75rem" }}>
                  Select Payment Method
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    { id: "upi", icon: "⚡", title: "UPI (Google Pay, PhonePe, Paytm)", sub: "Instant · Zero transaction fee", badge: "FASTEST" },
                    { id: "card", icon: "💳", title: "Credit / Debit Card", sub: "RuPay, Visa, Mastercard", badge: null },
                    { id: "netbanking", icon: "🏛️", title: "Net Banking", sub: "SBI, HDFC, ICICI, PNB & 50+ Banks", badge: null },
                    { id: "escrow", icon: "🛡️", title: "Sahayog Co-op Protected Escrow", sub: "Release funds only after service completion", badge: "SAFE" },
                    { id: "cash", icon: "💵", title: "Cash after Service", sub: "Pay cash directly to verified worker", badge: null },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: `1.5px solid ${method === m.id ? "#0c831f" : "#e2e8f0"}`,
                        background: method === m.id ? "#f0fdf4" : "#ffffff",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span style={{ fontSize: "1.3rem" }}>{m.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: method === m.id ? "#166534" : "#0f172a" }}>
                          {m.title}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#64748b" }}>{m.sub}</div>
                      </div>
                      {m.badge && (
                        <span style={{ fontSize: "0.6rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px", background: method === m.id ? "#0c831f" : "#e2e8f0", color: method === m.id ? "#fff" : "#475569" }}>
                          {m.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Interactive Details based on selected method */}
              <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                {/* METHOD: UPI */}
                {method === "upi" && (
                  <div>
                    <div className="tabs" style={{ width: "100%", marginBottom: "1rem" }}>
                      <button className={`tab ${upiMode === "qr" ? "active" : ""}`} style={{ flex: 1, fontSize: "0.75rem", padding: "6px" }} onClick={() => setUpiMode("qr")}>
                        📷 Scan QR Code
                      </button>
                      <button className={`tab ${upiMode === "id" ? "active" : ""}`} style={{ flex: 1, fontSize: "0.75rem", padding: "6px" }} onClick={() => setUpiMode("id")}>
                        🪪 UPI ID
                      </button>
                    </div>

                    {upiMode === "qr" && (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ width: 140, height: 140, background: "#ffffff", border: "2px solid #0c831f", borderRadius: "12px", margin: "0 auto 0.75rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: "8px" }}>
                          <div style={{ fontSize: "4.5rem", lineHeight: 1 }}>🏁</div>
                          <div style={{ position: "absolute", bottom: 4, fontSize: "0.6rem", fontWeight: 800, color: "#0c831f" }}>
                            BHARAT QR · ₹{totalPayable}
                          </div>
                        </div>

                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>
                          Scan using GPay, PhonePe, Paytm, or BHIM
                        </div>

                        <div style={{ fontSize: "0.75rem", color: "#dc2626", fontWeight: 700, marginBottom: "0.75rem" }}>
                          ⏱️ QR expires in: {formatTimer(qrTimer)}
                        </div>

                        <button
                          className="btn btn-primary"
                          style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem", padding: "10px" }}
                          onClick={handleInitiatePayment}
                        >
                          Simulate App Payment (₹{totalPayable}) →
                        </button>
                      </div>
                    )}

                    {upiMode === "id" && (
                      <div>
                        <div className="form-group">
                          <label className="form-label" style={{ fontSize: "0.78rem" }}>Enter Virtual Payment Address (UPI ID)</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. yourname@okhdfcbank"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                          />
                        </div>

                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                          {["@okaxis", "@okhdfcbank", "@paytm", "@ibl", "@ybl"].map((handle) => (
                            <button
                              key={handle}
                              onClick={() => setUpiId((prev) => (prev ? prev.split("@")[0] + handle : "user" + handle))}
                              style={{ padding: "4px 8px", background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "0.72rem", cursor: "pointer" }}
                            >
                              {handle}
                            </button>
                          ))}
                        </div>

                        <button
                          className="btn btn-primary"
                          style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem", padding: "10px" }}
                          onClick={handleInitiatePayment}
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
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: "0.78rem" }}>Card Number</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="4532  8921  0031  9281"
                        value={cardData.number}
                        onChange={(e) => formatCardNumber(e.target.value)}
                        style={{ fontSize: "0.95rem", letterSpacing: "1px" }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: "0.78rem" }}>Cardholder Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Ananya Singh"
                        value={cardData.name}
                        onChange={(e) => setCardData((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: "0.78rem" }}>Expiry (MM/YY)</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="MM/YY"
                          value={cardData.expiry}
                          onChange={(e) => formatExpiry(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: "0.78rem" }}>CVV</label>
                        <input
                          type="password"
                          maxLength="3"
                          className="form-input"
                          placeholder="•••"
                          value={cardData.cvv}
                          onChange={(e) => setCardData((prev) => ({ ...prev, cvv: e.target.value }))}
                        />
                      </div>
                    </div>

                    <button
                      className="btn btn-primary"
                      style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem", padding: "10px", marginTop: "0.5rem" }}
                      onClick={handleInitiatePayment}
                    >
                      Pay Securely ₹{totalPayable} →
                    </button>
                  </div>
                )}

                {/* METHOD: NET BANKING */}
                {method === "netbanking" && (
                  <div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: "0.78rem" }}>Select Your Bank</label>
                      <select
                        className="form-input form-select"
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                      >
                        <option value="sbi">State Bank of India (SBI)</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="pnb">Punjab National Bank (PNB)</option>
                        <option value="bob">Bank of Baroda</option>
                        <option value="axis">Axis Bank</option>
                        <option value="canara">Canara Bank</option>
                        <option value="union">Union Bank of India</option>
                      </select>
                    </div>

                    <div style={{ padding: "0.75rem", background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "0.75rem", color: "#475569", marginBottom: "1rem" }}>
                      You will be redirected to {selectedBank.toUpperCase()} secure portal to authenticate your transaction.
                    </div>

                    <button
                      className="btn btn-primary"
                      style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem", padding: "10px" }}
                      onClick={handleInitiatePayment}
                    >
                      Proceed to Bank Portal →
                    </button>
                  </div>
                )}

                {/* METHOD: ESCROW */}
                {method === "escrow" && (
                  <div>
                    <div style={{ padding: "0.85rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", marginBottom: "1rem", fontSize: "0.78rem", color: "#166534" }}>
                      🛡️ <strong>Cooperative Escrow Guarantee:</strong> Your payment of ₹{totalPayable} is locked in the society's escrow smart account. The worker is paid only when you share the completion 4-digit PIN upon satisfied service.
                    </div>

                    <button
                      className="btn btn-primary"
                      style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem", padding: "10px" }}
                      onClick={handleInitiatePayment}
                    >
                      Deposit in Escrow & Confirm Booking →
                    </button>
                  </div>
                )}

                {/* METHOD: CASH */}
                {method === "cash" && (
                  <div>
                    <div style={{ padding: "0.85rem", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", marginBottom: "1rem", fontSize: "0.78rem", color: "#1e3a8a" }}>
                      💵 <strong>Direct Cash Settlement:</strong> Hand over ₹{totalPayable} in cash directly to {provider?.name || "the worker"} upon job completion. No advance payment required.
                    </div>

                    <button
                      className="btn btn-primary"
                      style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem", padding: "10px" }}
                      onClick={handleInitiatePayment}
                    >
                      Confirm Booking with Cash on Delivery →
                    </button>
                  </div>
                )}

                {/* Bill Breakdown Summary */}
                <div style={{ marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px dashed #cbd5e1", fontSize: "0.76rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", color: "#475569" }}>
                    <span>Worker Share (92%):</span>
                    <strong style={{ color: "#0c831f" }}>₹{workerShare}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px", color: "#475569" }}>
                    <span>Co-op Welfare Fee (8%):</span>
                    <span>₹{coopWelfareFee}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, color: "#0f172a", fontSize: "0.85rem", marginTop: "4px" }}>
                    <span>Total Amount:</span>
                    <span style={{ color: "#0c831f" }}>₹{totalPayable}</span>
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
