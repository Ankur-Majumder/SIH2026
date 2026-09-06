import React, { useState, useEffect, useCallback, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

import { SERVICES, PROVIDERS, BOOKINGS_DATA } from "./src/data/mockData";
import { HomePage } from "./src/pages/HomePage";
import { ServicesPage } from "./src/pages/ServicesPage";
import { HowItWorksPage } from "./src/pages/HowItWorksPage";
import { CooperativePage } from "./src/pages/CooperativePage";
import { ProvidersPage } from "./src/pages/ProvidersPage";
import { ImpactPage } from "./src/pages/ImpactPage";

import { LabourRegistrationModal } from "./src/components/LabourRegistrationModal";
import { PaymentGatewayModal } from "./src/components/PaymentGatewayModal";
import { ReceiptModal } from "./src/components/ReceiptModal";
import { LabourIdCardModal } from "./src/components/LabourIdCardModal";


function GovtTopBar({ lang, setLang }) {
  return (
    <div className="govt-top-bar">
      <div className="india-top-stripe" />
      <div className="govt-top-inner">
        <div className="govt-top-left">
          <span className="ashoka-emblem">🏛️</span>
          <div className="govt-title-text">
            <strong>भारत सरकार | GOVERNMENT OF INDIA</strong>
            <span>सहकारिता मंत्रालय | MINISTRY OF COOPERATION</span>
          </div>
        </div>
        <div className="govt-top-right">
          <span className="top-helpline">📞 Helpline: 1800-11-2025</span>
          <div className="govt-acc-btn">Screen Reader</div>
          <div className="govt-acc-btn">A-</div>
          <div className="govt-acc-btn active">A</div>
          <div className="govt-acc-btn">A+</div>
          <button className="lang-toggle-btn" onClick={() => setLang(lang === "hi" ? "en" : "hi")}>
            🌐 {lang === "hi" ? "English" : "हिंदी"}
          </button>
        </div>
      </div>
    </div>
  );
}

function GovtTickerBar({ lang }) {
  return (
    <div className="govt-ticker-bar">
      <div className="ticker-badge">📢 Notice</div>
      <div className="ticker-text">
        {lang === "hi"
          ? "सहकारिता मंत्रालय, भारत सरकार द्वारा पंजीकृत राष्ट्रीय बहु-राज्य सहकारी मंच। डिजीलॉकर आधार प्रमाणीकरण एवं 92% सीधा श्रमिक भुगतान।"
          : "Registered National Multi-State Cooperative Platform under Ministry of Cooperation, Govt. of India. DigiLocker Aadhaar e-KYC Enabled & 92% Direct Worker Payout."}
      </div>
    </div>
  );
}

function Logo({ lang }) {
  return (
    <div className="logo">
      <div className="logo-emblem">
        <span className="logo-icon">स</span>
        <span className="emblem-sub">सत्यमेव जयते</span>
      </div>
      <div>
        <div className="logo-text">Sahayog<span>Seva</span></div>
        <div className="logo-subtext">
          {lang === "hi" ? "राष्ट्रीय सहकारिता डिजिटल पोर्टल" : "National Cooperative Platform"}
        </div>
      </div>
    </div>
  );
}

function Navbar({ onNav, activeView, lang, setLang, onOpenAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e, targetView) => {
    e.preventDefault();
    onNav(targetView);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <GovtTopBar lang={lang} setLang={setLang} />
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <a className="brand" href="#" onClick={(e) => handleNavClick(e, "home")}>
            <Logo lang={lang} />
          </a>

          <ul className="nav-links">
            <li>
              <a
                href="#"
                className={activeView === "services" || activeView === "providers" ? "active nav-item-active" : ""}
                onClick={(e) => handleNavClick(e, "services")}
              >
                {lang === "hi" ? "सेवाएँ एवं प्रदाता" : "Services & Providers"}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeView === "how" ? "active nav-item-active" : ""}
                onClick={(e) => handleNavClick(e, "how")}
              >
                {lang === "hi" ? "प्रक्रिया" : "How it works"}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeView === "cooperative" ? "active nav-item-active" : ""}
                onClick={(e) => handleNavClick(e, "cooperative")}
              >
                {lang === "hi" ? "सहकारी मॉडल" : "Cooperative"}
              </a>
            </li>
            <li>
              <a
                href="#"
                className={activeView === "impact" ? "active nav-item-active" : ""}
                onClick={(e) => handleNavClick(e, "impact")}
              >
                {lang === "hi" ? "प्रभाव" : "Impact"}
              </a>
            </li>
          </ul>

          <div className="nav-actions">
            <button className="btn btn-ghost" onClick={() => onOpenAuth("login")}>
              {lang === "hi" ? "लॉग इन" : "Log in"}
            </button>
            <button className="btn btn-primary" onClick={() => onOpenAuth("signup")}>
              {lang === "hi" ? "पंजीकरण →" : "Get started →"}
            </button>
            <button className="btn btn-ghost btn-icon" onClick={() => onNav("dashboard")} title="Dashboard">
              ⊞
            </button>
            <button className="btn btn-ghost btn-icon mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <a href="#" className={activeView === "home" ? "active" : ""} onClick={(e) => handleNavClick(e, "home")}>
              🏠 {lang === "hi" ? "मुख्य पृष्ठ" : "Home"}
            </a>
            <a href="#" className={activeView === "services" || activeView === "providers" ? "active" : ""} onClick={(e) => handleNavClick(e, "services")}>
              🔧 {lang === "hi" ? "सेवाएँ एवं प्रदाता" : "Services & Providers"}
            </a>
            <a href="#" className={activeView === "how" ? "active" : ""} onClick={(e) => handleNavClick(e, "how")}>
              📋 {lang === "hi" ? "प्रक्रिया" : "How It Works"}
            </a>
            <a href="#" className={activeView === "cooperative" ? "active" : ""} onClick={(e) => handleNavClick(e, "cooperative")}>
              🤝 {lang === "hi" ? "सहकारी मॉडल" : "Cooperative"}
            </a>
            <a href="#" className={activeView === "impact" ? "active" : ""} onClick={(e) => handleNavClick(e, "impact")}>
              📊 {lang === "hi" ? "प्रभाव" : "Impact"}
            </a>
            <a href="#" className={activeView === "dashboard" ? "active" : ""} onClick={(e) => handleNavClick(e, "dashboard")}>
              ⊞ {lang === "hi" ? "डैशबोर्ड" : "Member Dashboard"}
            </a>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => { onOpenAuth("login"); setMenuOpen(false); }}>
                {lang === "hi" ? "लॉग इन" : "Log in"}
              </button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => { onOpenAuth("signup"); setMenuOpen(false); }}>
                {lang === "hi" ? "पंजीकरण" : "Get started"}
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}


function AuthModal({ type, onClose, onSwitch, onOpenLabourReg }) {
  const isLogin = type === "login";
  const [role, setRole] = useState("household");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="india-bar" />
        <div className="modal-header">
          <div className="modal-title">{isLogin ? "Welcome back" : "Join the Cooperative"}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {!isLogin && (
            <div style={{ marginBottom: "1.25rem" }}>
              <div className="form-label">I am joining as</div>
              <div className="tabs" style={{ width: "100%", borderRadius: "10px" }}>
                <button className={`tab ${role === "household" ? "active" : ""}`} style={{ flex: 1 }} onClick={() => setRole("household")}>
                  🏠 Household Member
                </button>
                <button className={`tab ${role === "provider" ? "active" : ""}`} style={{ flex: 1 }} onClick={() => setRole("provider")}>
                  🛠️ Labour / Provider
                </button>
              </div>
            </div>
          )}

          {!isLogin && role === "provider" && (
            <div style={{ padding: "1rem", background: "#eff6ff", border: "1.5px solid #93c5fd", borderRadius: "10px", marginBottom: "1.25rem" }}>
              <div style={{ fontWeight: 800, color: "#1e3a8a", fontSize: "0.9rem", marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span>🔒 DigiLocker Aadhaar Verification</span>
              </div>
              <p style={{ fontSize: "0.78rem", color: "#1e40af", margin: "0 0 0.75rem 0", lineHeight: 1.5 }}>
                Under the Ministry of Cooperation rules, all service providers and artisans undergo instant DigiLocker Aadhaar e-KYC to get verified and receive a Digital Labour ID card.
              </p>
              <button
                className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", background: "#1e3a8a", fontSize: "0.85rem", padding: "8px" }}
                onClick={() => {
                  onClose();
                  onOpenLabourReg();
                }}
              >
                Proceed with DigiLocker Verification →
              </button>
            </div>
          )}

          {((!isLogin && role === "household") || isLogin) && (
            <>
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" placeholder="e.g. Ananya Singh" />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input type="tel" className="form-input" placeholder="+91 98765 43210" />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" placeholder="••••••••" />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">District / City</label>
                  <input type="text" className="form-input" placeholder="e.g. New Delhi" />
                </div>
              )}
            </>
          )}
        </div>
        <div className="modal-footer" style={{ flexDirection: "column", gap: "0.75rem" }}>
          {((!isLogin && role === "household") || isLogin) && (
            <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={onClose}>
              {isLogin ? "Log in →" : "Create Household Account →"}
            </button>
          )}
          <div style={{ textAlign: "center", fontSize: "0.82rem", color: "#4b5563" }}>
            {isLogin ? "New here?" : "Already a member?"}{" "}
            <span style={{ color: "#0c831f", cursor: "pointer", fontWeight: 700 }} onClick={() => onSwitch(isLogin ? "signup" : "login")}>
              {isLogin ? "Join the cooperative" : "Log in"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


function BookingModal({ provider, onClose, onProceedToPayment }) {
  const slots = ["Today · 2:00 PM", "Today · 4:00 PM", "Tomorrow · 9:00 AM", "Tomorrow · 11:30 AM"];
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [address, setAddress] = useState("H.No 14, Karol Bagh, Central Delhi");
  const [notes, setNotes] = useState("");

  const priceRaw = parseInt(provider?.price?.replace(/\D/g, "") || "380", 10);
  const workerShare = Math.round(priceRaw * 0.92);
  const coopFee = priceRaw - workerShare;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="india-bar" />
        <div className="modal-header" style={{ padding: "0.85rem 1.1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem" }}>📅</span>
            <div>
              <div className="modal-title" style={{ fontSize: "1rem", fontWeight: 800 }}>Book Cooperative Service</div>
              <div style={{ fontSize: "0.68rem", color: "#64748b" }}>100% Escrow Protected · 0% Middleman</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body booking-modal-body">
          {/* Provider Card Header */}
          <div className="booking-provider-card">
            <div className={`avatar ${provider.avatar}`} style={{ width: 44, height: 44, minWidth: 44, borderRadius: 10, fontSize: "0.95rem" }}>
              {provider.initials}
              <div className="verified-dot">✓</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: "#111827", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap" }}>
                <span>{provider.name}</span>
                <span style={{ fontSize: "0.58rem", background: "#e0f2fe", color: "#0369a1", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>
                  DigiLocker
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#0c831f", fontWeight: 700 }}>{provider.role}</div>
              <div style={{ fontSize: "0.7rem", color: "#4b5563" }}>{provider.location} · {provider.distance}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontWeight: 800, color: "#0c831f", fontSize: "1.05rem" }}>{provider.price}</div>
              <div style={{ fontSize: "0.62rem", color: "#6b7280" }}>Reg: {provider.labourRegNo || "SS-DL-2026"}</div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "0.85rem" }}>
            <label className="form-label" style={{ fontSize: "0.78rem" }}>Service Address</label>
            <input
              type="text"
              className="form-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House / Flat no., Street, Landmark, Area"
              style={{ fontSize: "0.85rem", padding: "8px 12px" }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "0.85rem" }}>
            <label className="form-label" style={{ fontSize: "0.78rem" }}>Describe the work</label>
            <textarea
              className="form-input"
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Kitchen tap leaking, need urgent fix..."
              style={{ resize: "vertical", fontSize: "0.85rem", padding: "8px 12px" }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "0.85rem" }}>
            <label className="form-label" style={{ fontSize: "0.78rem" }}>Choose Arrival Time Slot</label>
            <div className="booking-slots-grid">
              {slots.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedSlot(i)}
                  className={`booking-slot-btn ${selectedSlot === i ? "active" : ""}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Transparent Split Preview */}
          <div className="booking-split-card">
            <div style={{ fontWeight: 800, marginBottom: "0.25rem", color: "#0c831f", display: "flex", justifyContent: "space-between" }}>
              <span>🤝 Cooperative Pricing Split</span>
              <span>Total: ₹{priceRaw}</span>
            </div>
            <div style={{ color: "#166534", lineHeight: 1.4, fontSize: "0.73rem" }}>
              • <strong>₹{workerShare} (92%)</strong> goes directly to {provider.name}'s verified bank account.
              <br />
              • <strong>₹{coopFee} (8%)</strong> flat co-op welfare fee funds insurance & upkeep.
            </div>
          </div>
        </div>

        <div className="booking-modal-footer">
          <button className="btn btn-ghost booking-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary booking-proceed-btn"
            onClick={() => {
              onProceedToPayment({
                slot: slots[selectedSlot],
                address,
                notes,
                amount: priceRaw,
              });
            }}
          >
            Proceed to Payment Gateway (₹{priceRaw}) →
          </button>
        </div>
      </div>
    </div>
  );
}


function DashboardView({ onBack, onOpenReceipt, onOpenLabourCard }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [mode, setMode] = useState("household");

  const sampleCard = {
    regNo: "SS-DL-2026-LAB-84920",
    fullName: "Rajesh Kumar",
    trade: "Master Plumber",
    tradeEmoji: "🔧",
    hourlyRate: "₹380/hr",
    district: "Karol Bagh, Central Delhi",
    digiLockerId: "DL-UIDAI-2026-928412",
    aadhaarMasked: "XXXX XXXX 8421",
    issueDate: "12/01/2026",
    validTill: "31/12/2031",
    eshramNumber: "UAN-9921-4821-0021",
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "68px" }}>
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <div className="dash-greeting">Namaste 👋</div>
            <div className="dash-name">{mode === "household" ? "Ananya Singh (Member)" : "Rajesh Kumar (Verified Worker)"}</div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button className={`mode-toggle${mode === "household" ? " active" : ""}`} onClick={() => setMode("household")}>
                🏠 Household View
              </button>
              <button className={`mode-toggle${mode === "provider" ? " active" : ""}`} onClick={() => setMode("provider")}>
                🛠️ Provider / Labour View
              </button>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div className="tabs">
              <button className={`tab${activeTab === "overview" ? " active" : ""}`} onClick={() => setActiveTab("overview")}>
                Overview
              </button>
              <button className={`tab${activeTab === "bookings" ? " active" : ""}`} onClick={() => setActiveTab("bookings")}>
                Bookings & Invoices
              </button>
            </div>
            <button className="btn btn-outline" onClick={() => onBack("home")}>
              ← Back to Portal
            </button>
          </div>
        </div>

        {mode === "household" ? (
          <>
            <div className="dash-grid">
              {[
                { icon: "📋", iconClass: "icon-green", val: "4", key: "Total Bookings", trend: "+2 this month", trendClass: "trend-up" },
                { icon: "💰", iconClass: "icon-saffron", val: "₹3,200", key: "Amount Paid via Escrow", trend: "100% Protected", trendClass: "trend-neutral" },
                { icon: "⭐", iconClass: "icon-blue", val: "4.9", key: "Avg Rating Given", trend: "Verified Reviews", trendClass: "trend-up" },
                { icon: "🔒", iconClass: "icon-purple", val: "Active", key: "DigiLocker Status", trend: "e-KYC Verified", trendClass: "trend-up" },
              ].map((c, i) => (
                <div className="dash-card" key={i}>
                  <div className="dash-card-top">
                    <div className={`dash-card-icon ${c.iconClass}`}>{c.icon}</div>
                    <span className={`dash-trend ${c.trendClass}`}>{c.trend}</span>
                  </div>
                  <div className="dash-val">{c.val}</div>
                  <div className="dash-key">{c.key}</div>
                </div>
              ))}
            </div>

            <div className="dash-sections">
              <div className="dash-panel">
                <div className="dash-panel-header">
                  <div className="dash-panel-title">Recent Transactions & Invoices</div>
                  <span style={{ fontSize: "0.75rem", color: "#0c831f", fontWeight: 700 }}>92% Direct Worker Share</span>
                </div>
                {BOOKINGS_DATA.map((b) => (
                  <div className="booking-row" key={b.id}>
                    <div className="booking-service-icon">{b.icon}</div>
                    <div className="booking-info">
                      <div className="booking-name">{b.name}</div>
                      <div className="booking-meta">{b.service} · {b.paymentMethod}</div>
                    </div>
                    <div className="booking-right">
                      <div className="booking-amount">{b.amount}</div>
                      <div className="booking-date">{b.date}</div>
                    </div>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: "4px 8px", fontSize: "0.75rem", border: "1px solid #cbd5e1" }}
                      onClick={() =>
                        onOpenReceipt({
                          txnId: b.txnId,
                          providerName: b.name,
                          providerRole: b.service,
                          amount: parseInt(b.amount.replace(/\D/g, "")),
                          workerShare: parseInt(b.workerShare.replace(/\D/g, "")),
                          coopFee: parseInt(b.coopFee.replace(/\D/g, "")),
                          paymentMethod: b.paymentMethod,
                          timestamp: b.date,
                          rrn: "891240192841",
                        })
                      }
                    >
                      🧾 Invoice
                    </button>
                    <span className={`status-pill status-${b.status}`}>{b.status}</span>
                  </div>
                ))}
              </div>

              <div>
                <div className="dash-panel" style={{ marginBottom: "1rem" }}>
                  <div className="dash-panel-header">
                    <div className="dash-panel-title">Cooperative Member Benefits</div>
                  </div>
                  <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {[
                      { icon: "🛡️", text: "Protected Escrow Payment with PIN release" },
                      { icon: "🪪", text: "DigiLocker Verified Service Providers Only" },
                      { icon: "🗳️", text: "Annual General Meeting Voting Right: Active" },
                      { icon: "💰", text: "Cooperative Dividend Accrued: ₹320" },
                    ].map((b, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.82rem" }}>
                        <span>{b.icon}</span>
                        <span style={{ color: "var(--slate-700)" }}>{b.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* PROVIDER DASHBOARD VIEW */
          <>
            <div className="dash-grid">
              {[
                { icon: "💰", iconClass: "icon-green", val: "₹13,400", key: "Direct Earnings (Sep)", trend: "92% direct payout", trendClass: "trend-up" },
                { icon: "📋", iconClass: "icon-blue", val: "36", key: "Jobs This Month", trend: "+8 vs Aug", trendClass: "trend-up" },
                { icon: "🪪", iconClass: "icon-saffron", val: "Verified", key: "DigiLocker Aadhaar e-KYC", trend: "Reg: SS-DL-2026", trendClass: "trend-up" },
                { icon: "🏅", iconClass: "icon-purple", val: "Grade A", key: "Co-op Rank", trend: "Karol Bagh Chapter", trendClass: "trend-up" },
              ].map((c, i) => (
                <div className="dash-card" key={i}>
                  <div className="dash-card-top">
                    <div className={`dash-card-icon ${c.iconClass}`}>{c.icon}</div>
                    <span className={`dash-trend ${c.trendClass}`}>{c.trend}</span>
                  </div>
                  <div className="dash-val">{c.val}</div>
                  <div className="dash-key">{c.key}</div>
                </div>
              ))}
            </div>

            <div className="dash-sections">
              <div>
                {/* Labour ID Card Banner */}
                <div style={{ background: "linear-gradient(135deg, #064e3b, #047857)", borderRadius: "14px", padding: "1.25rem", color: "#fff", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "#a7f3d0", fontWeight: 700 }}>
                      GOVT OF INDIA · MINISTRY OF COOPERATION
                    </div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 900 }}>
                      National SahayogSeva Labour Identity Card
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#d1fae5" }}>
                      Reg No: <strong>{sampleCard.regNo}</strong> · DigiLocker Verified
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn btn-outline"
                      style={{ background: "#ffffff", color: "#064e3b", border: "none", fontSize: "0.8rem", padding: "6px 14px", fontWeight: 800 }}
                      onClick={() => onOpenLabourCard(sampleCard)}
                    >
                      🪪 View & Download ID Card
                    </button>
                  </div>
                </div>

                {/* Upcoming Jobs */}
                <div className="dash-panel">
                  <div className="dash-panel-header">
                    <div className="dash-panel-title">Upcoming Jobs & Escrow Releases</div>
                    <span className="status-pill status-upcoming">2 scheduled</span>
                  </div>
                  {[
                    { icon: "🔧", client: "Ananya Singh", service: "Kitchen pipe repair", time: "Today, 4:00 PM", addr: "Karol Bagh", amt: "₹760", share: "₹699.20 (92%)" },
                    { icon: "🔧", client: "Ramesh Gupta", service: "Bathroom leakage", time: "Tomorrow, 10:00 AM", addr: "Paharganj", amt: "₹380", share: "₹349.60 (92%)" },
                  ].map((j, i) => (
                    <div className="booking-row" key={i}>
                      <div className="booking-service-icon">{j.icon}</div>
                      <div className="booking-info">
                        <div className="booking-name">{j.client}</div>
                        <div className="booking-meta">{j.service} · 📍 {j.addr}</div>
                      </div>
                      <div className="booking-right">
                        <div className="booking-amount" style={{ color: "#0c831f" }}>Payout: {j.share}</div>
                        <div className="booking-date">{j.time}</div>
                      </div>
                      <button className="btn btn-primary" style={{ padding: "4px 12px", fontSize: "0.72rem", borderRadius: "6px" }}>
                        Ask PIN & Complete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="dash-panel" style={{ marginBottom: "1rem" }}>
                  <div className="dash-panel-header">
                    <div className="dash-panel-title">Linked Payout Account</div>
                  </div>
                  <div style={{ padding: "1rem", fontSize: "0.82rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{ color: "#64748b" }}>UPI VPA:</span>
                      <strong style={{ color: "#0f172a" }}>rajeshkumar@okaxis</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{ color: "#64748b" }}>Bank:</span>
                      <strong style={{ color: "#0f172a" }}>SBI (Karol Bagh Branch)</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <span style={{ color: "#64748b" }}>Settlement Frequency:</span>
                      <span style={{ color: "#0c831f", fontWeight: 700 }}>Instant on PIN release</span>
                    </div>
                    <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center", fontSize: "0.75rem", padding: "6px" }}>
                      Edit Payout Method
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function NoticeBanner({ message, onClose }) {
  return (
    <div className="notice-banner">
      <div className="notice-content">
        <span className="notice-icon">✅</span>
        <span>{message}</span>
      </div>
      <button className="notice-close" onClick={onClose}>✕</button>
    </div>
  );
}


function Footer({ onNav }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p>
              India's first government-backed cooperative gig platform under the Ministry of Cooperation.
              Fair 92% wages, DigiLocker Aadhaar e-KYC verification, and transparent community governance.
            </p>
            <div className="govt-badge">
              🏛️ Ministry of Cooperation · Govt. of India
            </div>
          </div>
          <div>
            <div className="footer-col-title">Platform</div>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav("services"); }}>Find Services</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav("how"); }}>How it Works</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav("dashboard"); }}>Member Dashboard</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Cooperative & Security</div>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav("cooperative"); }}>About the Model</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNav("impact"); }}>Impact Metrics</a></li>
              <li><a href="#">DigiLocker Verification</a></li>
              <li><a href="#">Escrow Payment Guarantee</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Support & Helpline</div>
            <ul className="footer-links">
              <li><a href="#">Toll-Free: 1800-11-2025</a></li>
              <li><a href="#">Grievance Redressal</a></li>
              <li><a href="#">Worker Welfare Fund</a></li>
              <li><a href="#">Multi-State Co-op Bylaws</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-text">© 2026 SahayogSeva Multi-State Cooperative Society Ltd. · Registered under MSCS Act, 2002</div>
          <div className="govt-logos">
            <div className="govt-logo-chip">🇮🇳 Govt. of India</div>
            <div className="govt-logo-chip">🏛️ Ministry of Cooperation</div>
            <div className="govt-logo-chip">🔒 DigiLocker Verified</div>
          </div>
        </div>
      </div>
      <div className="india-bar" style={{ marginTop: "1.5rem" }} />
    </footer>
  );
}


function App() {
  const [view, setView] = useState("home"); 
  const [notice, setNotice] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [lang, setLang] = useState("en"); 

  
  const [authModal, setAuthModal] = useState(null); 
  const [labourRegOpen, setLabourRegOpen] = useState(false);
  const [bookingProvider, setBookingProvider] = useState(null);
  const [paymentProvider, setPaymentProvider] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [activeLabourCard, setActiveLabourCard] = useState(null);

  const showNotice = useCallback((msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 4000);
  }, []);

  const handleBook = useCallback((provider) => {
    setBookingProvider(provider);
  }, []);

  const handleProceedToPayment = (details) => {
    const p = bookingProvider;
    setBookingProvider(null);
    setBookingDetails(details);
    setPaymentProvider(p);
  };

  const handlePaymentSuccess = (txn) => {
    showNotice(`✅ Payment of ₹${txn.amount} successful! ₹${txn.workerShare} (92%) allocated to ${txn.providerName}.`);
  };

  const handleLabourRegSuccess = (card) => {
    setActiveLabourCard(card);
    showNotice(`🎉 Labour ID ${card.regNo} successfully issued via DigiLocker!`);
  };

  const handleNav = useCallback((targetView) => {
    setView(targetView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSelectService = useCallback((service) => {
    setSelectedCategoryId(service.id);
    setView("services");
    showNotice(`${service.emoji} Showing verified ${service.title} near you.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [showNotice]);

  if (view === "dashboard") {
    return (
      <div className="app">
        <Navbar
          onNav={handleNav}
          activeView="dashboard"
          lang={lang}
          setLang={setLang}
          onOpenAuth={(t) => setAuthModal(t)}
        />
        {notice && <NoticeBanner message={notice} onClose={() => setNotice("")} />}
        {activeReceipt && <ReceiptModal txn={activeReceipt} onClose={() => setActiveReceipt(null)} />}
        {activeLabourCard && <LabourIdCardModal card={activeLabourCard} onClose={() => setActiveLabourCard(null)} />}
        {labourRegOpen && <LabourRegistrationModal onClose={() => setLabourRegOpen(false)} onSuccess={handleLabourRegSuccess} />}
        {authModal && (
          <AuthModal
            type={authModal}
            onClose={() => setAuthModal(null)}
            onSwitch={(t) => setAuthModal(t)}
            onOpenLabourReg={() => setLabourRegOpen(true)}
          />
        )}
        <DashboardView
          onBack={(v) => handleNav(v || "home")}
          onOpenReceipt={(txn) => setActiveReceipt(txn)}
          onOpenLabourCard={(card) => setActiveLabourCard(card)}
        />
        <Footer onNav={handleNav} />
      </div>
    );
  }

  const renderPageContent = () => {
    switch (view) {
      case "services":
      case "providers":
        return (
          <ServicesPage
            onBook={handleBook}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        );
      case "how":
        return <HowItWorksPage onNav={handleNav} />;
      case "cooperative":
        return <CooperativePage onNav={handleNav} />;
      case "impact":
        return <ImpactPage onNav={handleNav} />;
      case "home":
      default:
        return (
          <HomePage
            onBook={handleBook}
            onNav={handleNav}
            onSelectService={handleSelectService}
          />
        );
    }
  };

  return (
    <div className="app">
      <Navbar
        onNav={handleNav}
        activeView={view}
        lang={lang}
        setLang={setLang}
        onOpenAuth={(t) => setAuthModal(t)}
      />

      {notice && <NoticeBanner message={notice} onClose={() => setNotice("")} />}

      {/* Booking Slot Selection Modal */}
      {bookingProvider && (
        <BookingModal
          provider={bookingProvider}
          onClose={() => setBookingProvider(null)}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {/* Multi-Method Payment Gateway Modal */}
      {paymentProvider && (
        <PaymentGatewayModal
          provider={paymentProvider}
          bookingDetails={bookingDetails}
          onClose={() => setPaymentProvider(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* DigiLocker Labour Registration Modal */}
      {labourRegOpen && (
        <LabourRegistrationModal
          onClose={() => setLabourRegOpen(false)}
          onSuccess={handleLabourRegSuccess}
        />
      )}

      {/* Auth Modal (Login / Signup) */}
      {authModal && (
        <AuthModal
          type={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={(t) => setAuthModal(t)}
          onOpenLabourReg={() => setLabourRegOpen(true)}
        />
      )}

      {/* Payment Receipt / Tax Invoice Modal */}
      {activeReceipt && (
        <ReceiptModal
          txn={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}

      {/* DigiLocker Verified Labour ID Card Modal */}
      {activeLabourCard && (
        <LabourIdCardModal
          card={activeLabourCard}
          onClose={() => setActiveLabourCard(null)}
        />
      )}

      <main>
        <GovtTickerBar lang={lang} />
        {renderPageContent()}
      </main>

      <Footer onNav={handleNav} />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
