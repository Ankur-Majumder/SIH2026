import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { DEFAULT_USER_LOCATION, calculateDistance, formatDistance } from "../data/mockData";

export function WorkerLocationModal({ provider, userLocation, onClose, onBookNow }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const uLoc = userLocation || DEFAULT_USER_LOCATION;
  const targetProvider = provider || {
    id: 1,
    name: "Rajesh Kumar",
    role: "Master Plumber",
    price: "₹450/day",
    location: "Karol Bagh, Delhi",
    lat: 28.6612,
    lng: 77.1850,
    vehicleType: "scooter",
    vehicleNumber: "DL 04 AB 8492",
    rating: 4.9,
    reviews: 142,
    avatar: "avatar-blue",
    initials: "RK",
  };

  const dist = calculateDistance(uLoc.lat, uLoc.lng, targetProvider.lat, targetProvider.lng);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const start = [targetProvider.lat, targetProvider.lng];
    const end = [uLoc.lat, uLoc.lng];
    const centerLat = (start[0] + end[0]) / 2;
    const centerLng = (start[1] + end[1]) / 2;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 14,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Standard OpenStreetMap Tile Layer (No watermark, 100% reliable)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const vehicleEmoji = targetProvider.vehicleType === "car" ? "🚗" : targetProvider.vehicleType === "van" ? "🚐" : "🛵";

    // Static Worker Location Pin
    const workerIcon = L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div class="map-worker-pin">
          <div class="map-worker-radar"></div>
          <div class="map-worker-badge">${vehicleEmoji}</div>
          <div class="map-worker-tag">${targetProvider.name.split(" ")[0]} (Current Spot)</div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    // Customer Location Pin
    const userIcon = L.divIcon({
      className: "custom-leaflet-marker",
      html: `
        <div class="map-user-pin">
          <div class="map-user-pulse"></div>
          <div class="map-user-badge">🏠</div>
          <div class="map-user-tag">Your Location</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const wMarker = L.marker(start, { icon: workerIcon }).addTo(map);
    const uMarker = L.marker(end, { icon: userIcon }).addTo(map);

    // Dotted line connecting both locations
    const line = L.polyline([start, end], {
      color: "#0c831f",
      weight: 3,
      opacity: 0.7,
      dashArray: "6, 6",
    }).addTo(map);

    map.fitBounds(line.getBounds(), { padding: [50, 50] });
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [targetProvider, uLoc]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "680px", width: "95%" }}>
        <div className="india-bar" />

        {/* Modal Header */}
        <div className="modal-header" style={{ padding: "0.85rem 1.1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem" }}>📍</span>
            <div>
              <div className="modal-title" style={{ fontSize: "1rem", fontWeight: 800 }}>
                {targetProvider.name}'s Exact Live Location
              </div>
              <div style={{ fontSize: "0.68rem", color: "#64748b" }}>
                Current Standby Location · Real-time dispatch after payment
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: "1rem" }}>
          {/* Provider Standby Strip */}
          <div className="booking-provider-card" style={{ marginBottom: "0.75rem" }}>
            <div className={`avatar ${targetProvider.avatar || "avatar-blue"}`} style={{ width: 44, height: 44, minWidth: 44, borderRadius: 10 }}>
              {targetProvider.initials}
              <div className="verified-dot">✓</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: "#111827", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <span>{targetProvider.name}</span>
                <span style={{ fontSize: "0.58rem", background: "#e0f2fe", color: "#0369a1", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>
                  DigiLocker Verified
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#0c831f", fontWeight: 700 }}>
                {targetProvider.role} · ⭐ {targetProvider.rating} ({targetProvider.reviews} jobs)
              </div>
              <div style={{ fontSize: "0.7rem", color: "#4b5563" }}>
                📍 Stationed at: <strong>{targetProvider.location}</strong> ({formatDistance(dist)} from your home)
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontWeight: 800, color: "#0c831f", fontSize: "1.05rem" }}>{targetProvider.price}</div>
              <div style={{ fontSize: "0.62rem", color: "#6b7280" }}>Full Day Rate</div>
            </div>
          </div>

          {/* Leaflet Map Box */}
          <div style={{ height: "320px", width: "100%", borderRadius: "12px", overflow: "hidden", border: "1.5px solid #cbd5e1", position: "relative" }}>
            <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />

            {/* Standby Status Overlay */}
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "rgba(255, 255, 255, 0.94)",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                fontSize: "0.74rem",
                fontWeight: 700,
                color: "#0f172a",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#0c831f", display: "inline-block" }}></span>
              <span>Worker Stationed · {formatDistance(dist)} away</span>
            </div>
          </div>

          {/* Instructions Box */}
          <div style={{ marginTop: "0.75rem", padding: "0.65rem 0.85rem", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", fontSize: "0.75rem", color: "#166534" }}>
            💡 <strong>Next Step:</strong> Click <strong>"Book Now & Request Worker Dispatch"</strong> below. Once payment is completed, the map will switch into <strong>Live Route Movement</strong> tracking {targetProvider.name.split(" ")[0]} traveling to your address in real-time.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ display: "flex", justifyContent: "space-between", padding: "0.85rem 1.1rem" }}>
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            style={{ background: "linear-gradient(135deg, #0c831f, #047857)", fontWeight: 800 }}
            onClick={() => {
              onClose();
              if (onBookNow) onBookNow(targetProvider);
            }}
          >
            Book Now & Request Worker Dispatch ({targetProvider.price}) →
          </button>
        </div>
      </div>
    </div>
  );
}
