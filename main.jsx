import React, { useState, useEffect, useCallback, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

// =============================================
// DATA
// =============================================
const SERVICES = [
  { id: "plumber", emoji: "🔧", title: "Plumbers", text: "Leaks, fittings & emergency repairs", count: "340+ members", color: "#3b82f6" },
  { id: "tutor", emoji: "📚", title: "Tutors", text: "School, college & competitive exams", count: "520+ members", color: "#8b5cf6" },
  { id: "caregiver", emoji: "❤️", title: "Caregivers", text: "Trusted care for elders & children", count: "280+ members", color: "#ec4899" },
  { id: "electrician", emoji: "⚡", title: "Electricians", text: "Safe wiring, fans & installations", count: "290+ members", color: "#f59e0b" },
  { id: "cleaning", emoji: "🧹", title: "Home Cleaning", text: "Daily help, deep cleaning & laundry", count: "410+ members", color: "#10b981" },
  { id: "tech", emoji: "💻", title: "Tech Support", text: "Devices, WiFi setup & app help", count: "190+ members", color: "#06b6d4" },
  { id: "carpenter", emoji: "🪚", title: "Carpenters", text: "Furniture, repairs & woodwork", count: "160+ members", color: "#f97316" },
  { id: "painter", emoji: "🖌️", title: "Painters", text: "Interior, exterior & waterproofing", count: "130+ members", color: "#a855f7" },
  { id: "driver", emoji: "🚗", title: "Local Drivers", text: "School runs, errands & outstation", count: "220+ members", color: "#14b8a6" },
];

const PROVIDERS = [
  // Plumbers
  { id: 1, category: "plumber", name: "Rajesh Kumar", initials: "RK", role: "Master Plumber", location: "Karol Bagh, Delhi", distance: "2.1 km", rating: 4.9, reviews: 142, jobs: 340, price: "₹380/hr", avatar: "avatar-blue", tags: ["Emergency", "Pipe Fitting", "Bathroom"], online: true },
  { id: 8, category: "plumber", name: "Deepak Verma", initials: "DV", role: "Plumber & Sanitary Specialist", location: "Paharganj, Delhi", distance: "3.5 km", rating: 4.7, reviews: 64, jobs: 195, price: "₹340/hr", avatar: "avatar-green", tags: ["Water Tank", "Tap Replacement", "Drainage"], online: true },
  { id: 16, category: "plumber", name: "Suresh Patel", initials: "SP", role: "Emergency Plumber", location: "Rohini, Delhi", distance: "4.1 km", rating: 4.8, reviews: 89, jobs: 210, price: "₹360/hr", avatar: "avatar-teal", tags: ["Leakage", "Pipeline", "Fitting"], online: true },

  // Tutors
  { id: 2, category: "tutor", name: "Priya Sharma", initials: "PS", role: "Home Tutor", location: "Lajpat Nagar, Delhi", distance: "3.4 km", rating: 4.8, reviews: 88, jobs: 210, price: "₹350/hr", avatar: "avatar-purple", tags: ["Maths", "Science", "Class 9–12"], online: true },
  { id: 12, category: "tutor", name: "Amitabh Banerjee", initials: "AB", role: "Physics & Chemistry Tutor", location: "CR Park, Delhi", distance: "4.9 km", rating: 4.9, reviews: 94, jobs: 240, price: "₹450/hr", avatar: "avatar-blue", tags: ["JEE Prep", "Class 11-12", "CBSE/ICSE"], online: true },
  { id: 17, category: "tutor", name: "Neha Gupta", initials: "NG", role: "English & Primary Tutor", location: "Dwarka, Delhi", distance: "2.8 km", rating: 4.9, reviews: 110, jobs: 290, price: "₹300/hr", avatar: "avatar-pink", tags: ["Primary School", "Spoken English", "All Subjects"], online: true },

  // Electricians
  { id: 3, category: "electrician", name: "Mohammed Salim", initials: "MS", role: "Electrician", location: "Chandni Chowk, Delhi", distance: "4.0 km", rating: 4.7, reviews: 96, jobs: 280, price: "₹360/hr", avatar: "avatar-orange", tags: ["Wiring", "MCB", "CCTV"], online: false },
  { id: 7, category: "electrician", name: "Vikram Malhotra", initials: "VM", role: "Master Electrician", location: "Connaught Place, Delhi", distance: "1.8 km", rating: 4.9, reviews: 112, jobs: 410, price: "₹390/hr", avatar: "avatar-orange", tags: ["Inverter Repair", "Short Circuit", "AC Wiring"], online: true },
  { id: 18, category: "electrician", name: "Rakesh Sharma", initials: "RS", role: "Commercial & Home Electrician", location: "Preet Vihar, Delhi", distance: "3.2 km", rating: 4.8, reviews: 74, jobs: 180, price: "₹350/hr", avatar: "avatar-yellow", tags: ["Fan Installation", "Panel Board", "LED Lights"], online: true },

  // Caregivers
  { id: 4, category: "caregiver", name: "Sunita Devi", initials: "SD", role: "Caregiver & Cook", location: "Rohini, Delhi", distance: "5.2 km", rating: 5.0, reviews: 67, jobs: 150, price: "₹320/hr", avatar: "avatar-pink", tags: ["Elderly Care", "Cooking", "Child Care"], online: true },
  { id: 13, category: "caregiver", name: "Ritu Saxena", initials: "RS", role: "Senior Caregiver & Nurse", location: "Pitampura, Delhi", distance: "4.2 km", rating: 5.0, reviews: 82, jobs: 175, price: "₹380/hr", avatar: "avatar-pink", tags: ["Post-Op Care", "BP & Sugar Check", "Palliative"], online: true },

  // Cleaning
  { id: 9, category: "cleaning", name: "Meena Kumari", initials: "MK", role: "Home Cleaning Specialist", location: "Mayur Vihar, Delhi", distance: "4.5 km", rating: 4.9, reviews: 130, jobs: 310, price: "₹290/hr", avatar: "avatar-pink", tags: ["Deep Cleaning", "Kitchen Sanitization", "Sofa Care"], online: true },
  { id: 19, category: "cleaning", name: "Asha Rani", initials: "AR", role: "Housekeeping & Deep Cleaner", location: "Saket, Delhi", distance: "3.1 km", rating: 4.8, reviews: 92, jobs: 260, price: "₹280/hr", avatar: "avatar-green", tags: ["Full House", "Bathroom Scrubbing", "Balcony"], online: true },

  // Tech Support
  { id: 6, category: "tech", name: "Kavitha Rajan", initials: "KR", role: "Tech Support", location: "Saket, Delhi", distance: "3.8 km", rating: 4.8, reviews: 71, jobs: 130, price: "₹300/hr", avatar: "avatar-green", tags: ["WiFi", "Laptop", "Smart TV"], online: true },
  { id: 15, category: "tech", name: "Alok Gupta", initials: "AG", role: "IT & Network Tech Support", location: "Noida Sec 18, NCR", distance: "6.8 km", rating: 4.9, reviews: 115, jobs: 320, price: "₹350/hr", avatar: "avatar-green", tags: ["Router Setup", "OS Install", "Printer Repair"], online: true },

  // Carpenters
  { id: 5, category: "carpenter", name: "Arjun Meena", initials: "AM", role: "Carpenter", location: "Dwarka, Delhi", distance: "6.1 km", rating: 4.6, reviews: 54, jobs: 180, price: "₹420/hr", avatar: "avatar-teal", tags: ["Furniture", "Modular", "Repair"], online: false },
  { id: 14, category: "carpenter", name: "Harpreet Singh", initials: "HS", role: "Custom Carpenter", location: "Tilak Nagar, Delhi", distance: "5.5 km", rating: 4.7, reviews: 49, jobs: 160, price: "₹450/hr", avatar: "avatar-orange", tags: ["Wardrobes", "Door Fitting", "Polishing"], online: true },

  // Painters
  { id: 10, category: "painter", name: "Ramesh Chand", initials: "RC", role: "Interior Painter", location: "Janakpuri, Delhi", distance: "5.0 km", rating: 4.8, reviews: 79, jobs: 220, price: "₹400/hr", avatar: "avatar-purple", tags: ["Wall Painting", "Texture", "Waterproofing"], online: true },
  { id: 20, category: "painter", name: "Anil Paswan", initials: "AP", role: "Exterior & Waterproof Painter", location: "Uttam Nagar, Delhi", distance: "4.7 km", rating: 4.7, reviews: 63, jobs: 140, price: "₹370/hr", avatar: "avatar-blue", tags: ["Exterior", "Primer", "Putty Finish"], online: true },

  // Drivers
  { id: 11, category: "driver", name: "Sanjay Yadav", initials: "SY", role: "Local Driver & Chauffeur", location: "Vasant Kunj, Delhi", distance: "2.9 km", rating: 4.8, reviews: 105, jobs: 290, price: "₹300/hr", avatar: "avatar-teal", tags: ["Outstation", "City Transfer", "Automatic/Manual"], online: true },
  { id: 21, category: "driver", name: "Gurdeep Singh", initials: "GS", role: "Personal & Commercial Driver", location: "Rajouri Garden, Delhi", distance: "3.8 km", rating: 4.9, reviews: 128, jobs: 350, price: "₹320/hr", avatar: "avatar-orange", tags: ["SUV Specialist", "Airport Drop", "Hourly Hire"], online: true },
];

const VOTES = [
  { id: 1, title: "Increase worker welfare fund by 1%", desc: "Proposal to raise cooperative fee by 1% and allocate entirely to health insurance pool.", yes: 68, no: 32, status: "active", ends: "3 days left" },
  { id: 2, title: "Launch SahayogSeva in Tier-3 cities", desc: "Expand platform to 50 new districts in UP, Bihar & Rajasthan by Q1 2026.", yes: 84, no: 16, status: "active", ends: "7 days left" },
  { id: 3, title: "Add Mental Health Counselling category", desc: "Onboard licensed counsellors as cooperative members to serve community mental health needs.", yes: 91, no: 9, status: "passed", ends: "Passed" },
];

const TESTIMONIALS = [
  { quote: "As a widowed mother, I was scared to hire strangers. SahayogSeva gave me trust — the plumber was co-op verified and so respectful. I felt safe.", name: "Geeta Nair", role: "Homemaker, Thiruvananthapuram", initials: "GN", avatar: "avatar-pink" },
  { quote: "I earned 92% of every booking — that's never happened in 10 years of gig work. The cooperative model actually puts workers first!", name: "Suresh Patel", role: "Electrician & Co-op Member", initials: "SP", avatar: "avatar-orange" },
  { quote: "The Ministry of Cooperation's backing means this isn't just another app. It genuinely empowers local communities. Brilliant initiative.", name: "Dr. Ananya Singh", role: "Social Economist, JNU", initials: "AS", avatar: "avatar-blue" },
];

const BOOKINGS_DATA = [
  { id: 1, icon: "🔧", name: "Rajesh Kumar", service: "Plumbing", date: "Today, 4:00 PM", amount: "₹760", status: "upcoming" },
  { id: 2, icon: "📚", name: "Priya Sharma", service: "Tuition — Maths", date: "Yesterday, 5:30 PM", amount: "₹700", status: "done" },
  { id: 3, icon: "🧹", name: "Cleaning Team", service: "Deep Cleaning", date: "2 days ago", amount: "₹1,200", status: "done" },
  { id: 4, icon: "⚡", name: "Mohammed Salim", service: "Electrical Work", date: "Sep 8, 11:00 AM", amount: "₹540", status: "pending" },
];

// =============================================
// HOOKS
// =============================================
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// =============================================
// UTILITIES
// =============================================
const Stars = ({ rating, max = 5 }) => (
  <div className="stars">
    {Array.from({ length: max }, (_, i) => (
      <span key={i} className={`star ${i < Math.round(rating) ? "" : "empty"}`}>★</span>
    ))}
  </div>
);

// =============================================
// COMPONENTS
// =============================================
// =============================================
// GOVT HEADER TOP BAR & UTILITIES
// =============================================
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
          ? "सहकारिता मंत्रालय, भारत सरकार द्वारा पंजीकृत राष्ट्रीय बहु-राज्य सहकारी मंच। 2,400+ सत्यापित सदस्य ऑनबोर्ड।"
          : "Registered National Multi-State Cooperative Platform under Ministry of Cooperation, Govt. of India. 2,400+ Verified Members."}
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

function Navbar({ onNav, activeView, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <GovtTopBar lang={lang} setLang={setLang} />
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <a className="brand" href="#" onClick={() => onNav("home")}>
            <Logo lang={lang} />
          </a>

          <ul className="nav-links">
            <li><a href="#services">{lang === "hi" ? "सेवाएँ" : "Services"}</a></li>
            <li><a href="#how">{lang === "hi" ? "प्रक्रिया" : "How it works"}</a></li>
            <li><a href="#cooperative">{lang === "hi" ? "सहकारी मॉडल" : "Cooperative"}</a></li>
            <li><a href="#providers">{lang === "hi" ? "सेवा प्रदाता" : "Providers"}</a></li>
            <li><a href="#impact">{lang === "hi" ? "प्रभाव" : "Impact"}</a></li>
          </ul>

          <div className="nav-actions">
            <button className="btn btn-ghost" onClick={() => setModalOpen("login")}>
              {lang === "hi" ? "लॉग इन" : "Log in"}
            </button>
            <button className="btn btn-primary" onClick={() => setModalOpen("signup")}>
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
            <a href="#services" onClick={() => setMenuOpen(false)}>🔧 {lang === "hi" ? "सेवाएँ" : "Services"}</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>📋 {lang === "hi" ? "प्रक्रिया" : "How It Works"}</a>
            <a href="#cooperative" onClick={() => setMenuOpen(false)}>🤝 {lang === "hi" ? "सहकारी मॉडल" : "Cooperative"}</a>
            <a href="#providers" onClick={() => setMenuOpen(false)}>👥 {lang === "hi" ? "सेवा प्रदाता" : "Providers"}</a>
            <a href="#impact" onClick={() => setMenuOpen(false)}>📊 {lang === "hi" ? "प्रभाव" : "Impact"}</a>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setModalOpen("login"); setMenuOpen(false); }}>
                {lang === "hi" ? "लॉग इन" : "Log in"}
              </button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setModalOpen("signup"); setMenuOpen(false); }}>
                {lang === "hi" ? "पंजीकरण" : "Get started"}
              </button>
            </div>
          </div>
        )}
      </nav>

      {modalOpen && (
        <AuthModal type={modalOpen} onClose={() => setModalOpen(null)} onSwitch={(t) => setModalOpen(t)} />
      )}
    </>
  );
}

function AuthModal({ type, onClose, onSwitch }) {
  const isLogin = type === "login";
  const [role, setRole] = useState("household");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
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
                <button className={`tab ${role === "household" ? "active" : ""}`} style={{ flex: 1 }} onClick={() => setRole("household")}>🏠 Household</button>
                <button className={`tab ${role === "provider" ? "active" : ""}`} style={{ flex: 1 }} onClick={() => setRole("provider")}>🛠️ Service Provider</button>
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="e.g. Priya Sharma" />
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

          {!isLogin && role === "provider" && (
            <div className="form-group">
              <label className="form-label">Service Category</label>
              <select className="form-input form-select">
                {SERVICES.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.title}</option>)}
              </select>
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">District / City</label>
              <input type="text" className="form-input" placeholder="e.g. New Delhi" />
            </div>
          )}
        </div>
        <div className="modal-footer" style={{ flexDirection: "column", gap: "0.75rem" }}>
          <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={onClose}>
            {isLogin ? "Log in →" : "Create Account →"}
          </button>
          <div style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--slate-400)" }}>
            {isLogin ? "New here?" : "Already a member?"}{" "}
            <span style={{ color: "var(--emerald-400)", cursor: "pointer", fontWeight: 600 }} onClick={() => onSwitch(isLogin ? "signup" : "login")}>
              {isLogin ? "Join the cooperative" : "Log in"}
            </span>
          </div>
          {!isLogin && (
            <p style={{ fontSize: "0.72rem", color: "var(--slate-500)", textAlign: "center", lineHeight: 1.6 }}>
              By joining, you agree to our cooperative bylaws under the Ministry of Cooperation, Govt. of India.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function BookingModal({ provider, onClose }) {
  const slots = ["Today · 2:00 PM", "Today · 4:30 PM", "Tomorrow · 9:00 AM", "Tomorrow · 11:00 AM"];
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [step, setStep] = useState(1);

  if (step === 2) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="india-bar" />
        <div style={{ padding: "3rem 2rem", textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem" }}>Booking Confirmed!</div>
          <div style={{ color: "var(--slate-400)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            {provider.name} will arrive at {slots[selectedSlot]}
          </div>
          <div style={{ padding: "1rem", background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "var(--radius)", marginBottom: "1.5rem", fontSize: "0.82rem", color: "var(--slate-300)" }}>
            💚 92% of your payment goes directly to {provider.name}. The 8% co-op fee funds member welfare & training.
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={onClose}>
            Done ✓
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="india-bar" />
        <div className="modal-header">
          <div className="modal-title">Book Service</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "var(--bg-card)", borderRadius: "var(--radius)", marginBottom: "1.25rem" }}>
            <div className={`avatar ${provider.avatar}`} style={{ width: 48, height: 48, borderRadius: 12, fontSize: "1rem" }}>
              {provider.initials}
              <div className="verified-dot">✓</div>
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{provider.name}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--emerald-400)", fontWeight: 600 }}>{provider.role}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--slate-400)" }}>{provider.location} · {provider.distance}</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontWeight: 700, color: "var(--emerald-400)" }}>{provider.price}</div>
              <div style={{ fontSize: "0.7rem", color: "var(--slate-400)" }}>Co-op verified</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Address</label>
            <input type="text" className="form-input" placeholder="House / Flat no., Street, Area" />
          </div>

          <div className="form-group">
            <label className="form-label">Describe the work</label>
            <textarea className="form-input" rows="3" placeholder="e.g. Kitchen tap leaking, need urgent fix..." style={{ resize: "vertical" }} />
          </div>

          <div className="form-group">
            <label className="form-label">Choose a time slot</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              {slots.map((s, i) => (
                <button key={i} onClick={() => setSelectedSlot(i)}
                  style={{
                    padding: "10px 14px", borderRadius: "var(--radius)", border: `1.5px solid ${selectedSlot === i ? "var(--emerald-500)" : "var(--border)"}`,
                    background: selectedSlot === i ? "rgba(16,185,129,0.1)" : "var(--bg-card)",
                    color: selectedSlot === i ? "var(--emerald-400)" : "var(--slate-300)",
                    fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s"
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: "1rem", background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "var(--radius)", fontSize: "0.8rem" }}>
            <div style={{ fontWeight: 700, marginBottom: "0.5rem", color: "var(--emerald-400)" }}>💡 Cooperative Transparency</div>
            <div style={{ color: "var(--slate-300)" }}>92% goes to the worker. 8% flat cooperative fee supports member welfare & platform costs. No hidden charges.</div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 2, justifyContent: "center" }} onClick={() => setStep(2)}>
            Confirm Booking →
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================
// SECTIONS
// =============================================
function HeroSection({ onBook }) {
  const [query, setQuery] = useState("");
  const [stateLocation, setStateLocation] = useState("Select State");
  const [notice, setNotice] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      setNotice(`🔍 Searching for "${query}" in ${stateLocation}...`);
      setTimeout(() => setNotice(""), 3000);
    }
  };

  return (
    <section className="hero" id="top">
      <div className="hero-bg" />
      <div className="hero-grid" />

      {notice && <NoticeBanner message={notice} onClose={() => setNotice("")} />}

      <div className="hero-inner">
        {/* Left copy */}
        <div>
          <div className="hero-badge">
            <div className="dot" />
            Ministry of Cooperation · Govt. of India Initiative
          </div>

          <h1>
            Local services,<br />
            <span className="accent">community owned,</span><br />
            <span className="saffron">workers empowered.</span>
          </h1>

          <p className="hero-desc">
            SahayogSeva is India's first cooperative gig marketplace — connecting households with trusted
            local plumbers, tutors, caregivers & more, where every worker earns fairly and every community
            has a stake.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>
              Find a Service →
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => document.getElementById("cooperative")?.scrollIntoView({ behavior: "smooth" })}>
              Learn the Model
            </button>
          </div>

          <div className="hero-trust">
            <div className="trust-chip">
              <span className="chip-icon">✅</span> Government Registered
            </div>
            <div className="trust-chip">
              <span className="chip-icon">🔒</span> ID & Skill Verified
            </div>
            <div className="trust-chip">
              <span className="chip-icon">💚</span> 92% to Workers
            </div>
          </div>

          {/* Search bar */}
          <div className="search-bar-wrap" style={{ maxWidth: "100%", marginTop: "2.5rem" }}>
            <div className="search-bar">
              <span className="search-bar-icon">⌕</span>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Search for a service... e.g. Plumber, Tutor"
              />
              <div className="search-divider" />
              <select
                className="search-location-select"
                value={stateLocation}
                onChange={e => setStateLocation(e.target.value)}
              >
                <option value="Select State">📍 Select State</option>
                <option value="Delhi NCR">📍 Delhi NCR</option>
                <option value="Uttar Pradesh">📍 Uttar Pradesh</option>
                <option value="Maharashtra">📍 Maharashtra</option>
                <option value="Bihar">📍 Bihar</option>
                <option value="Karnataka">📍 Karnataka</option>
                <option value="West Bengal">📍 West Bengal</option>
                <option value="Tamil Nadu">📍 Tamil Nadu</option>
                <option value="Rajasthan">📍 Rajasthan</option>
                <option value="Gujarat">📍 Gujarat</option>
                <option value="Punjab">📍 Punjab</option>
                <option value="Haryana">📍 Haryana</option>
                <option value="Madhya Pradesh">📍 Madhya Pradesh</option>
              </select>
              <button className="btn btn-primary" style={{ borderRadius: "var(--radius-full)", padding: "8px 20px" }} onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Right visual */}
        <div className="hero-visual">
          <div style={{ position: "relative" }}>
            <div className="hero-card-main">
              <div className="card-header">
                <div className="card-header-icon">🔧</div>
                <div className="card-header-text">
                  <strong>Plumbers nearby</strong>
                  <span>3 available · New Delhi</span>
                </div>
              </div>
              <div className="provider-list">
                {[
                  { name: "Rajesh Kumar", loc: "Karol Bagh · 2.1 km", price: "₹380/hr", avatar: "avatar-blue", initials: "RK", r: 4.9 },
                  { name: "Deepak Verma", loc: "Paharganj · 3.5 km", price: "₹340/hr", avatar: "avatar-green", initials: "DV", r: 4.7 },
                ].map((p, i) => (
                  <div className="provider-row" key={i} onClick={() => onBook(PROVIDERS[0])}>
                    <div className={`avatar ${p.avatar}`}>
                      {p.initials}
                      <div className="verified-dot">✓</div>
                    </div>
                    <div className="provider-info">
                      <div className="provider-name">{p.name}</div>
                      <div className="provider-meta">{p.loc}</div>
                    </div>
                    <div className="provider-right">
                      <Stars rating={p.r} />
                      <div className="price-tag">{p.price}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="book-slot">
                <div className="slot-info">
                  <small>📅 Next slot</small>
                  <strong>Today · 4:00 PM</strong>
                </div>
                <button className="slot-btn" onClick={() => onBook(PROVIDERS[0])}>Book Now</button>
              </div>
            </div>

            <div className="float-badge float-badge-1">
              <span className="fb-icon">💚</span>
              <div className="fb-text">
                <strong>92%</strong>
                <small>to the worker</small>
              </div>
            </div>
            <div className="float-badge float-badge-2">
              <span className="fb-icon">🏛️</span>
              <div className="fb-text">
                <strong>Govt. Backed</strong>
                <small>Ministry of Cooperation</small>
              </div>
            </div>
            <div className="float-badge float-badge-3">
              <span className="fb-icon">⭐</span>
              <div className="fb-text">
                <strong>4.8 avg</strong>
                <small>18,600+ reviews</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ icon, iconClass, end, suffix, label }) {
  const [ref, inView] = useInView(0.3);
  const count = useCountUp(end, 2000, inView);
  return (
    <div className="stat-item" ref={ref}>
      <div className={`stat-icon-box ${iconClass}`}>{icon}</div>
      <div>
        <div className="stat-num">{count.toLocaleString("en-IN")}{suffix}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function StatsStrip() {
  return (
    <div className="stats-strip">
      <div className="stats-inner">
        <StatItem icon="🛠️" iconClass="icon-green" end={2400} suffix="+" label="Verified Co-op Members" />
        <StatItem icon="🏠" iconClass="icon-saffron" end={18600} suffix="+" label="Households Served" />
        <StatItem icon="🏘️" iconClass="icon-blue" end={64} suffix="" label="Village Cooperatives" />
        <StatItem icon="💚" iconClass="icon-purple" end={92} suffix="%" label="Fair Wage to Workers" />
      </div>
    </div>
  );
}

function ServicesSection({ onSelectService }) {
  const [active, setActive] = useState(null);
  const [showAllModal, setShowAllModal] = useState(false);

  const ALL_CATEGORIES = [
    { emoji: "🔧", name: "Plumbers" }, { emoji: "📚", name: "Tutors" }, { emoji: "❤️", name: "Caregivers" },
    { emoji: "⚡", name: "Electricians" }, { emoji: "🧹", name: "Home Cleaning" }, { emoji: "💻", name: "Tech Support" },
    { emoji: "🪚", name: "Carpenters" }, { emoji: "🖌️", name: "Painters" }, { emoji: "🚗", name: "Local Drivers" },
    { emoji: "🪴", name: "Gardeners" }, { emoji: "🧱", name: "Masons" }, { emoji: "🍳", name: "Cooks & Chefs" },
    { emoji: "🧵", name: "Tailors" }, { emoji: "🔒", name: "Security Guards" }, { emoji: "🪟", name: "Window Cleaners" },
    { emoji: "❄️", name: "AC Service" }, { emoji: "📺", name: "Appliance Repair" }, { emoji: "📦", name: "Packers & Movers" },
    { emoji: "🐕", name: "Pet Care" }, { emoji: "💄", name: "Beauticians" }, { emoji: "🧘", name: "Yoga Trainers" },
    { emoji: "📸", name: "Photographers" }, { emoji: "☀️", name: "Solar Panel Fixers" }, { emoji: "💧", name: "RO Water Repair" }
  ];

  return (
    <section className="section" id="services">
      <div className="section-inner">
        <div className="section-header">
          <div>
            <div className="section-label">Services</div>
            <div className="section-title">Every service your community needs</div>
            <div className="section-desc">All providers are cooperative members — ID verified, skill-tested and community-rated.</div>
          </div>
          <button className="btn btn-ghost" onClick={() => setShowAllModal(true)}>View all 24 categories →</button>
        </div>

        <div className="services-grid">
          {SERVICES.map((s) => (
            <button
              className={`service-card${active === s.id ? " active" : ""}`}
              key={s.id}
              id={`service-${s.id}`}
              onClick={() => { setActive(s.id); onSelectService(s); }}
            >
              <div className="service-emoji-box" style={{ background: `${s.color}18` }}>
                {s.emoji}
              </div>
              <div className="service-content">
                <div className="service-title">{s.title}</div>
                <div className="service-text">{s.text}</div>
                <div className="service-count">{s.count}</div>
              </div>
              <div className="service-arrow">›</div>
            </button>
          ))}
        </div>
      </div>

      {showAllModal && (
        <div className="modal-overlay" onClick={() => setShowAllModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div className="india-bar" />
            <div className="modal-header">
              <div className="modal-title">All 24 Service Categories</div>
              <button className="modal-close" onClick={() => setShowAllModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
              {ALL_CATEGORIES.map((c, i) => (
                <div key={i} style={{ padding: "10px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", cursor: "pointer" }}
                     onClick={() => { setShowAllModal(false); onSelectService({ emoji: c.emoji, title: c.name }); }}>
                  <span>{c.emoji}</span>
                  <span style={{ fontWeight: 600 }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", icon: "🔍", title: "Find a Verified Member", text: "Browse cooperative-certified workers in your locality. Every provider is ID verified and skill tested by the local co-op chapter." },
    { n: "02", icon: "📅", title: "Book & Get It Done", text: "Choose a time, describe your need, and confirm. Real-time updates keep you informed. Full transparency on pricing — no surprise fees." },
    { n: "03", icon: "🤝", title: "Everyone Prospers", text: "The worker keeps 92%. Your rating improves the community. The co-op fee funds member welfare — healthcare, insurance & training." },
  ];

  return (
    <section className="section how-section" id="how">
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>How It Works</div>
          <div className="section-title">Simple, transparent, fair.</div>
          <div className="section-desc" style={{ margin: "0 auto" }}>Built on cooperative principles, not corporate extraction.</div>
        </div>
        <div className="steps-grid">
          {steps.map((s) => (
            <div className="step-card" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div className="step-icon">{s.icon}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-text">{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProvidersSection({ onBook, selectedCategoryId, onSelectCategory }) {
  const [filter, setFilter] = useState("all");

  const CATEGORY_TABS = [
    { id: "all", emoji: "👥", label: "All Members" },
    { id: "plumber", emoji: "🔧", label: "Plumbers" },
    { id: "electrician", emoji: "⚡", label: "Electricians" },
    { id: "tutor", emoji: "📚", label: "Tutors" },
    { id: "caregiver", emoji: "❤️", label: "Caregivers" },
    { id: "cleaning", emoji: "🧹", label: "Home Cleaning" },
    { id: "tech", emoji: "💻", label: "Tech Support" },
    { id: "carpenter", emoji: "🪚", label: "Carpenters" },
    { id: "painter", emoji: "🖌️", label: "Painters" },
    { id: "driver", emoji: "🚗", label: "Local Drivers" },
  ];

  const currentCatId = selectedCategoryId || "all";

  const filtered = PROVIDERS.filter(p => {
    // 1. Exact Category Filter
    if (currentCatId !== "all") {
      if (p.category !== currentCatId) return false;
    }
    // 2. Status Filter
    if (filter === "online") return p.online;
    if (filter === "top") return p.rating >= 4.8;
    return true;
  });

  const activeCategoryObj = CATEGORY_TABS.find(c => c.id === currentCatId);

  return (
    <section className="section" id="providers">
      <div className="section-inner">
        <div className="section-header">
          <div>
            <div className="section-label">Verified Service Providers</div>
            <div className="section-title">
              {currentCatId !== "all" && activeCategoryObj
                ? `${activeCategoryObj.emoji} ${activeCategoryObj.label} Only`
                : "Meet your community providers"}
            </div>
            <div className="section-desc">
              {currentCatId !== "all"
                ? `Showing verified ${activeCategoryObj?.label} in your area.`
                : "Every professional is a co-op member with verified ID, skills & background check."}
            </div>
          </div>
          {currentCatId !== "all" && (
            <button className="btn btn-outline" onClick={() => onSelectCategory("all")}>
              Show All Categories ✕
            </button>
          )}
        </div>

        {/* Category Pills Row (Uber / UrbanCompany style) */}
        <div style={{
          display: "flex",
          gap: "0.6rem",
          overflowX: "auto",
          paddingBottom: "0.75rem",
          marginBottom: "1.25rem",
          scrollbarWidth: "thin"
        }}>
          {CATEGORY_TABS.map(cat => {
            const isActive = currentCatId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: isActive ? "2px solid #0c831f" : "1px solid var(--border)",
                  background: isActive ? "#0c831f" : "var(--bg-card)",
                  color: isActive ? "#ffffff" : "var(--slate-200)",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease"
                }}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status filters: All, Online, Top Rated */}
        <div className="filter-tabs" style={{ marginBottom: "1.5rem" }}>
          {[["all","All Statuses"],["online","🟢 Online Now"],["top","⭐ Top Rated (4.8+)"]].map(([key, label]) => (
            <button key={key} className={`filter-tab${filter === key ? " active" : ""}`} onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔎</div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>No providers found in this category</div>
            <div style={{ color: "var(--slate-400)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Try resetting your category filter to view all verified members.</div>
            <button className="btn btn-primary" style={{ marginTop: "1rem" }} onClick={() => onSelectCategory("all")}>Show All Categories</button>
          </div>
        ) : (
          <div className="providers-grid">
            {filtered.map((p) => (
              <div className="provider-card" key={p.id} id={`provider-${p.id}`}>
                <div className="provider-card-header">
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div className={`provider-avatar-lg ${p.avatar}`}>
                      {p.initials}
                      <div className="pcard-verified">✓</div>
                    </div>
                    {p.online && <div className="online-dot" title="Online Now" />}
                  </div>
                  <div>
                    <div className="pcard-name">{p.name}</div>
                    <div className="pcard-role">{p.role}</div>
                    <div className="pcard-location">📍 {p.location} · {p.distance}</div>
                  </div>
                </div>
                <div className="provider-card-body">
                  <div className="pcard-stats">
                    <div className="pcard-stat">
                      <span className="pcard-stat-val">⭐ {p.rating}</span>
                      <span className="pcard-stat-key">Rating</span>
                    </div>
                    <div className="pcard-stat">
                      <span className="pcard-stat-val">{p.reviews}</span>
                      <span className="pcard-stat-key">Reviews</span>
                    </div>
                    <div className="pcard-stat">
                      <span className="pcard-stat-val">{p.jobs}</span>
                      <span className="pcard-stat-key">Jobs done</span>
                    </div>
                  </div>
                  <div className="pcard-tags">
                    {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <div style={{ flex: 1, textAlign: "center", padding: "6px 0", borderRadius: "var(--radius-sm)", background: "var(--bg-card)", fontSize: "0.8rem", fontWeight: 700, color: "var(--emerald-400)" }}>
                      {p.price}
                    </div>
                    <button className="btn btn-primary" style={{ flex: 2, justifyContent: "center", padding: "8px 16px", borderRadius: "var(--radius-sm)", fontSize: "0.82rem" }} onClick={() => onBook(p)}>
                      Book Now →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CooperativeSection() {
  const principles = [
    { n: 1, title: "Democratic Member Control", desc: "One member, one vote. Every registered cooperative member participates in decisions about platform policies, fees, and leadership." },
    { n: 2, title: "Fair Wage Distribution", desc: "Only a flat 8% cooperative fee is deducted per booking. 92% is paid directly to the worker — far above the 25-40% taken by corporate platforms." },
    { n: 3, title: "Community Ownership", desc: "Workers and household members are co-owners. Profits are re-invested in member welfare: health insurance, upskilling, and pension funds." },
    { n: 4, title: "Government Accountability", desc: "Registered under the Multi-State Cooperative Societies Act and backed by the Ministry of Cooperation, ensuring regulatory compliance and trust." },
  ];

  return (
    <section className="section coop-section" id="cooperative">
      <div className="section-inner">
        <div className="coop-grid">
          <div>
            <div className="section-label">The Cooperative Model</div>
            <div className="section-title">A platform built<br />for — and by — people.</div>
            <p style={{ color: "var(--slate-400)", margin: "1rem 0 2rem", lineHeight: 1.7, fontSize: "0.95rem" }}>
              Unlike corporate gig platforms that extract value from workers, SahayogSeva is structured
              as a multi-stakeholder cooperative. Workers are members, not vendors. Communities are
              owners, not just customers.
            </p>
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
      </div>
    </section>
  );
}

// ---- IMPACT SECTION ----
function ImpactSection() {
  const [ref, inView] = useInView(0.15);
  const earning = useCountUp(92, 1800, inView);
  const members = useCountUp(2400, 2000, inView);
  const villages = useCountUp(64, 1800, inView);
  const bookings = useCountUp(47800, 2200, inView);

  return (
    <section className="section" id="impact" ref={ref} style={{ background: "rgba(255,255,255,0.01)" }}>
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Live Platform Impact</div>
          <div className="section-title">Real numbers. Real change.</div>
          <div className="section-desc" style={{ margin: "0 auto" }}>
            Every booking on SahayogSeva directly improves livelihoods, not corporate balance sheets.
          </div>
        </div>

        <div className="impact-grid">
          <div className="impact-card-highlight">
            <div className="impact-big">{earning}%</div>
            <div className="impact-label">Worker Earnings Share</div>
            <div className="impact-sub">vs ~65% on Urbancompany, Ola, Swiggy</div>
            <div className="impact-bar-wrap">
              <div className="impact-bar-row-label"><span>SahayogSeva</span><span style={{ color: "var(--emerald-400)" }}>{earning}%</span></div>
              <div className="impact-bar"><div className="impact-bar-fill" style={{ width: `${earning}%` }} /></div>
              <div className="impact-bar-row-label"><span>Corporate platforms</span><span style={{ color: "#ef4444" }}>~65%</span></div>
              <div className="impact-bar"><div className="impact-bar-fill" style={{ width: "65%", background: "linear-gradient(90deg, #ef4444, #dc2626)" }} /></div>
            </div>
          </div>

          <div className="impact-stats-col">
            {[
              { icon: "🛠️", cls: "icon-green", num: `${members.toLocaleString("en-IN")}+`, label: "Verified Co-op Members" },
              { icon: "🏘️", cls: "icon-saffron", num: villages, label: "Village Cooperatives Active" },
              { icon: "📋", cls: "icon-blue", num: `${bookings.toLocaleString("en-IN")}+`, label: "Total Bookings Completed" },
              { icon: "💰", cls: "icon-purple", num: "₹4.2 Cr+", label: "Paid Out to Workers" },
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

        <div className="sdg-strip">
          <div className="sdg-title">Contributing to UN SDGs</div>
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
    </section>
  );
}

// ---- GOVERNANCE / VOTING SECTION ----
function GovernanceSection() {
  const [votes, setVotes] = useState(VOTES.map(v => ({ ...v, myVote: null })));

  const handleVote = (id, choice) => {
    setVotes(prev => prev.map(v =>
      v.id === id && !v.myVote ? { ...v, myVote: choice,
        yes: choice === "yes" ? v.yes + 1 : v.yes,
        no: choice === "no" ? v.no + 1 : v.no
      } : v
    ));
  };

  return (
    <section className="section" id="governance" style={{ background: "rgba(255,255,255,0.015)" }}>
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Democratic Governance</div>
          <div className="section-title">Every member has a voice.</div>
          <div className="section-desc" style={{ margin: "0 auto" }}>
            Active proposals open for co-op member vote. One member, one vote — no corporate override.
          </div>
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
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="section" style={{ background: "rgba(255,255,255,0.015)" }}>
      <div className="section-inner">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div className="section-label" style={{ justifyContent: "center" }}>Testimonials</div>
          <div className="section-title">Real voices, real impact</div>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="testimonial-quote">"</div>
              <div className="testimonial-text">{t.quote}</div>
              <div className="testimonial-footer">
                <div className={`avatar ${t.avatar}`} style={{ width: 40, height: 40, borderRadius: 10, fontSize: "0.8rem", flexShrink: 0 }}>
                  {t.initials}
                </div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <div className="cta-section">
      <div className="cta-bg" />
      <div className="cta-inner">
        <div className="cta-badge">🇮🇳 Made for Bharat · Ministry of Cooperation</div>
        <div className="cta-title">Ready to join your local cooperative?</div>
        <div className="cta-desc">Whether you need a service or want to provide one, SahayogSeva is your community-owned platform. Fair wages. Local trust. Government backed.</div>
        <div className="cta-actions">
          <button className="btn btn-primary btn-lg">Find a Service →</button>
          <button className="btn btn-saffron btn-lg">Become a Provider</button>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p>
              India's first government-backed cooperative gig platform under the Ministry of Cooperation.
              Fair wages, community ownership, transparent governance.
            </p>
            <div className="govt-badge">
              🏛️ Ministry of Cooperation · Govt. of India
            </div>
          </div>
          <div>
            <div className="footer-col-title">Platform</div>
            <ul className="footer-links">
              <li><a href="#">Find Services</a></li>
              <li><a href="#">Become a Provider</a></li>
              <li><a href="#">Join a Co-op</a></li>
              <li><a href="#">Start a Chapter</a></li>
              <li><a href="#">Dashboard</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Cooperative</div>
            <ul className="footer-links">
              <li><a href="#">About the Model</a></li>
              <li><a href="#">Governance</a></li>
              <li><a href="#">Worker Welfare</a></li>
              <li><a href="#">Annual Reports</a></li>
              <li><a href="#">Member Elections</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Support</div>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Safety Guidelines</a></li>
              <li><a href="#">Dispute Resolution</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Grievance Portal</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-text">© 2026 SahayogSeva Cooperative Society · All rights reserved</div>
          <div className="govt-logos">
            <div className="govt-logo-chip">🇮🇳 Govt. of India</div>
            <div className="govt-logo-chip">🏛️ Ministry of Cooperation</div>
            <div className="govt-logo-chip">🤝 SIH 2024</div>
          </div>
        </div>
      </div>
      <div className="india-bar" style={{ marginTop: "1.5rem" }} />
    </footer>
  );
}

// =============================================
// DASHBOARD VIEW
// =============================================
function DashboardView({ onBack }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [mode, setMode] = useState("household");

  return (
    <div style={{ minHeight: "100vh", paddingTop: "68px" }}>
      <Navbar onNav={onBack} activeView="dashboard" />
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <div className="dash-greeting">Good evening 👋</div>
            <div className="dash-name">{mode === "household" ? "Ananya Singh" : "Rajesh Kumar"}</div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button className={`mode-toggle${mode === "household" ? " active" : ""}`} onClick={() => setMode("household")}>🏠 Household</button>
              <button className={`mode-toggle${mode === "provider" ? " active" : ""}`} onClick={() => setMode("provider")}>🛠️ Provider View</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div className="tabs">
              <button className={`tab${activeTab === "overview" ? " active" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
              <button className={`tab${activeTab === "bookings" ? " active" : ""}`} onClick={() => setActiveTab("bookings")}>Bookings</button>
              <button className={`tab${activeTab === "coop" ? " active" : ""}`} onClick={() => setActiveTab("coop")}>Co-op</button>
            </div>
            <button className="btn btn-ghost btn-icon">🔔</button>
          </div>
        </div>

        {mode === "household" ? (
          <>
            <div className="dash-grid">
              {[
                { icon: "📋", iconClass: "icon-green", val: "4", key: "Total Bookings", trend: "+2 this month", trendClass: "trend-up" },
                { icon: "💰", iconClass: "icon-saffron", val: "₹3,200", key: "Amount Spent", trend: "This month", trendClass: "trend-neutral" },
                { icon: "⭐", iconClass: "icon-blue", val: "4.9", key: "Avg Rating Given", trend: "12 reviews", trendClass: "trend-up" },
                { icon: "🤝", iconClass: "icon-purple", val: "Co-op", key: "Member Status", trend: "Active member", trendClass: "trend-up" },
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
                  <div className="dash-panel-title">Recent Bookings</div>
                  <button className="btn btn-ghost" style={{ padding: "4px 12px", fontSize: "0.78rem" }}>View all</button>
                </div>
                {BOOKINGS_DATA.map(b => (
                  <div className="booking-row" key={b.id}>
                    <div className="booking-service-icon">{b.icon}</div>
                    <div className="booking-info">
                      <div className="booking-name">{b.name}</div>
                      <div className="booking-meta">{b.service}</div>
                    </div>
                    <div className="booking-right">
                      <div className="booking-amount">{b.amount}</div>
                      <div className="booking-date">{b.date}</div>
                    </div>
                    <span className={`status-pill status-${b.status}`}>{b.status}</span>
                  </div>
                ))}
              </div>

              <div>
                <div className="dash-panel" style={{ marginBottom: "1rem" }}>
                  <div className="dash-panel-header">
                    <div className="dash-panel-title">Quick Book</div>
                  </div>
                  <div style={{ padding: "1rem" }}>
                    {SERVICES.slice(0, 5).map(s => (
                      <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "8px 10px", borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "background 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <span style={{ fontSize: "1.2rem" }}>{s.emoji}</span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, flex: 1 }}>{s.title}</span>
                        <span style={{ fontSize: "0.7rem", color: "var(--slate-400)" }}>{s.count.split(" ")[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dash-panel">
                  <div className="dash-panel-header">
                    <div className="dash-panel-title">Co-op Benefits</div>
                  </div>
                  <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {[
                      { icon: "🛡️", text: "Health Insurance Cover: ₹1 Lakh" },
                      { icon: "🎓", text: "3 Free Training Sessions/year" },
                      { icon: "🗳️", text: "Annual Member Vote — Oct 2025" },
                      { icon: "💰", text: "Dividend: ₹320 credited" },
                    ].map((b, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.82rem" }}>
                        <span>{b.icon}</span>
                        <span style={{ color: "var(--slate-300)" }}>{b.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ---- PROVIDER DASHBOARD ---- */
          <>
            <div className="dash-grid">
              {[
                { icon: "💰", iconClass: "icon-green", val: "₹13,400", key: "Earnings (Sep)", trend: "+34% vs Aug", trendClass: "trend-up" },
                { icon: "📋", iconClass: "icon-blue", val: "36", key: "Jobs This Month", trend: "+8 vs Aug", trendClass: "trend-up" },
                { icon: "⭐", iconClass: "icon-saffron", val: "4.9", key: "Your Rating", trend: "142 reviews", trendClass: "trend-up" },
                { icon: "🏅", iconClass: "icon-purple", val: "Top 5%", key: "Co-op Rank", trend: "Karol Bagh", trendClass: "trend-up" },
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
                {/* Earnings Bar Chart */}
                <div className="dash-panel" style={{ marginBottom: "1rem" }}>
                  <div className="dash-panel-header">
                    <div className="dash-panel-title">Monthly Earnings</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--emerald-400)", fontWeight: 700 }}>92% kept by you</div>
                  </div>
                  <div style={{ padding: "1.5rem 1.25rem" }}>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", height: 120 }}>
                      {[{month:"Jun",amt:8400},{month:"Jul",amt:11200},{month:"Aug",amt:9800},{month:"Sep",amt:13400}].map((e, i, arr) => (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ fontSize: "0.7rem", color: "var(--emerald-400)", fontWeight: 700 }}>₹{(e.amt/1000).toFixed(1)}k</div>
                          <div style={{
                            width: "100%",
                            height: `${(e.amt / 13400) * 90}px`,
                            background: i === arr.length - 1
                              ? "linear-gradient(180deg, var(--emerald-400), var(--emerald-600))"
                              : "rgba(52,211,153,0.25)",
                            borderRadius: "6px 6px 0 0",
                            border: i === arr.length - 1 ? "1px solid rgba(52,211,153,0.5)" : "none"
                          }} />
                          <div style={{ fontSize: "0.72rem", color: "var(--slate-400)" }}>{e.month}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Jobs */}
                <div className="dash-panel">
                  <div className="dash-panel-header">
                    <div className="dash-panel-title">Upcoming Jobs</div>
                    <span className="status-pill status-upcoming">2 scheduled</span>
                  </div>
                  {[
                    { icon: "🔧", client: "Ananya Singh", service: "Kitchen pipe repair", time: "Today, 4:00 PM", addr: "Karol Bagh", amt: "₹760" },
                    { icon: "🔧", client: "Ramesh Gupta", service: "Bathroom leakage", time: "Tomorrow, 10:00 AM", addr: "Paharganj", amt: "₹380" },
                  ].map((j, i) => (
                    <div className="booking-row" key={i}>
                      <div className="booking-service-icon">{j.icon}</div>
                      <div className="booking-info">
                        <div className="booking-name">{j.client}</div>
                        <div className="booking-meta">{j.service} · 📍 {j.addr}</div>
                      </div>
                      <div className="booking-right">
                        <div className="booking-amount">{j.amt}</div>
                        <div className="booking-date">{j.time}</div>
                      </div>
                      <button className="btn btn-primary" style={{ padding: "4px 12px", fontSize: "0.72rem", borderRadius: "6px" }}>Navigate</button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="dash-panel" style={{ marginBottom: "1rem" }}>
                  <div className="dash-panel-header">
                    <div className="dash-panel-title">Availability</div>
                  </div>
                  <div style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Online Status</span>
                      <div className="toggle-switch"><div className="toggle-knob active" /></div>
                    </div>
                    {["Mon","Tue","Wed","Thu","Fri","Sat"].map((d, i) => (
                      <div key={d} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: "0.8rem" }}>
                        <span style={{ color: "var(--slate-300)" }}>{d}</span>
                        <span style={{ color: i < 5 ? "var(--emerald-400)" : "var(--slate-500)", fontWeight: 600 }}>
                          {i < 5 ? "8:00 AM – 6:00 PM" : "Unavailable"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dash-panel">
                  <div className="dash-panel-header"><div className="dash-panel-title">Co-op Perks</div></div>
                  <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {[
                      { icon: "🛡️", text: "Health Insurance: ₹1 Lakh", done: true },
                      { icon: "🎓", text: "Training: 1/3 sessions used", done: false },
                      { icon: "🗳️", text: "Voted in last election", done: true },
                      { icon: "💰", text: "Dividend: ₹820 this year", done: true },
                    ].map((b, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.82rem" }}>
                        <span>{b.icon}</span>
                        <span style={{ color: b.done ? "var(--slate-300)" : "var(--slate-500)", flex: 1 }}>{b.text}</span>
                        {b.done && <span style={{ color: "var(--emerald-400)", fontSize: "0.75rem" }}>✓</span>}
                      </div>
                    ))}
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

// =============================================
// NOTICE SYSTEM
// =============================================
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

// =============================================
// APP ROOT
// =============================================
function App() {
  const [view, setView] = useState("home"); // home | dashboard
  const [notice, setNotice] = useState("");
  const [bookingProvider, setBookingProvider] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [lang, setLang] = useState("en"); // en | hi

  const showNotice = useCallback((msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 4000);
  }, []);

  const handleBook = useCallback((provider) => {
    setBookingProvider(provider);
  }, []);

  const handleSelectService = useCallback((service) => {
    setSelectedCategoryId(service.id);
    showNotice(`${service.emoji} Showing verified ${service.title} near you.`);
    document.getElementById("providers")?.scrollIntoView({ behavior: "smooth" });
  }, [showNotice]);

  if (view === "dashboard") {
    return (
      <div className="app">
        <DashboardView onBack={(v) => setView(v || "home")} lang={lang} setLang={setLang} />
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar onNav={(v) => setView(v)} activeView={view} lang={lang} setLang={setLang} />

      {notice && <NoticeBanner message={notice} onClose={() => setNotice("")} />}
      {bookingProvider && <BookingModal provider={bookingProvider} onClose={() => { setBookingProvider(null); showNotice(`✅ Booking confirmed with ${bookingProvider.name}! 92% goes to them.`); }} />}

      <main>
        <GovtTickerBar lang={lang} />
        <HeroSection onBook={handleBook} />
        <StatsStrip />
        <ServicesSection onSelectService={handleSelectService} />
        <HowItWorks />
        <ProvidersSection 
          onBook={handleBook} 
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(catId) => setSelectedCategoryId(catId)}
        />
        <CooperativeSection />
        <ImpactSection />
        <GovernanceSection />
        <TestimonialsSection />
        <CtaSection />
      </main>

      <Footer />

      {/* Mobile Bottom Nav */}
      <div className="bottom-nav">
        <button className="bottom-nav-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span>🏠</span><span>Home</span>
        </button>
        <button className="bottom-nav-btn" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>
          <span>🔍</span><span>Services</span>
        </button>
        <button className="bottom-nav-btn" onClick={() => document.getElementById("providers")?.scrollIntoView({ behavior: "smooth" })}>
          <span>👥</span><span>Providers</span>
        </button>
        <button className="bottom-nav-btn" onClick={() => setView("dashboard")}>
          <span>⊞</span><span>Dashboard</span>
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);