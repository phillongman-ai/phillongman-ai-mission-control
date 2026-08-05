import React, { useEffect, useState } from "react";
import { RefreshCw, CalendarDays, Activity, CloudSun, Watch } from "lucide-react";

export function SyncCentre({ onGoogleEvents }) {
  const [message, setMessage] = useState("Connect Google Calendar and Strava when credentials are configured.");
  const [busy, setBusy] = useState(false);
  const [googleStatus, setGoogleStatus] = useState("Ready to connect");
  const [stravaStatus, setStravaStatus] = useState("Ready to connect");

  async function syncGoogle() {
    const response = await fetch("/.netlify/functions/google-events");
    if (response.status === 401) {
      setGoogleStatus("Connect required");
      return { connected: false, events: [] };
    }
    if (!response.ok) throw new Error(await response.text() || "Google Calendar sync failed");
    const data = await response.json();
    const events = Array.isArray(data.events) ? data.events : [];
    setGoogleStatus(`Connected · ${events.length} events`);
    onGoogleEvents?.(events);
    return { connected: true, events };
  }

  async function syncStrava() {
    const response = await fetch("/.netlify/functions/strava-activities");
    if (response.status === 401) {
      setStravaStatus("Connect required");
      return { connected: false, activities: [] };
    }
    if (!response.ok) throw new Error(await response.text() || "Strava sync failed");
    const data = await response.json();
    const activities = Array.isArray(data.activities) ? data.activities : [];
    setStravaStatus(`Connected · ${activities.length} activities`);
    return { connected: true, activities };
  }

  async function syncAll() {
    setBusy(true);
    try {
      const [google, strava] = await Promise.allSettled([syncGoogle(), syncStrava()]);
      const parts = [];
      if (google.status === "fulfilled") {
        parts.push(google.value.connected
          ? `Google Calendar: ${google.value.events.length} events added`
          : "Google Calendar: connect required");
      } else {
        parts.push(`Google Calendar: ${google.reason?.message || "error"}`);
      }
      if (strava.status === "fulfilled") {
        parts.push(strava.value.connected
          ? `Strava: ${strava.value.activities.length} activities found`
          : "Strava: connect required");
      } else {
        parts.push(`Strava: ${strava.reason?.message || "error"}`);
      }
      setMessage(parts.join(" · "));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "Google Calendar") {
      syncGoogle()
        .then(({ events }) => setMessage(`Google Calendar connected. ${events.length} upcoming events loaded.`))
        .catch((error) => setMessage(`Google Calendar connected, but sync failed: ${error.message}`));
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return (
    <section className="card">
      <div className="section-head">
        <div>
          <h2>🔄 Sync Centre</h2>
          <div className="small">Connected data now feeds the shared event engine and calendar.</div>
        </div>
        <button className="primary-btn" onClick={syncAll} disabled={busy}>
          <RefreshCw size={16} /> {busy ? "Syncing…" : "Sync all"}
        </button>
      </div>

      <div className="sync-grid">
        <Service
          icon={<CalendarDays size={20}/>}
          name="Google Calendar"
          action="/.netlify/functions/google-auth"
          status={googleStatus}
          onSync={syncGoogle}
        />
        <Service
          icon={<Activity size={20}/>}
          name="Strava"
          action="/.netlify/functions/strava-auth"
          status={stravaStatus}
          onSync={syncStrava}
        />
        <Service icon={<CloudSun size={20}/>} name="Weather" status="Planned" />
        <Service icon={<Watch size={20}/>} name="Samsung Health" status="Android phase" />
      </div>

      <div className="sync-log">{message}</div>
    </section>
  );
}

function Service({ icon, name, status, action, onSync }) {
  return (
    <div className="service">
      <div className="service-name">
        {icon}
        <div>
          <strong>{name}</strong>
          <div className="small">{status}</div>
        </div>
      </div>
      <div className="service-actions">
        {action && <a className="secondary-btn" href={action}>Connect</a>}
        {onSync && <button className="secondary-btn" type="button" onClick={onSync}>Sync</button>}
      </div>
    </div>
  );
}
