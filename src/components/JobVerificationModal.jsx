import React, { useState } from "react";

export function JobVerificationModal({ booking, provider, stage = "initial", onClose, onApproved, onCompleteJob }) {
  // 'initial' (Worker arrived, taking initial pic & handshake) OR 'final' (Work done, worker submits final pic, customer approves to release escrow)
  const [currentStep, setCurrentStep] = useState(stage); // 'initial' | 'comparing' | 'initial_approved' | 'final_upload' | 'final_review' | 'completed'
  
  // Worker on-site photo state
  const defaultWorkerArrivalImg = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60";
  const defaultWorkerFinalImg = "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=60";

  const [workerArrivalPhoto, setWorkerArrivalPhoto] = useState(booking?.workerArrivalPhoto || defaultWorkerArrivalImg);
  const [workerFinalPhoto, setWorkerFinalPhoto] = useState(booking?.workerFinalPhoto || defaultWorkerFinalImg);
  const [isAiVerifying, setIsAiVerifying] = useState(false);
  const [similarityScore, setSimilarityScore] = useState(96);
  const [customerApproved, setCustomerApproved] = useState(false);
  const [workerConfirmed, setWorkerConfirmed] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("Excellent work done on time with full safety and transparency.");

  const customerPhoto = booking?.customerProblem?.photoUrl || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60";
  const customerVoiceTranscript = booking?.customerProblem?.voiceTranscript || "रसोई के सिंक के नीचे मुख्य पानी का पाइप काफी तेज़ी से टपक रहा है।";
  const workerName = provider?.name || booking?.name || "Rajesh Kumar";
  const workerRole = provider?.role || booking?.service || "Master Plumber";
  const priceRaw = parseInt(booking?.amount?.replace(/\D/g, "") || provider?.price?.replace(/\D/g, "") || "850", 10);
  const workerShare = Math.round(priceRaw * 0.85);

  // Handle AI Verification Analysis Simulation
  const handleRunAiComparison = () => {
    setIsAiVerifying(true);
    setTimeout(() => {
      setIsAiVerifying(false);
      setSimilarityScore(96);
      setCurrentStep("comparing");
    }, 1800);
  };

  // Handle Initial Problem Authorization
  const handleAuthorizeInitialWork = () => {
    setCustomerApproved(true);
    setWorkerConfirmed(true);
    setCurrentStep("initial_approved");
    if (onApproved) {
      onApproved({
        workerArrivalPhoto,
        verifiedAt: new Date().toLocaleTimeString(),
        similarityScore: 96,
      });
    }
  };

  // Handle Final Work Approval and Escrow Release
  const handleFinalCustomerSignoff = () => {
    setCurrentStep("completed");
    if (onCompleteJob) {
      onCompleteJob({
        ...booking,
        workerFinalPhoto,
        rating,
        feedback,
        completedAt: new Date().toLocaleString(),
        workerShare,
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal verification-modal" onClick={(e) => e.stopPropagation()}>
        <div className="india-bar" />

        {/* Modal Header */}
        <div className="verification-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.3rem" }}>🛡️</span>
            <div>
              <div className="modal-title" style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>
                {currentStep === "final_review" || currentStep === "completed"
                  ? "Final Work Verification & Escrow Release"
                  : "Safety & Privacy Dual-Handshake Verification"}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                Govt. Ministry of Cooperation Certified Anti-Fraud & Quality Assurance System
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Verification Progress Stepper */}
        <div className="verification-stepper">
          <div className={`v-step ${currentStep === "initial" || currentStep === "comparing" || currentStep === "initial_approved" ? "active" : "done"}`}>
            <span className="v-step-num">1</span>
            <span className="v-step-label">1. Customer Problem Media & Voice</span>
          </div>
          <div className={`v-step ${currentStep === "comparing" || currentStep === "initial_approved" ? "active" : currentStep === "final_review" || currentStep === "completed" ? "done" : ""}`}>
            <span className="v-step-num">2</span>
            <span className="v-step-label">2. Worker On-Site Verification</span>
          </div>
          <div className={`v-step ${currentStep === "final_review" || currentStep === "completed" ? "active" : ""}`}>
            <span className="v-step-num">3</span>
            <span className="v-step-label">3. Completed Work & Escrow Release</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="verification-modal-body">
          {/* STEP 1 & 2: INITIAL WORKER ARRIVAL & ISSUE MATCHING */}
          {(currentStep === "initial" || currentStep === "comparing" || currentStep === "initial_approved") && (
            <div>
              <div className="verification-info-banner">
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.1rem" }}>🔒</span>
                  <div style={{ fontSize: "0.78rem", color: "#1e3a8a", lineHeight: 1.4 }}>
                    <strong>Safety Handshake Requirement:</strong> Before any work begins, {workerName} must arrive on-site, inspect the exact issue reported by the customer, and upload a live verification photo. The platform verifies both data sets to ensure 100% genuine service and zero disputes.
                  </div>
                </div>
              </div>

              {/* Side by side comparison grid */}
              <div className="verification-comparison-grid">
                {/* Column 1: Customer's Reported Problem */}
                <div className="comparison-card customer-card">
                  <div className="comparison-card-header">
                    <span className="chip chip-blue">🏠 Step 1: Customer Submission</span>
                    <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Captured at Booking</span>
                  </div>

                  <div className="media-preview-box">
                    <img src={customerPhoto} alt="Customer reported problem" className="comparison-img" />
                    <div className="media-tag">Customer Original Photo</div>
                  </div>

                  {booking?.customerProblem?.hasVoiceNote && (
                    <div className="customer-voice-badge">
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "3px" }}>
                        <span>🎙️</span>
                        <strong style={{ fontSize: "0.74rem", color: "#15803d" }}>Customer Voice Note (Audio):</strong>
                      </div>
                      <p style={{ fontSize: "0.72rem", color: "#334155", margin: 0, fontStyle: "italic" }}>
                        "{customerVoiceTranscript}"
                      </p>
                    </div>
                  )}

                  <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.4rem" }}>
                    <strong>Problem Note:</strong> {booking?.customerProblem?.description || "Water leakage in main pipe joint under kitchen sink."}
                  </div>
                </div>

                {/* Column 2: Worker's On-Site Live Photo */}
                <div className="comparison-card worker-card">
                  <div className="comparison-card-header">
                    <span className="chip chip-green">🛠️ Step 2: Worker On-Site Photo</span>
                    <span style={{ fontSize: "0.68rem", color: "#0c831f", fontWeight: 700 }}>📍 GPS Verified (&lt; 15m)</span>
                  </div>

                  <div className="media-preview-box">
                    <img src={workerArrivalPhoto} alt="Worker on-site verification" className="comparison-img" />
                    <div className="media-tag worker-tag">Captured by {workerName.split(" ")[0]}</div>
                  </div>

                  <div className="worker-live-camera-strip">
                    <label className="camera-upload-btn">
                      📸 Retake / Upload On-Site Photo
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            const url = URL.createObjectURL(e.target.files[0]);
                            setWorkerArrivalPhoto(url);
                          }
                        }}
                      />
                    </label>
                    <span style={{ fontSize: "0.68rem", color: "#64748b" }}>Timestamp: Today, 4:05 PM</span>
                  </div>

                  <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.4rem" }}>
                    <strong>Worker Diagnosis:</strong> Confirmed pipe joint seal degradation. Replaced with heavy-duty brass connector.
                  </div>
                </div>
              </div>

              {/* Platform AI Similarity and Match Check */}
              {isAiVerifying ? (
                <div className="ai-analyzing-box">
                  <div className="ai-spinner"></div>
                  <div>
                    <strong style={{ color: "#0f172a", fontSize: "0.85rem" }}>Platform AI Safety Verification in Progress...</strong>
                    <div style={{ fontSize: "0.72rem", color: "#64748b" }}>Analyzing image visual similarity, GPS proximity tag, and customer voice notes.</div>
                  </div>
                </div>
              ) : currentStep === "comparing" || currentStep === "initial_approved" ? (
                <div className="ai-match-result-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ fontSize: "1.2rem" }}>✅</span>
                      <strong style={{ color: "#166534", fontSize: "0.9rem" }}>
                        Co-op AI Issue Verification Match: {similarityScore}% (High Match)
                      </strong>
                    </div>
                    <span className="verified-badge-pill">✓ Passed Automated Safety Check</span>
                  </div>
                  <div style={{ fontSize: "0.74rem", color: "#166534", lineHeight: 1.4 }}>
                    • Visual features matched: Plumbing joint & moisture markings identified in both images.
                    <br />
                    • Geolocation match: Worker photo taken at {booking?.address || "Karol Bagh, New Delhi"} (0.01 km radius).
                    <br />
                    • Mutual Handshake: Customer and worker both agree on the work requirements.
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }} onClick={handleRunAiComparison}>
                    🤖 Run Co-op AI Verification Check & Match Data →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: WORK COMPLETION PROOF & CUSTOMER SIGN-OFF */}
          {(currentStep === "final_review" || currentStep === "completed") && (
            <div>
              <div className="verification-info-banner final-banner">
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.2rem" }}>🎉</span>
                  <div style={{ fontSize: "0.78rem", color: "#14532d", lineHeight: 1.4 }}>
                    <strong>Job Completion Verification:</strong> {workerName} has completed the service and uploaded proof of the final finished work. Please inspect the Before and After results below and approve to release the 85% escrow payment (₹{workerShare}).
                  </div>
                </div>
              </div>

              {/* Before vs After Slider / Side-by-Side */}
              <div className="before-after-grid">
                <div className="before-card">
                  <div className="ba-tag red-tag">🔴 BEFORE (Initial Problem)</div>
                  <img src={customerPhoto} alt="Initial problem state" className="ba-img" />
                  <div className="ba-caption">Broken/Leaking Water Pipe Joint</div>
                </div>

                <div className="after-card">
                  <div className="ba-tag green-tag">🟢 AFTER (Completed Work Proof)</div>
                  <img src={workerFinalPhoto} alt="Final completed work" className="ba-img" />
                  <div className="ba-caption">Repaired & Sealed Brass Pipeline Joint</div>
                </div>
              </div>

              {/* Escrow Release & Customer Satisfaction Check */}
              <div className="customer-satisfaction-card">
                <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0f172a", marginBottom: "0.4rem" }}>
                  Customer Final Sign-Off & Escrow Release
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "#475569" }}>Rate Service Quality:</span>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${rating >= star ? "active" : ""}`}
                        onClick={() => setRating(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "0.75rem" }}>
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>Work Feedback (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Describe your satisfaction with the completed work..."
                    style={{ fontSize: "0.82rem", padding: "8px 10px" }}
                  />
                </div>

                {/* Split payout reminder */}
                <div className="escrow-payout-summary">
                  <span>💰 Instant Worker Payout: <strong>₹{workerShare} (85%)</strong></span>
                  <span>🏛️ Maintenance Fee: <strong>₹{priceRaw - workerShare} (15%)</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* COMPLETED SUCCESS STATE */}
          {currentStep === "completed" && (
            <div className="completed-success-card">
              <div className="success-icon">✓</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: "0.5rem 0 0.2rem" }}>
                Work Officially Approved & Escrow Released!
              </h3>
              <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "0 0 1rem" }}>
                ₹{workerShare} direct wage transferred to {workerName}'s bank account. Both parties verified.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="verification-modal-footer">
          {currentStep === "initial" && (
            <>
              <button className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleRunAiComparison}>
                🤖 Run Co-op AI Verification Check →
              </button>
            </>
          )}

          {currentStep === "comparing" && (
            <>
              <button className="btn btn-ghost" onClick={() => setCurrentStep("initial")}>
                ← Back
              </button>
              <button className="btn btn-primary" onClick={handleAuthorizeInitialWork}>
                🤝 Customer & Worker Approve: Start Job →
              </button>
            </>
          )}

          {currentStep === "initial_approved" && (
            <>
              <div style={{ fontSize: "0.78rem", color: "#0c831f", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <span>✅ Work Authorized! Worker is now performing the service.</span>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setCurrentStep("final_review")}
              >
                Simulate Worker Finished Job & Review Final Work ➔
              </button>
            </>
          )}

          {currentStep === "final_review" && (
            <>
              <button className="btn btn-ghost" onClick={onClose}>
                Review Later
              </button>
              <button
                className="btn btn-primary"
                style={{ background: "linear-gradient(135deg, #0c831f, #047857)", fontWeight: 800 }}
                onClick={handleFinalCustomerSignoff}
              >
                ✅ Approve Work & Release Payment (₹{workerShare}) →
              </button>
            </>
          )}

          {currentStep === "completed" && (
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={onClose}>
              Done & Close ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
