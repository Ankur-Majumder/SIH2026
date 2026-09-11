import React from "react";

export function FloatingTrackerPill({ booking, onOpenTracker, onDismiss }) {
  if (!booking) return null;

  return (
    <div className="floating-tracker-pill">
      <div className="floating-pill-inner" onClick={onOpenTracker}>
        <div className="floating-pill-icon-box">
          <span className="floating-scooter-anim">🛵</span>
          <span className="floating-live-dot" />
        </div>
        <div className="floating-pill-text">
          <div className="floating-pill-title">
            <span>{booking.name || "Rajesh Kumar"}</span>
            <span className="floating-pill-badge">On The Way</span>
          </div>
          <div className="floating-pill-sub">
            {booking.service || "Plumbing"} · <strong>4 mins away</strong> · Tap to Track Map ➔
          </div>
        </div>
      </div>
      {onDismiss && (
        <button
          className="floating-pill-close"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          title="Dismiss preview"
        >
          ✕
        </button>
      )}
    </div>
  );
}
