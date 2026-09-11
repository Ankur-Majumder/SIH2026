import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import { PROVIDERS, SERVICES, DEFAULT_USER_LOCATION, calculateDistance, formatDistance } from "../data/mockData";

export function NearbyRadarMap({ onBook, onTrackProvider, selectedCategoryId, onSelectCategory }) {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [userCenter, setUserCenter] = useState({
    lat: DEFAULT_USER_LOCATION.lat,
    lng: DEFAULT_USER_LOCATION.lng,
    address: DEFAULT_USER_LOCATION.address,
    isGps: false,
  });
  const [activeFilter, setActiveFilter] = useState(selectedCategoryId || "all");
  const [radiusKm, setRadiusKm] = useState(6);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);

  // Filter providers
  const displayProviders = PROVIDERS.filter((p) => {
    if (activeFilter !== "all" && p.category !== activeFilter) return false;
    const dist = calculateDistance(userCenter.lat, userCenter.lng, p.lat, p.lng);
    return dist <= radiusKm;
  });

  // Init Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userCenter.lat, userCenter.lng],
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    // User Marker
    const userIcon = L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div class="map-user-pin">
          <div class="map-user-pulse"></div>
          <div class="map-user-badge">📍</div>
          <div class="map-user-tag">Your Location</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const uMarker = L.marker([userCenter.lat, userCenter.lng], { icon: userIcon }).addTo(map);
    userMarkerRef.current = uMarker;

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Provider Pins
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    displayProviders.forEach((p) => {
      const emojiMap = {
        plumber: "🔧",
        electrician: "⚡",
        tutor: "📚",
        caregiver: "❤️",
        cleaning: "🧹",
        tech: "💻",
        carpenter: "🪚",
        painter: "🖌️",
        driver: "🚗",
      };
      const emoji = emojiMap[p.category] || "🛠️";
      const dist = calculateDistance(userCenter.lat, userCenter.lng, p.lat, p.lng);

      const pIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div class="radar-provider-pin ${selectedProvider?.id === p.id ? "selected" : ""}">
            <div class="radar-pin-bubble">
              <span class="radar-pin-emoji">${emoji}</span>
              <span class="radar-pin-price">${p.price.split("/")[0]}</span>
            </div>
            <div class="radar-pin-label">${p.name.split(" ")[0]} · ${formatDistance(dist)}</div>
          </div>
        `,
        iconSize: [60, 50],
        iconAnchor: [30, 45],
      });

      const marker = L.marker([p.lat, p.lng], { icon: pIcon });
      marker.on("click", () => {
        setSelectedProvider(p);
      });
      markersLayerRef.current.addLayer(marker);
    });
  }, [displayProviders, selectedProvider, userCenter]);

  // Use Live GPS
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLoc = {
          lat: latitude,
          lng: longitude,
          address: "Your Real GPS Location",
          isGps: true,
        };
        setUserCenter(newLoc);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 14);
          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([latitude, longitude]);
          }
        }
      },
      (err) => {
        alert("GPS Error: " + err.message);
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="radar-map-wrapper">
      {/* Top Filter Chips */}
      <div className="radar-controls-bar">
        <div className="radar-categories-scroll">
          <button
            className={`radar-cat-chip ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => {
              setActiveFilter("all");
              if (onSelectCategory) onSelectCategory("all");
            }}
          >
            🌐 All Services ({PROVIDERS.length})
          </button>
          {SERVICES.map((s) => (
            <button
              key={s.id}
              className={`radar-cat-chip ${activeFilter === s.id ? "active" : ""}`}
              onClick={() => {
                setActiveFilter(s.id);
                if (onSelectCategory) onSelectCategory(s.id);
              }}
            >
              <span>{s.emoji}</span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        <div className="radar-actions-right">
          <button
            className={`btn btn-outline radar-gps-btn ${userCenter.isGps ? "gps-on" : ""}`}
            onClick={handleUseGps}
          >
            🎯 {userCenter.isGps ? "Real GPS Active" : "Locate Me"}
          </button>
          <div className="radar-radius-badge">
            📡 Scan Radius: {radiusKm} km ({displayProviders.length} active)
          </div>
        </div>
      </div>

      {/* Map Body */}
      <div className="radar-map-container">
        <div ref={mapContainerRef} className="radar-leaflet-root" />

        {/* Selected Provider Floating Sheet */}
        {selectedProvider && (
          <div className="radar-provider-sheet">
            <button className="radar-sheet-close" onClick={() => setSelectedProvider(null)}>
              ✕
            </button>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <div className={`avatar ${selectedProvider.avatar || "avatar-blue"}`} style={{ width: 50, height: 50, minWidth: 50, borderRadius: 12 }}>
                {selectedProvider.initials}
                <div className="verified-dot">✓</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span>{selectedProvider.name}</span>
                  <span style={{ fontSize: "0.58rem", background: "#e0f2fe", color: "#0369a1", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>
                    DigiLocker
                  </span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#0c831f", fontWeight: 700 }}>
                  {selectedProvider.role} · ⭐ {selectedProvider.rating} ({selectedProvider.reviews} reviews)
                </div>
                <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                  📍 {selectedProvider.location} · <strong>{formatDistance(calculateDistance(userCenter.lat, userCenter.lng, selectedProvider.lat, selectedProvider.lng))} away</strong>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#0c831f" }}>
                  {selectedProvider.price}
                </div>
                <div style={{ fontSize: "0.62rem", color: "#64748b" }}>92% direct payout</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.85rem" }}>
              <button
                className="btn btn-outline"
                style={{ flex: 1, justifyContent: "center", fontSize: "0.82rem" }}
                onClick={() => {
                  if (onTrackProvider) onTrackProvider(selectedProvider);
                }}
              >
                🛵 Live Route Preview
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: "center", fontSize: "0.82rem" }}
                onClick={() => onBook(selectedProvider)}
              >
                Book with Escrow →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
