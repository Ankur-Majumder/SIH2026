import React, { useState } from "react";
import {
  SERVICES,
  PROVIDERS,
  DEFAULT_USER_LOCATION,
  calculateDistance,
  calculateETA,
  formatDistance,
} from "../data/mockData";

export function ServicesPage({ onBook, onTrackProvider, selectedCategoryId, onSelectCategory }) {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState({
    lat: DEFAULT_USER_LOCATION.lat,
    lng: DEFAULT_USER_LOCATION.lng,
    address: DEFAULT_USER_LOCATION.address,
    isGps: false,
  });
  const [gpsLoading, setGpsLoading] = useState(false);

  const currentCatId = selectedCategoryId || "all";

  // Filter providers by category, status, and search query
  const filteredProviders = PROVIDERS.filter((p) => {
    if (currentCatId !== "all" && p.category !== currentCatId) return false;
    if (filter === "online" && !p.online) return false;
    if (filter === "top" && p.rating < 4.8) return false;
    if (filter === "nearby") {
      const dist = calculateDistance(userLocation.lat, userLocation.lng, p.lat, p.lng);
      if (dist > 3.5) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchRole = p.role.toLowerCase().includes(q);
      const matchLoc = p.location.toLowerCase().includes(q);
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchRole && !matchLoc && !matchTags) return false;
    }
    return true;
  });

  const handleCardClick = (service) => {
    onSelectCategory(service.id);
    setTimeout(() => {
      document.getElementById("providers-section")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  // Real Browser GPS Handler
  const handleUseRealGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          address: `Live GPS: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
          isGps: true,
        });
      },
      (err) => {
        setGpsLoading(false);
        alert("GPS Error: " + err.message + ". Using Delhi NCR preset.");
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="page-view services-page">
      {/* Services Header */}
      <div className="page-header-strip">
        <div className="section-inner" style={{ padding: "2.5rem 1.5rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div className="section-label">Services Directory</div>
              <div className="section-title">All Cooperative Service Categories</div>
              <div className="section-desc">
                Select any service category to view verified cooperative providers near you. All members are DigiLocker Aadhaar verified with real-time distance and ETA calculated from your location.
              </div>
            </div>

            <button
              className={`btn btn-outline unified-gps-btn ${userLocation.isGps ? "gps-on" : ""}`}
              onClick={handleUseRealGps}
              title="Detect and update live distances from your device GPS"
            >
              {gpsLoading ? "⌛" : "🎯"} {userLocation.isGps ? "Real GPS Active" : "Use My Live GPS"}
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="section-inner">
        <div className="services-grid" style={{ marginTop: "1rem" }}>
          {SERVICES.map((s) => (
            <button
              className={`service-card ${currentCatId === s.id ? "active" : ""}`}
              key={s.id}
              onClick={() => handleCardClick(s)}
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

        {/* Providers Section on Same Page */}
        <div id="providers-section" style={{ paddingTop: "3.5rem", marginTop: "2rem", borderTop: "1px solid var(--border)" }}>
          <div className="section-header">
            <div>
              <div className="section-label">Verified Local Workforce</div>
              <div className="section-title">Meet your community providers</div>
              <div className="section-desc">
                Every professional is a co-op member with verified DigiLocker Aadhaar ID, live GPS map distance, and 92% direct wage payout.
              </div>
            </div>

            {currentCatId !== "all" && (
              <button className="btn btn-outline" onClick={() => onSelectCategory("all")}>
                Show All Categories ({PROVIDERS.length}) →
              </button>
            )}
          </div>

          {/* Search & Filter Toolbar */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <div className="filter-tabs" style={{ marginBottom: 0 }}>
              {[
                ["all", "All Providers"],
                ["online", "🟢 Online Now"],
                ["top", "⭐ Top Rated"],
                ["nearby", "⚡ Nearest (< 3.5km)"],
              ].map(([key, label]) => (
                <button key={key} className={`filter-tab${filter === key ? " active" : ""}`} onClick={() => setFilter(key)}>
                  {label}
                </button>
              ))}
            </div>

            <div style={{ position: "relative", minWidth: "260px", flex: "1", maxWidth: "380px" }}>
              <input
                type="text"
                className="form-input"
                placeholder="🔍 Search provider by name, skill, area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: "0.82rem", padding: "7px 12px", borderRadius: "100px" }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {filteredProviders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem", background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔍</div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>No providers found in this category</div>
              <div style={{ color: "var(--slate-400)", fontSize: "0.85rem", marginTop: "0.25rem" }}>Try clearing filters or selecting another service category above.</div>
            </div>
          ) : (
            <div className="providers-grid">
              {filteredProviders.map((p) => {
                const dist = calculateDistance(userLocation.lat, userLocation.lng, p.lat, p.lng);
                const eta = calculateETA(dist);
                const vehicleEmoji = p.vehicleType === "car" ? "🚗" : p.vehicleType === "van" ? "🚐" : "🛵";

                return (
                  <div className="provider-card" key={p.id} id={`provider-${p.id}`}>
                    <div className="provider-card-header">
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <div className={`provider-avatar-lg ${p.avatar}`}>
                          {p.initials}
                          <div className="pcard-verified">✓</div>
                        </div>
                        {p.online && <div className="online-dot" title="Online Now" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="pcard-name" style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexWrap: "wrap" }}>
                          <span>{p.name}</span>
                          <span style={{ fontSize: "0.6rem", background: "#e0f2fe", color: "#0369a1", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>
                            DigiLocker Verified
                          </span>
                        </div>
                        <div className="pcard-role">{p.role}</div>
                        <div className="pcard-location">
                          📍 {p.location}
                        </div>
                      </div>
                    </div>

                    <div className="provider-card-body">
                      {/* Swiggy-Style Distance & ETA Location Strip */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "6px 10px",
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: "8px",
                          marginBottom: "0.65rem",
                          fontSize: "0.74rem",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#166534", fontWeight: 700 }}>
                          <span>{vehicleEmoji}</span>
                          <span><strong>{formatDistance(dist)}</strong> away on map</span>
                        </div>
                        <div style={{ color: "#0c831f", fontWeight: 800 }}>
                          ⏱️ ~{eta} mins arrival
                        </div>
                      </div>

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
                        {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                      </div>

                      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                        <button
                          className="btn btn-outline"
                          style={{ flex: 1, justifyContent: "center", padding: "8px 10px", borderRadius: "var(--radius-sm)", fontSize: "0.78rem" }}
                          onClick={() => onTrackProvider && onTrackProvider(p)}
                          title="View live GPS location and route on map"
                        >
                          🗺️ Track on Map
                        </button>
                        <button
                          className="btn btn-primary"
                          style={{ flex: 1.5, justifyContent: "center", padding: "8px 12px", borderRadius: "var(--radius-sm)", fontSize: "0.82rem" }}
                          onClick={() => onBook(p)}
                        >
                          Book ({p.price}) →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



