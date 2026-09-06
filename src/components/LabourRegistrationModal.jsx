import React, { useState, useEffect } from "react";
import { SERVICES } from "../data/mockData";

export function LabourRegistrationModal({ onClose, onSuccess, initialRole = "provider" }) {
  const [step, setStep] = useState(1); // 1: Personal & Trade Info, 2: DigiLocker Auth, 3: Aadhaar OTP, 4: e-KYC Verified Profile, 5: Bank/Payout, 6: ID Card Generated
  const [tradeData, setTradeData] = useState({
    fullName: "",
    gender: "Male",
    mobile: "",
    dob: "",
    category: "plumber",
    experience: "5",
    hourlyRate: "350",
    district: "New Delhi",
    state: "Delhi NCR",
    eshramNumber: "",
    pincode: "110005",
    accountNumber: "",
    ifscCode: "SBIN0001234",
    upiId: "",
  });

  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [kycData, setKycData] = useState(null);
  const [labourIdCard, setLabourIdCard] = useState(null);

  useEffect(() => {
    let interval;
    if (step === 3 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleInputChange = (field, val) => {
    setTradeData((prev) => ({ ...prev, [field]: val }));
  };

  const formatAadhaar = (val) => {
    const raw = val.replace(/\D/g, "").slice(0, 12);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setAadhaarNumber(formatted);
  };

  const handleSendAadhaarOtp = () => {
    const cleaned = aadhaarNumber.replace(/\s/g, "");
    if (cleaned.length !== 12) {
      alert("Please enter a valid 12-digit Aadhaar Number.");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(3); // Go to OTP step
      setTimer(60);
    }, 1500);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      alert("Please enter the complete 6-digit OTP received on your Aadhaar-linked mobile.");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Mock verified e-KYC response from UIDAI / DigiLocker
      const verifiedProfile = {
        name: tradeData.fullName || "Rajesh Kumar",
        aadhaarMasked: `XXXX XXXX ${aadhaarNumber.replace(/\s/g, "").slice(-4) || "8421"}`,
        dob: tradeData.dob || "15/08/1988",
        gender: tradeData.gender || "Male",
        address: "H.No 42, Gali No. 3, Karol Bagh, Central Delhi, 110005",
        status: "VERIFIED",
        digiLockerId: "DL-UIDAI-2026-" + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        verificationType: "Aadhaar e-KYC via DigiLocker API (UIDAI Auth 2.5)",
      };
      setKycData(verifiedProfile);
      setTradeData((prev) => ({
        ...prev,
        fullName: prev.fullName || verifiedProfile.name,
      }));
      setStep(4); // e-KYC verified preview
    }, 1800);
  };

  const handleGenerateLabourCard = () => {
    const regNo = `SS-MSCS-2026-LAB-${Math.floor(10000 + Math.random() * 90000)}`;
    const card = {
      regNo,
      fullName: kycData?.name || tradeData.fullName || "Rajesh Kumar",
      trade: SERVICES.find((s) => s.id === tradeData.category)?.title || "Plumber",
      tradeEmoji: SERVICES.find((s) => s.id === tradeData.category)?.emoji || "🔧",
      hourlyRate: `₹${tradeData.hourlyRate || "350"}/hr`,
      district: tradeData.district || "Karol Bagh, Delhi",
      digiLockerId: kycData?.digiLockerId || "DL-UIDAI-2026-928412",
      aadhaarMasked: kycData?.aadhaarMasked || "XXXX XXXX 8421",
      issueDate: new Date().toLocaleDateString("en-IN"),
      validTill: "31/12/2031",
      coopChapter: "Delhi Central Multi-State Cooperative Society",
      eshramNumber: tradeData.eshramNumber || "UAN-9921-4821-0021",
    };
    setLabourIdCard(card);
    setStep(6);
    if (onSuccess) {
      onSuccess(card);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "680px" }}>
        <div className="india-bar" />

        {/* Modal Header */}
        <div className="modal-header" style={{ padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 36, height: 36, borderRadius: "8px", background: "linear-gradient(135deg, #1e3a8a, #0c831f)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "1.1rem" }}>
              🛠️
            </div>
            <div>
              <div className="modal-title" style={{ fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                National Labour & Artisan Registration
                <span className="badge badge-digilocker" style={{ fontSize: "0.65rem", padding: "2px 8px", background: "#e0f2fe", color: "#0369a1", borderRadius: "100px", fontWeight: 700, border: "1px solid #bae6fd" }}>
                  DigiLocker Verified
                </span>
              </div>
              <div style={{ fontSize: "0.78rem", color: "#6b7280" }}>
                Ministry of Cooperation · Multi-State Cooperative Platform · Govt. of India
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Multi-step progress bar */}
        <div className="stepper-wrap" style={{ padding: "0.75rem 1.5rem", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <div className="stepper-inner" style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            {[
              { num: 1, label: "1. Trade Info" },
              { num: 2, label: "2. DigiLocker KYC" },
              { num: 5, label: "3. Bank Payout" },
              { num: 6, label: "4. Labour ID Card" },
            ].map((st, i) => {
              const isCompleted = step > st.num || (st.num === 2 && step >= 4);
              const isActive = (step === st.num) || (st.num === 2 && (step === 2 || step === 3 || step === 4));
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem", zIndex: 2 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: isCompleted ? "#0c831f" : isActive ? "#2563eb" : "#cbd5e1",
                      color: "#fff",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isCompleted ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: isActive ? 700 : 500, color: isActive ? "#0f172a" : "#64748b" }}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body content based on step */}
        <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto", padding: "1.5rem" }}>
          {/* STEP 1: TRADE & PERSONAL DETAILS */}
          {step === 1 && (
            <div>
              <div style={{ padding: "0.85rem 1rem", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", marginBottom: "1.25rem", display: "flex", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.3rem" }}>📢</span>
                <div style={{ fontSize: "0.8rem", color: "#1e3a8a", lineHeight: 1.5 }}>
                  <strong>Join SahayogSeva as an Empowered Worker Member!</strong>
                  <br />
                  Keep 92% of your earnings with direct instant bank transfers, ₹1 Lakh free health insurance cover, and democratic voting rights.
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Full Name (As on Aadhaar)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Rajesh Kumar"
                    value={tradeData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Skill / Service Trade</label>
                  <select
                    className="form-input form-select"
                    value={tradeData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.emoji} {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={tradeData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Experience (Years)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="5"
                    value={tradeData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="350"
                    value={tradeData.hourlyRate}
                    onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Work District / City</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Karol Bagh, Central Delhi"
                    value={tradeData.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">e-Shram / BOCW Card No. (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. UAN 9840-2819-0192"
                    value={tradeData.eshramNumber}
                    onChange={(e) => handleInputChange("eshramNumber", e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: "1rem", padding: "0.85rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1.2rem" }}>🔒</span>
                <span style={{ fontSize: "0.78rem", color: "#166534" }}>
                  Next step requires instant <strong>Aadhaar e-KYC Verification via DigiLocker</strong> to prevent fake profiles and ensure customer trust.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: DIGILOCKER AADHAAR AUTHENTICATION */}
          {step === 2 && (
            <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
              <div style={{ maxWidth: "460px", margin: "0 auto" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "6px 14px", background: "#f0fdf4", borderRadius: "100px", border: "1px solid #bbf7d0", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#166534" }}>
                    🏛️ National e-Governance Division · UIDAI Authenticated
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div style={{ padding: "8px 16px", background: "#1e3a8a", color: "#ffffff", borderRadius: "8px", fontWeight: 800, fontSize: "1rem", letterSpacing: "1px" }}>
                    DigiLocker
                  </div>
                  <span style={{ fontSize: "1.2rem", color: "#94a3b8" }}>✕</span>
                  <div style={{ padding: "8px 16px", background: "#0c831f", color: "#ffffff", borderRadius: "8px", fontWeight: 800, fontSize: "1rem" }}>
                    SahayogSeva
                  </div>
                </div>

                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.4rem" }}>
                  Connect with DigiLocker for Aadhaar e-KYC
                </h3>
                <p style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                  Your identity is verified directly through Government of India DigiLocker / UIDAI servers. No document upload required.
                </p>

                <div className="form-group" style={{ textAlign: "left" }}>
                  <label className="form-label" style={{ fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
                    <span>Enter 12-Digit Aadhaar Number</span>
                    <span style={{ fontSize: "0.75rem", color: "#0c831f" }}>🔒 256-bit Encrypted</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="XXXX  XXXX  XXXX"
                      value={aadhaarNumber}
                      onChange={(e) => formatAadhaar(e.target.value)}
                      style={{ fontSize: "1.1rem", letterSpacing: "3px", fontWeight: 700, textAlign: "center" }}
                    />
                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: "1.2rem" }}>
                      🇮🇳
                    </span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.4rem" }}>
                    We will send a one-time password (OTP) to your Aadhaar registered mobile number.
                  </div>
                </div>

                <div style={{ padding: "0.85rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", textAlign: "left", fontSize: "0.76rem", color: "#475569", lineHeight: 1.5, marginTop: "1rem" }}>
                  ☑️ I hereby give my consent to SahayogSeva to fetch my basic KYC profile (Name, Photo, DOB, Address) from DigiLocker / UIDAI for cooperative membership registration under Multi-State Cooperative Societies Act.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: AADHAAR OTP VERIFICATION */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
              <div style={{ maxWidth: "440px", margin: "0 auto" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#e0f2fe", color: "#0284c7", fontSize: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  📱
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.3rem" }}>
                  Enter Aadhaar OTP
                </h3>
                <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "1.5rem" }}>
                  OTP sent to mobile linked with Aadhaar ending in{" "}
                  <strong>XXXX-XXXX-{aadhaarNumber.replace(/\s/g, "").slice(-4) || "8421"}</strong>
                </p>

                {/* 6-box OTP input */}
                <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !digit && idx > 0) {
                          document.getElementById(`otp-input-${idx - 1}`)?.focus();
                        }
                      }}
                      style={{
                        width: "48px",
                        height: "52px",
                        textAlign: "center",
                        fontSize: "1.3rem",
                        fontWeight: 800,
                        border: digit ? "2px solid #0c831f" : "1.5px solid #cbd5e1",
                        borderRadius: "10px",
                        background: digit ? "#f0fdf4" : "#ffffff",
                        outline: "none",
                        color: "#0f172a",
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: "#64748b", marginBottom: "1rem" }}>
                  <span>
                    ⏱️ Resend OTP in <strong>{timer > 0 ? `${timer}s` : "Available"}</strong>
                  </span>
                  {timer === 0 && (
                    <button
                      className="btn btn-ghost"
                      style={{ padding: "4px 8px", fontSize: "0.8rem", color: "#0c831f", fontWeight: 700 }}
                      onClick={() => setTimer(60)}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <div style={{ padding: "0.75rem", background: "#fef3c7", border: "1px solid #fde68a", borderRadius: "8px", fontSize: "0.75rem", color: "#92400e" }}>
                  💡 <strong>Test Demo OTP:</strong> You can enter <strong>1 2 3 4 5 6</strong> or any 6 digits to complete the live e-KYC demonstration.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: e-KYC VERIFIED PROFILE PREVIEW */}
          {step === 4 && kycData && (
            <div>
              <div style={{ padding: "1rem", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "12px", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#0c831f", color: "#ffffff", fontSize: "1.4rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  ✓
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: "#166534", fontSize: "1rem" }}>
                    Aadhaar e-KYC Verified Successfully!
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#15803d" }}>
                    Authenticated via DigiLocker · Token: {kycData.digiLockerId}
                  </div>
                </div>
                <div style={{ marginLeft: "auto", background: "#dcfce7", color: "#166534", padding: "4px 10px", borderRadius: "100px", fontSize: "0.72rem", fontWeight: 800, border: "1px solid #86efac" }}>
                  GOVT VERIFIED
                </div>
              </div>

              {/* Verified Identity Card Preview */}
              <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "12px", background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", fontWeight: 800, flexShrink: 0, position: "relative" }}>
                    {kycData.name.split(" ").map((n) => n[0]).join("")}
                    <div style={{ position: "absolute", bottom: -4, right: -4, background: "#0c831f", color: "#fff", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", border: "2px solid #fff" }}>
                      ✓
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
                      {kycData.name}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#475569", fontWeight: 600 }}>
                      Aadhaar No: <span style={{ fontFamily: "monospace", color: "#0f172a", fontWeight: 700 }}>{kycData.aadhaarMasked}</span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
                      DOB: {kycData.dob} · Gender: {kycData.gender}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px dashed #e2e8f0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.78rem" }}>
                  <div>
                    <span style={{ color: "#64748b" }}>Registered Address:</span>
                    <div style={{ fontWeight: 600, color: "#1e293b", marginTop: "2px" }}>{kycData.address}</div>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Verification Authority:</span>
                    <div style={{ fontWeight: 600, color: "#0c831f", marginTop: "2px" }}>
                      🏛️ UIDAI MeriPehchaan DigiLocker API
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: BANK ACCOUNT & PAYOUT DETAILS */}
          {step === 5 && (
            <div>
              <div style={{ padding: "0.85rem 1rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", marginBottom: "1.25rem", display: "flex", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.3rem" }}>💰</span>
                <div style={{ fontSize: "0.8rem", color: "#166534", lineHeight: 1.5 }}>
                  <strong>Direct 92% Worker Payout Configuration</strong>
                  <br />
                  Customer payments go directly to this bank account or UPI ID with 0 platform deduction beyond the flat 8% co-op welfare fee.
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">UPI ID / VPA for Instant Daily Settlement (Recommended)</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. rajeshkumar@okaxis or 9876543210@paytm"
                    value={tradeData.upiId}
                    onChange={(e) => handleInputChange("upiId", e.target.value)}
                  />
                  <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: "0.75rem", fontWeight: 700, color: "#0c831f", background: "#f0fdf4", padding: "2px 8px", borderRadius: "4px" }}>
                    Instant Payout
                  </span>
                </div>
              </div>

              <div style={{ margin: "1rem 0", textAlign: "center", position: "relative" }}>
                <span style={{ background: "#ffffff", padding: "0 10px", color: "#94a3b8", fontSize: "0.75rem", position: "relative", zIndex: 1 }}>
                  OR ENTER BANK ACCOUNT DETAILS
                </span>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "#e2e8f0" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Bank Account Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 918230192841"
                    value={tradeData.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">IFSC Code</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. SBIN0001234"
                    value={tradeData.ifscCode}
                    onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: DIGITAL LABOUR ID CARD ISSUED */}
          {step === 6 && labourIdCard && (
            <div style={{ textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "6px 14px", background: "#f0fdf4", borderRadius: "100px", border: "1px solid #bbf7d0", marginBottom: "1rem" }}>
                <span style={{ color: "#0c831f", fontWeight: 800 }}>🎉 Registration Approved & Active!</span>
              </div>

              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.25rem" }}>
                National Multi-State Co-op Labour Card
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "1.25rem" }}>
                Your verified Digital Labour Identity Card has been minted and registered in the National Cooperative Registry.
              </p>

              {/* Digital Labour ID Card Design */}
              <div
                className="labour-id-card"
                style={{
                  maxWidth: "480px",
                  margin: "0 auto",
                  background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
                  borderRadius: "16px",
                  padding: "1.25rem",
                  color: "#ffffff",
                  textAlign: "left",
                  boxShadow: "0 12px 30px rgba(6, 78, 59, 0.3)",
                  position: "relative",
                  overflow: "hidden",
                  border: "2px solid #34d399",
                }}
              >
                {/* Background watermark */}
                <div style={{ position: "absolute", right: -20, bottom: -20, opacity: 0.08, fontSize: "10rem", fontWeight: 900, pointerEvents: "none" }}>
                  स
                </div>

                {/* Card Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "0.75rem", marginBottom: "0.85rem" }}>
                  <div>
                    <div style={{ fontSize: "0.65rem", letterSpacing: "1px", color: "#a7f3d0", fontWeight: 700 }}>
                      GOVERNMENT OF INDIA · MINISTRY OF COOPERATION
                    </div>
                    <div style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "0.5px" }}>
                      SAHAYOGSEVA LABOUR IDENTITY CARD
                    </div>
                  </div>
                  <div style={{ background: "#ffffff", color: "#065f46", padding: "3px 8px", borderRadius: "6px", fontSize: "0.65rem", fontWeight: 900 }}>
                    DIGILOCKER VERIFIED
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  {/* Photo with verified badge */}
                  <div style={{ width: 68, height: 78, borderRadius: "8px", background: "#ffffff", border: "2px solid #a7f3d0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#065f46", fontWeight: 800, flexShrink: 0 }}>
                    <span style={{ fontSize: "2rem" }}>{labourIdCard.tradeEmoji}</span>
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#065f46" }}>VERIFIED</span>
                  </div>

                  {/* Info details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff" }}>
                      {labourIdCard.fullName}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#fef08a", fontWeight: 700 }}>
                      {labourIdCard.trade} · Grade A Member
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#d1fae5", marginTop: "2px" }}>
                      Reg No: <strong style={{ color: "#ffffff", fontFamily: "monospace" }}>{labourIdCard.regNo}</strong>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#d1fae5" }}>
                      Aadhaar: <span style={{ fontFamily: "monospace" }}>{labourIdCard.aadhaarMasked}</span>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div style={{ width: 60, height: 60, background: "#ffffff", borderRadius: "8px", padding: "4px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: "1.7rem" }}>🏁</div>
                    <span style={{ fontSize: "0.5rem", color: "#0f172a", fontWeight: 800 }}>SCAN KYC</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div style={{ marginTop: "0.85rem", paddingTop: "0.6rem", borderTop: "1px solid rgba(255,255,255,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.68rem", color: "#a7f3d0" }}>
                  <div>📍 Chapter: {labourIdCard.district}</div>
                  <div>Valid: {labourIdCard.validTill}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.25rem" }}>
                <button
                  className="btn btn-outline"
                  style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                  onClick={() => alert(`Labour Card ${labourIdCard.regNo} saved to your device as PDF!`)}
                >
                  📥 Download ID Card
                </button>
                <button
                  className="btn btn-primary"
                  style={{ padding: "8px 20px", fontSize: "0.85rem" }}
                  onClick={onClose}
                >
                  Go to Worker Dashboard →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer actions */}
        <div className="modal-footer" style={{ padding: "1rem 1.5rem", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
          {step === 1 && (
            <>
              <button className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!tradeData.fullName) {
                    alert("Please enter your Full Name.");
                    return;
                  }
                  setStep(2);
                }}
              >
                Continue to DigiLocker Aadhaar Verification →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className="btn btn-primary"
                disabled={isVerifying}
                onClick={handleSendAadhaarOtp}
                style={{ background: "#1e3a8a" }}
              >
                {isVerifying ? "Connecting to DigiLocker..." : "Verify via DigiLocker →"}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <button className="btn btn-ghost" onClick={() => setStep(2)}>
                ← Change Aadhaar
              </button>
              <button
                className="btn btn-primary"
                disabled={isVerifying}
                onClick={handleVerifyOtp}
              >
                {isVerifying ? "Validating with UIDAI..." : "Confirm & Fetch e-KYC →"}
              </button>
            </>
          )}

          {step === 4 && (
            <>
              <button className="btn btn-ghost" onClick={() => setStep(2)}>
                ← Re-verify
              </button>
              <button className="btn btn-primary" onClick={() => setStep(5)}>
                Proceed to Payout Details →
              </button>
            </>
          )}

          {step === 5 && (
            <>
              <button className="btn btn-ghost" onClick={() => setStep(4)}>
                ← Back
              </button>
              <button className="btn btn-primary" onClick={handleGenerateLabourCard}>
                Generate Verified Labour ID Card ✓
              </button>
            </>
          )}

          {step === 6 && (
            <div style={{ width: "100%", textAlign: "center", fontSize: "0.78rem", color: "#64748b" }}>
              Cooperative Membership Registered under Multi-State Cooperative Societies Act, Govt. of India.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
