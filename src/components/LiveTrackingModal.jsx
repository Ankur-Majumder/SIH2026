import React, { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import {
  DEFAULT_USER_LOCATION,
  calculateDistance,
  calculateETA,
  formatDistance,
  generateRouteWaypoints,
} from "../data/mockData";
import { JobVerificationModal } from "./JobVerificationModal";

export function LiveTrackingModal({ booking, provider, onClose, onFinishJob }) {
  // Co-op Worker info
  const targetProvider = provider || {
    id: 1,
    name: "Rajesh Kumar",
    role: "Master Plumber",
    price: "₹850/day",
    avatar: "avatar-blue",
    initials: "RK",
    lat: 28.6612,
    lng: 77.1850,
    vehicleType: "scooter",
    vehicleNumber: "DL 04 AB 8492",
    phone: "+91 98101 23456",
    labourRegNo: "SS-DL-2026-LAB-84920",
    rating: 4.9,
    reviews: 142,
  };

  const bookingAmountRaw = parseInt(booking?.amount?.toString().replace(/\D/g, "") || targetProvider.price?.replace(/\D/g, "") || "850", 10);
  const workerPayout = Math.round(bookingAmountRaw * 0.85);

  // User destination location state
  const [userLoc, setUserLoc] = useState({
    lat: DEFAULT_USER_LOCATION.lat,
    lng: DEFAULT_USER_LOCATION.lng,
    address: booking?.address || DEFAULT_USER_LOCATION.address,
    isGps: false,
  });

  // Tracking & Simulation State
  const [progress, setProgress] = useState(0.15); // 0 to 1
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1); // 1x, 2x, 5x
  const [currentDistance, setCurrentDistance] = useState(1.6);
  const [etaMins, setEtaMins] = useState(6);
  const [activeTab, setActiveTab] = useState("tracking"); // tracking | verification | chat | details
  const [showCallModal, setShowCallModal] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationModalStage, setVerificationModalStage] = useState("initial");
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [pinEntered, setPinEntered] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  // Verification State
  const [initialIssueVerified, setInitialIssueVerified] = useState(false);
  const [workerArrivalPhoto, setWorkerArrivalPhoto] = useState(booking?.workerArrivalPhoto || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60");
  const [workerFinalPhoto, setWorkerFinalPhoto] = useState(booking?.workerFinalPhoto || "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&auto=format&fit=crop&q=60");
  const [jobInProgress, setJobInProgress] = useState(false);
  const [finalWorkSubmitted, setFinalWorkSubmitted] = useState(false);

  const customerPhoto = booking?.customerProblem?.photoUrl || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60";
  const customerVoiceTranscript = booking?.customerProblem?.voiceTranscript || "रसोई के सिंक के नीचे मुख्य पानी का पाइप काफी तेज़ी से टपक रहा है।";

  // Chat messages
  const [chatMessages, setChatMessages] = useState([
    { sender: "worker", text: "Namaste! I have accepted your cooperative service request and I am heading over.", time: "Just now" },
    { sender: "system", text: `🔒 Escrow ₹${bookingAmountRaw} safely locked. Release funds only after inspecting final work.`, time: "Just now" },
  ]);
  const [inputMsg, setInputMsg] = useState("");

  // Leaflet Map References
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const workerMarkerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const polylineRef = useRef(null);
  const travelledPolylineRef = useRef(null);
  const waypointsRef = useRef([]);

  // Generate Waypoints
  useEffect(() => {
    const start = { lat: targetProvider.lat || 28.6612, lng: targetProvider.lng || 77.1850 };
    const end = { lat: userLoc.lat, lng: userLoc.lng };
    waypointsRef.current = generateRouteWaypoints(start, end, 60);
    const initialDist = calculateDistance(start.lat, start.lng, end.lat, end.lng);
    setCurrentDistance(initialDist);
    setEtaMins(calculateETA(initialDist));
  }, [targetProvider.lat, targetProvider.lng, userLoc.lat, userLoc.lng]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const start = [targetProvider.lat || 28.6612, targetProvider.lng || 77.1850];
    const end = [userLoc.lat, userLoc.lng];
    const centerLat = (start[0] + end[0]) / 2;
    const centerLng = (start[1] + end[1]) / 2;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 14,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    const createWorkerIcon = (vehicleType) => {
      const emoji = vehicleType === "car" ? "🚗" : vehicleType === "van" ? "🚐" : "🛵";
      return L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div class="map-worker-pin">
            <div class="map-worker-radar"></div>
            <div class="map-worker-badge">${emoji}</div>
            <div class="map-worker-tag">${targetProvider.name.split(" ")[0]}</div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });
    };

    const createUserIcon = () => {
      return L.divIcon({
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
    };

    const workerMarker = L.marker(start, { icon: createWorkerIcon(targetProvider.vehicleType) }).addTo(map);
    const userMarker = L.marker(end, { icon: createUserIcon() }).addTo(map);

    const polyline = L.polyline(waypointsRef.current, {
      color: "#0c831f",
      weight: 5,
      opacity: 0.85,
      dashArray: "8, 6",
      lineCap: "round",
    }).addTo(map);

    const travelledPolyline = L.polyline([], {
      color: "#94a3b8",
      weight: 4,
      opacity: 0.6,
      lineCap: "round",
    }).addTo(map);

    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

    mapInstanceRef.current = map;
    workerMarkerRef.current = workerMarker;
    userMarkerRef.current = userMarker;
    polylineRef.current = polyline;
    travelledPolylineRef.current = travelledPolyline;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Route and Markers when waypoints change
  useEffect(() => {
    if (!mapInstanceRef.current || !polylineRef.current) return;
    const waypoints = waypointsRef.current;
    if (waypoints.length > 0) {
      polylineRef.current.setLatLngs(waypoints);
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLoc.lat, userLoc.lng]);
      }
      mapInstanceRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [60, 60] });
    }
  }, [userLoc]);

  // Live Vehicle Animation Loop
  useEffect(() => {
    let animationFrame;
    let lastTime = performance.now();

    const updateMovement = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isPlaying && progress < 1) {
        const stepRate = 0.02 * simSpeed;
        setProgress((prev) => {
          const next = Math.min(1, prev + stepRate * delta);
          return next;
        });
      }
      animationFrame = requestAnimationFrame(updateMovement);
    };

    animationFrame = requestAnimationFrame(updateMovement);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, simSpeed, progress]);

  // Update marker position and calculations based on progress
  useEffect(() => {
    const waypoints = waypointsRef.current;
    if (!waypoints || waypoints.length === 0) return;

    const totalPoints = waypoints.length;
    const currentIndex = Math.min(totalPoints - 1, Math.floor(progress * (totalPoints - 1)));
    const currentPoint = waypoints[currentIndex];

    if (currentPoint && workerMarkerRef.current) {
      workerMarkerRef.current.setLatLng(currentPoint);

      if (travelledPolylineRef.current) {
        const travelled = waypoints.slice(0, currentIndex + 1);
        travelledPolylineRef.current.setLatLngs(travelled);
      }

      const remainingDist = calculateDistance(currentPoint[0], currentPoint[1], userLoc.lat, userLoc.lng);
      setCurrentDistance(remainingDist);
      setEtaMins(calculateETA(remainingDist));
    }
  }, [progress, userLoc]);

  // Real Browser Geolocation Handler
  const handleUseRealGps = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    setGpsError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const { latitude, longitude } = pos.coords;
        setUserLoc({
          lat: latitude,
          lng: longitude,
          address: `Live GPS: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
          isGps: true,
        });
        setProgress(0.05);
      },
      (err) => {
        setGpsLoading(false);
        setGpsError("Could not fetch GPS: " + err.message + ". Using Delhi NCR preset.");
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current && polylineRef.current) {
      mapInstanceRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [50, 50] });
    }
  };

  const handleFocusWorker = () => {
    if (mapInstanceRef.current && workerMarkerRef.current) {
      const latlng = workerMarkerRef.current.getLatLng();
      mapInstanceRef.current.setView(latlng, 16, { animate: true });
    }
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputMsg.trim()) return;
    const newMsg = { sender: "user", text: inputMsg.trim(), time: "Now" };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputMsg("");

    setTimeout(() => {
      const replies = [
        "Received! I am following the map route on my scooter.",
        "Got it, almost reaching your gate!",
        "Yes, I have all the tools and spare parts ready.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setChatMessages((prev) => [...prev, { sender: "worker", text: randomReply, time: "Now" }]);
    }, 1500);
  };

  // Status computation based on progress & verification stages
  let statusBadge = "On the way";
  let statusDesc = `${targetProvider.name} is navigating towards your address.`;

  if (isCompleted) {
    statusBadge = "Work Completed & Paid";
    statusDesc = `Service 100% finished. ₹${workerPayout} released to ${targetProvider.name}.`;
  } else if (finalWorkSubmitted) {
    statusBadge = "Work Done — Awaiting Sign-off";
    statusDesc = `${targetProvider.name} has submitted final work proof. Please review and release escrow.`;
  } else if (jobInProgress || initialIssueVerified) {
    statusBadge = "Work In Progress";
    statusDesc = `Initial problem verified by AI & Customer. ${targetProvider.name} is working now.`;
  } else if (progress >= 0.98) {
    statusBadge = "Arrived — Verification Required";
    statusDesc = `${targetProvider.name} is at your doorstep. Compare problem photos to authorize work.`;
  } else if (progress >= 0.75) {
    statusBadge = "Nearby (< 300m)";
    statusDesc = `${targetProvider.name} is just around the corner on Pusa Road.`;
  } else if (progress >= 0.25) {
    statusBadge = "In Transit";
    statusDesc = `${targetProvider.name} is riding at ~24 km/h via Main Patel Road.`;
  }

  const escrowPin = booking?.pin || "4821";

  const handleVerifyEscrowPin = () => {
    if (pinEntered === escrowPin || pinEntered === "4821") {
      setIsCompleted(true);
      if (onFinishJob) onFinishJob(booking || targetProvider);
    } else {
      alert(`Invalid PIN. Please enter ${escrowPin} to authorize job completion.`);
    }
  };

  return (
    <div className="modal-overlay live-tracking-overlay" onClick={onClose}>
      <div className="modal live-tracking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="india-bar" />

        {/* Top Header */}
        <div className="live-track-header">
          <div className="live-track-header-left">
            <span className="live-pulse-dot" />
            <div>
              <div className="live-track-title">
                <span>Live Cooperative Route & Verification</span>
                <span className="live-tag-pill">GPS Live 📍</span>
              </div>
              <div className="live-track-sub">
                Booking ID: <strong>{booking?.txnId || "TXN_SS_2026_94810214"}</strong> · 100% Escrow Protected
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button className="btn btn-ghost live-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* 5-Step Security Verification Timeline Bar */}
        <div className="swiggy-timeline">
          {[
            { num: 1, title: "Booked", done: true },
            { num: 2, title: "On The Way", done: progress >= 0.15, active: progress < 0.98 },
            { num: 3, title: "Arrival & Photo Match", done: initialIssueVerified || progress >= 0.98, active: progress >= 0.98 && !initialIssueVerified },
            { num: 4, title: "Work in Progress", done: finalWorkSubmitted || isCompleted, active: initialIssueVerified && !finalWorkSubmitted },
            { num: 5, title: "Final Proof & Payout", done: isCompleted, active: finalWorkSubmitted && !isCompleted },
          ].map((s, idx) => (
            <div key={idx} className={`timeline-step ${s.done ? "done" : ""} ${s.active ? "active" : ""}`}>
              <div className="timeline-bullet">{s.done ? "✓" : s.num}</div>
              <span className="timeline-label">{s.title}</span>
            </div>
          ))}
        </div>

        {/* Main Body */}
        <div className="live-track-body">
          {/* MAP WRAPPER */}
          <div className="live-map-container">
            <div ref={mapContainerRef} className="leaflet-map-root" />

            {/* Floating Top Telemetry Overlay */}
            <div className="map-hud-overlay">
              <div className="hud-card">
                <div className="hud-icon">⏱️</div>
                <div>
                  <div className="hud-val">{progress >= 0.98 ? "Arrived" : `${etaMins} mins`}</div>
                  <div className="hud-label">Estimated Arrival</div>
                </div>
              </div>

              <div className="hud-card">
                <div className="hud-icon">📍</div>
                <div>
                  <div className="hud-val">{progress >= 0.98 ? "0 m" : formatDistance(currentDistance)}</div>
                  <div className="hud-label">Distance Left</div>
                </div>
              </div>

              <div className="hud-card hide-mobile">
                <div className="hud-icon">🛵</div>
                <div>
                  <div className="hud-val">{progress >= 0.98 ? "0 km/h" : "24 km/h"}</div>
                  <div className="hud-label">{targetProvider.vehicleNumber}</div>
                </div>
              </div>
            </div>

            {/* Floating Map Controls */}
            <div className="map-floating-actions">
              <button
                className={`map-float-btn ${userLoc.isGps ? "gps-active" : ""}`}
                onClick={handleUseRealGps}
                title="Use My Live GPS Location"
              >
                {gpsLoading ? "⌛" : "🎯"}
                <span className="float-btn-text">
                  {userLoc.isGps ? "Using Real GPS" : "My Live GPS"}
                </span>
              </button>

              <button className="map-float-btn" onClick={handleFocusWorker} title="Focus on Provider">
                🛵 Focus Worker
              </button>

              <button className="map-float-btn" onClick={handleRecenter} title="Show Full Route">
                🗺️ Full Route
              </button>
            </div>

            {/* Simulation Controls Overlay */}
            <div className="map-sim-controls">
              <div className="sim-title">Demo Controls:</div>
              <button
                className="sim-btn"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? "⏸️ Pause" : "▶️ Play"}
              </button>
              <button
                className={`sim-btn ${simSpeed === 1 ? "active" : ""}`}
                onClick={() => setSimSpeed(1)}
              >
                1x
              </button>
              <button
                className={`sim-btn ${simSpeed === 2 ? "active" : ""}`}
                onClick={() => setSimSpeed(2)}
              >
                2x
              </button>
              <button
                className={`sim-btn ${simSpeed === 5 ? "active" : ""}`}
                onClick={() => setSimSpeed(5)}
              >
                5x
              </button>
              <button
                className="sim-btn"
                onClick={() => {
                  setProgress(0.05);
                  setIsPlaying(true);
                  setIsCompleted(false);
                  setInitialIssueVerified(false);
                  setFinalWorkSubmitted(false);
                }}
              >
                🔄 Restart
              </button>
              <button
                className="sim-btn saffron-btn"
                onClick={() => setProgress(0.99)}
              >
                🏁 Arrive Now
              </button>
            </div>

            {gpsError && <div className="gps-error-toast">⚠️ {gpsError}</div>}
          </div>

          {/* RIGHT / BOTTOM DRAWER: DETAILS, VERIFICATION & ACTIONS */}
          <div className="live-sidebar">
            {/* Tab navigation */}
            <div className="live-sidebar-tabs">
              <button
                className={`live-tab ${activeTab === "tracking" ? "active" : ""}`}
                onClick={() => setActiveTab("tracking")}
              >
                🛵 Live Status
              </button>
              <button
                className={`live-tab ${activeTab === "verification" ? "active" : ""}`}
                onClick={() => setActiveTab("verification")}
              >
                🛡️ Photo Verification {progress >= 0.98 && !isCompleted ? "🔴" : "✓"}
              </button>
              <button
                className={`live-tab ${activeTab === "chat" ? "active" : ""}`}
                onClick={() => setActiveTab("chat")}
              >
                💬 Chat with {targetProvider.name.split(" ")[0]}
              </button>
              <button
                className={`live-tab ${activeTab === "details" ? "active" : ""}`}
                onClick={() => setActiveTab("details")}
              >
                📋 Bill & Split
              </button>
            </div>

            {/* TAB 1: LIVE TRACKING OVERVIEW */}
            {activeTab === "tracking" && (
              <div className="live-tab-content">
                {/* Provider Card */}
                <div className="live-provider-card">
                  <div className={`avatar ${targetProvider.avatar || "avatar-blue"}`} style={{ width: 48, height: 48, minWidth: 48, borderRadius: 12 }}>
                    {targetProvider.initials}
                    <div className="verified-dot">✓</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>
                        {targetProvider.name}
                      </span>
                      <span style={{ fontSize: "0.58rem", background: "#e0f2fe", color: "#0369a1", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>
                        DigiLocker Verified
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#0c831f", fontWeight: 700 }}>
                      {targetProvider.role} · {targetProvider.price}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
                      Vehicle: <strong>{targetProvider.vehicleNumber}</strong> ({targetProvider.vehicleType})
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    <button className="btn btn-outline live-action-icon-btn" onClick={() => setShowCallModal(true)} title="Call Partner">
                      📞 Call
                    </button>
                    <button className="btn btn-ghost live-action-icon-btn" onClick={() => setActiveTab("chat")} title="Chat">
                      💬 Chat
                    </button>
                  </div>
                </div>

                {/* Status Callout */}
                <div className={`live-status-banner ${progress >= 0.98 ? "arrived" : ""}`}>
                  <div className="status-banner-top">
                    <span className="status-badge-pill">{statusBadge}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0f172a" }}>
                      {progress >= 0.98 ? "At Doorstep" : `${formatDistance(currentDistance)} away`}
                    </span>
                  </div>
                  <div className="status-banner-desc">{statusDesc}</div>
                </div>

                {/* SAFETY PHOTO VERIFICATION ACTION BANNER */}
                {progress >= 0.98 && !initialIssueVerified && (
                  <div className="on-site-prompt-banner">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                      <span style={{ fontSize: "1.2rem" }}>📸</span>
                      <strong style={{ fontSize: "0.85rem", color: "#1e3a8a" }}>
                        Step 2: Dual Problem Photo Verification Required
                      </strong>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#334155", margin: "0 0 0.6rem" }}>
                      {targetProvider.name} is on-site. Compare customer & worker photos to authorize the job.
                    </p>
                    <button
                      className="btn btn-primary"
                      style={{ width: "100%", justifyContent: "center", fontSize: "0.82rem", padding: "8px" }}
                      onClick={() => {
                        setVerificationModalStage("initial");
                        setShowVerificationModal(true);
                      }}
                    >
                      🛡️ Open Dual Photo Verification Handshake →
                    </button>
                  </div>
                )}

                {/* WORK COMPLETED BANNER */}
                {initialIssueVerified && !finalWorkSubmitted && (
                  <div className="on-site-prompt-banner" style={{ background: "#f0fdf4", borderColor: "#86efac" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                      <span style={{ fontSize: "1.2rem" }}>⚙️</span>
                      <strong style={{ fontSize: "0.85rem", color: "#166534" }}>
                        Work in Progress (Authorized)
                      </strong>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#14532d", margin: "0 0 0.6rem" }}>
                      {targetProvider.name} is performing the repairs. When finished, submit final work proof.
                    </p>
                    <button
                      className="btn btn-outline"
                      style={{ width: "100%", justifyContent: "center", fontSize: "0.82rem", padding: "8px" }}
                      onClick={() => {
                        setFinalWorkSubmitted(true);
                        setVerificationModalStage("final_review");
                        setShowVerificationModal(true);
                      }}
                    >
                      📸 Worker Finished Job: Submit Final Work Photo →
                    </button>
                  </div>
                )}

                {finalWorkSubmitted && !isCompleted && (
                  <div className="on-site-prompt-banner" style={{ background: "#fef3c7", borderColor: "#fde047" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                      <span style={{ fontSize: "1.2rem" }}>🔍</span>
                      <strong style={{ fontSize: "0.85rem", color: "#92400e" }}>
                        Final Work Proof Submitted: Customer Approval Pending
                      </strong>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#78350f", margin: "0 0 0.6rem" }}>
                      Inspect Before & After photos to release the 85% direct wage (₹{workerPayout}).
                    </p>
                    <button
                      className="btn btn-primary"
                      style={{ width: "100%", justifyContent: "center", fontSize: "0.82rem", padding: "8px", background: "#0c831f" }}
                      onClick={() => {
                        setVerificationModalStage("final_review");
                        setShowVerificationModal(true);
                      }}
                    >
                      ✅ Review Before/After & Release Escrow →
                    </button>
                  </div>
                )}

                {/* Escrow Release 4-Digit PIN Card */}
                <div className="escrow-pin-card">
                  <div className="pin-card-header">
                    <span>🔒 Escrow Release PIN (Security Code)</span>
                    <span className="escrow-badge">Share After Sign-Off</span>
                  </div>
                  <div className="pin-digits-wrapper">
                    {escrowPin.split("").map((digit, i) => (
                      <div key={i} className="pin-digit-box">
                        {digit}
                      </div>
                    ))}
                  </div>
                  <p className="pin-instruction">
                    Give this 4-digit code to {targetProvider.name.split(" ")[0]} <strong>only after</strong> the job is completed and approved on the app.
                  </p>
                </div>

                {/* Address summary */}
                <div className="live-address-card">
                  <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, marginBottom: "2px" }}>
                    📍 SERVICE DESTINATION
                  </div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a" }}>
                    {userLoc.address}
                  </div>
                </div>

                {/* Emergency SOS & Support */}
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                  <button className="btn btn-outline" style={{ flex: 1, fontSize: "0.75rem", padding: "6px" }} onClick={() => setShowSosModal(true)}>
                    🚨 Safety & SOS
                  </button>
                  <button className="btn btn-ghost" style={{ flex: 1, fontSize: "0.75rem", padding: "6px" }} onClick={() => setActiveTab("details")}>
                    📄 View Bill & Split
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: INLINE PHOTO VERIFICATION */}
            {activeTab === "verification" && (
              <div className="live-tab-content">
                <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0f172a", marginBottom: "0.5rem" }}>
                  Safety & Privacy Problem Comparison
                </div>

                {/* Customer submission details */}
                <div className="dash-panel" style={{ padding: "0.75rem", marginBottom: "0.75rem" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#1e3a8a", marginBottom: "0.3rem" }}>
                    🏠 1. Customer Problem Media
                  </div>
                  <img src={customerPhoto} alt="Customer reported problem" style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 8, marginBottom: "0.4rem" }} />
                  {customerVoiceTranscript && (
                    <div style={{ background: "#f0fdf4", padding: "6px 8px", borderRadius: 6, fontSize: "0.72rem", color: "#166534" }}>
                      🎙️ <em>"{customerVoiceTranscript}"</em>
                    </div>
                  )}
                </div>

                {/* Worker on-site submission */}
                <div className="dash-panel" style={{ padding: "0.75rem", marginBottom: "0.75rem" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#15803d", marginBottom: "0.3rem" }}>
                    🛠️ 2. Worker On-Site Verification Photo
                  </div>
                  <img src={workerArrivalPhoto} alt="Worker on-site photo" style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 8, marginBottom: "0.4rem" }} />
                  <div style={{ fontSize: "0.7rem", color: "#0c831f", fontWeight: 700 }}>
                    ✓ Match Score: 96% · GPS Proximity Verified
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", fontSize: "0.82rem" }}
                  onClick={() => {
                    setVerificationModalStage(finalWorkSubmitted ? "final_review" : "initial");
                    setShowVerificationModal(true);
                  }}
                >
                  🛡️ Open Full-Screen Verification Flow →
                </button>
              </div>
            )}

            {/* TAB 3: IN-APP LIVE CHAT */}
            {activeTab === "chat" && (
              <div className="live-chat-tab">
                <div className="chat-messages-scroll">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`chat-bubble-wrap ${msg.sender}`}>
                      <div className="chat-bubble">
                        <div className="chat-text">{msg.text}</div>
                        <div className="chat-time">{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="chat-quick-replies">
                  {[
                    "I am at Gate No. 2",
                    "Please call when downstairs",
                    "House bell is working",
                    "Do you need parking space?",
                  ].map((preset, i) => (
                    <button
                      key={i}
                      className="chat-preset-chip"
                      onClick={() => {
                        setChatMessages((prev) => [...prev, { sender: "user", text: preset, time: "Now" }]);
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <form className="chat-input-bar" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={`Message ${targetProvider.name}...`}
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    style={{ fontSize: "0.82rem", padding: "8px 12px" }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: "8px 14px" }}>
                    Send
                  </button>
                </form>
              </div>
            )}

            {/* TAB 4: JOB DETAILS & ESCROW RELEASE */}
            {activeTab === "details" && (
              <div className="live-tab-content">
                <div className="job-summary-card">
                  <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#0f172a", marginBottom: "0.5rem" }}>
                    Cooperative Escrow Breakdown
                  </div>
                  <div className="split-row">
                    <span>Rate Structure:</span>
                    <strong>{targetProvider.price}</strong>
                  </div>
                  <div className="split-row">
                    <span>Total Amount Paid:</span>
                    <strong>₹{bookingAmountRaw}</strong>
                  </div>
                  <div className="split-row" style={{ color: "#0c831f" }}>
                    <span>Worker Payout (85% direct):</span>
                    <strong>₹{workerPayout}</strong>
                  </div>
                  <div className="split-row">
                    <span>Website Maintenance Fee (15%):</span>
                    <span>₹{bookingAmountRaw - workerPayout}</span>
                  </div>
                  <div className="split-row" style={{ color: "#64748b" }}>
                    <span>Middleman Commission:</span>
                    <span>₹0.00 (Zero)</span>
                  </div>
                </div>

                {/* Job Completion Section */}
                <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.3rem" }}>
                    Release Escrow on Service Completion
                  </div>
                  <p style={{ fontSize: "0.72rem", color: "#64748b", margin: "0 0 0.5rem 0" }}>
                    Once {targetProvider.name} finishes the work and you inspect the result, enter or approve the 4-digit PIN:
                  </p>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <input
                      type="text"
                      maxLength="4"
                      className="form-input"
                      placeholder="Enter 4-digit PIN (e.g. 4821)"
                      value={pinEntered}
                      onChange={(e) => setPinEntered(e.target.value)}
                      style={{ textAlign: "center", fontWeight: 800, letterSpacing: "4px" }}
                    />
                    <button className="btn btn-primary" onClick={handleVerifyEscrowPin} style={{ whiteSpace: "nowrap" }}>
                      Release ₹{workerPayout} →
                    </button>
                  </div>
                  {isCompleted && (
                    <div style={{ marginTop: "0.5rem", padding: "6px", background: "#dcfce7", color: "#166534", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, textAlign: "center" }}>
                      🎉 Job Completed & ₹{workerPayout} released instantly!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FULL SCREEN SAFETY DUAL-HANDSHAKE VERIFICATION MODAL */}
        {showVerificationModal && (
          <JobVerificationModal
            booking={booking}
            provider={targetProvider}
            stage={verificationModalStage}
            onClose={() => setShowVerificationModal(false)}
            onApproved={(data) => {
              setInitialIssueVerified(true);
              setJobInProgress(true);
              setWorkerArrivalPhoto(data.workerArrivalPhoto);
              setShowVerificationModal(false);
            }}
            onCompleteJob={(data) => {
              setIsCompleted(true);
              setShowVerificationModal(false);
              if (onFinishJob) onFinishJob(data);
            }}
          />
        )}

        {/* CALL SIMULATION MODAL */}
        {showCallModal && (
          <div className="nested-modal-overlay" onClick={() => setShowCallModal(false)}>
            <div className="nested-modal-card" onClick={(e) => e.stopPropagation()}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📞</div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>
                Connecting to {targetProvider.name}...
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", margin: "0.3rem 0 1rem" }}>
                🔒 Number masked for customer privacy via SahayogSeva Safety Bridge.
              </div>
              <div style={{ background: "#f1f5f9", padding: "0.75rem", borderRadius: "8px", fontWeight: 800, color: "#1e293b", fontSize: "1.1rem", marginBottom: "1.25rem" }}>
                {targetProvider.phone}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowCallModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, background: "#dc2626" }}
                  onClick={() => {
                    alert(`Simulated call connected to ${targetProvider.name}!`);
                    setShowCallModal(false);
                  }}
                >
                  Dial Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SOS EMERGENCY MODAL */}
        {showSosModal && (
          <div className="nested-modal-overlay" onClick={() => setShowSosModal(false)}>
            <div className="nested-modal-card" onClick={(e) => e.stopPropagation()}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🚨</div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#991b1b" }}>
                Emergency Safety & Helpline
              </div>
              <div style={{ fontSize: "0.78rem", color: "#475569", margin: "0.4rem 0 1rem" }}>
                Immediate assistance backed by Ministry of Cooperation safety protocol:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem", textAlign: "left" }}>
                <div style={{ padding: "8px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", fontSize: "0.8rem" }}>
                  <strong>🚓 Police Emergency:</strong> 112 / 100
                </div>
                <div style={{ padding: "8px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", fontSize: "0.8rem" }}>
                  <strong>👩 Women Safety Helpline:</strong> 1091 / 181
                </div>
                <div style={{ padding: "8px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", fontSize: "0.8rem" }}>
                  <strong>🏛️ Co-op Grievance Cell:</strong> 1800-11-2025 (Toll-Free)
                </div>
              </div>
              <button className="btn btn-outline" style={{ width: "100%" }} onClick={() => setShowSosModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

