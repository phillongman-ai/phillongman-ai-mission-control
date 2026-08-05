import { useState } from "react";
import { RefreshCw, CalendarDays, Activity, CloudSun, Watch } from "lucide-react";

export function SyncCentre() {
  const [message, setMessage] = useState("Connect Google Calendar and Strava when credentials are configured.");
  const [busy, setBusy] = useState(false);

  async function syncAll() {
    setBusy(true);
    const results = [];
    for (const [name, endpoint] of [
      ["Google Calendar", "/.netlify/functions/google-events"],
      ["Strava", "/.netlify/functions/strava-activities"],
    ]) {
      try {
        const response = await fetch(endpoint);
        if (response.status === 401) results.push(`${name}: connect required`);
        else if (response.ok) results.push(`${name}: synced`);
        else results.push(`${name}: error`);
      } catch {
        results.push(`${name}: unavailable`);
      }
    }
    setMessage(results.join(" · "));
    setBusy(false);
  }

  return (
    <section className="card">
      <div className="section-head">
        <div>
          <h2>🔄 Sync Centre</h2>
          <div className="small">Connections sit here; the homepage stays clean.</div>
        </div>
        <button className="primary-btn" onClick={syncAll} disabled={busy}>
          <RefreshCw size={16} /> {busy ? "Syncing…" : "Sync all"}
        </button>
      </div>
      <div className="sync-grid">
        <Service icon={<CalendarDays size={20}/>} name="Google Calendar" action="/.netlify/functions/google-auth" status="Ready to connect" />
        <Service icon={<Activity size={20}/>} name="Strava" action="/.netlify/functions/strava-auth" status="Ready to connect" />
        <Service icon={<CloudSun size={20}/>} name="Weather" status="Planned" />
        <Service icon={<Watch size={20}/>} name="Samsung Health" status="Android phase" />
      </div>
      <div className="sync-log">{message}</div>
    </section>
  );
}

function Service({ icon, name, status, action }) {
  return (
    <div className="service">
      <div className="service-name">{icon}<div><strong>{name}</strong><div className="small">{status}</div></div></div>
      {action && <a className="secondary-btn" href={action}>Connect</a>}
    </div>
  );
}
