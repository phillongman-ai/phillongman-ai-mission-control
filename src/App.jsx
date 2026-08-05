import React from "react";
import { useEffect, useMemo, useState } from "react";
import { events as baseEvents } from "./data/events";
import { profile } from "./data/profile";
import { nearEvents, ragForCategory } from "./lib/eventEngine";
import { MissionIndex } from "./components/MissionIndex";
import { FocusList } from "./components/FocusList";
import { CalendarMonth } from "./components/CalendarMonth";
import { SyncCentre } from "./components/SyncCentre";
import { RagBadge } from "./components/RagBadge";

const navItems = [
  ["home","🏠","Home"],["work","💼","Work"],["travel","✈️","Travel"],["family","👨‍👩‍👧‍👦","Family"],
  ["fitness","🎾","Fitness"],["money","💷","Money"],["football","⚽","Football"],["entertainment","🎬","Entertainment"],["life","🏡","Life & Home"]
];

export default function App() {
  const [view, setView] = useState("home");
  const [privateMode, setPrivateMode] = useState(true);
  const [now, setNow] = useState(new Date());
  const events = baseEvents;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const futurePhil = useMemo(
    () => nearEvents(events).slice(0, 3).map((event) => `${event.emoji} ${event.title}`),
    [events]
  );

  return (
    <div className={`app ${privateMode ? "privacy-on" : ""}`}>
      <aside>
        <div className="brand">Mission <span>Control</span></div>
        <div className="tag">Phil’s Personal OS</div>
        <nav>
          {navItems.map(([id, icon, label]) => (
            <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}>
              <span className="nav-icon">{icon}</span>{label}
            </button>
          ))}
        </nav>
        <button className="privacy-btn" onClick={() => setPrivateMode((value) => !value)}>
          {privateMode ? "👁 Privacy mode: ON" : "🙈 Privacy mode: OFF"}
        </button>
      </aside>

      <main>
        <header className="top">
          <div><h1>{view === "home" ? "Mission Control" : navItems.find(([id]) => id === view)?.[2]}</h1><div className="sub">Your personal operating system</div></div>
          <div className="datebox">
            <div>{now.toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</div>
            <strong>{now.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" })}</strong>
          </div>
        </header>

        {view === "home" && (
          <div className="stack">
            <section className="card headline">
              <div className="eyebrow">Mission Control Brief</div>
              <div className="hero-title">👋 Good morning, Phil</div>
              <div className="small">{nearEvents(events).length} important items are coming up in the next 7 days.</div>
            </section>

            <MissionIndex events={events} />

            <div className="grid two">
              <FocusList events={events} />
              <section className="card">
                <div className="section-head"><h2>🔮 Future Phil Says</h2><RagBadge tone="blue">Worth doing</RagBadge></div>
                <div className="future-list">{futurePhil.map((item) => <div key={item}>{item}</div>)}</div>
              </section>
            </div>

            <div className="grid four">
              {["Work","Travel","Family","Fitness"].map((category) => {
                const rag = ragForCategory(events, category);
                const detail = {
                  Work:"Copilot handles the detail",
                  Travel:"Spain is next",
                  Family:"Emma and Sam",
                  Fitness:"Monday & Thursday padel"
                }[category];
                const emoji = {Work:"💼",Travel:"✈️",Family:"👨‍👩‍👧‍👦",Fitness:"🎾"}[category];
                return (
                  <section className="card status-card" key={category}>
                    <div className="status-emoji">{emoji}</div>
                    <div className="section-head"><div className="eyebrow">{category}</div><RagBadge tone={rag.tone}>{rag.label}</RagBadge></div>
                    <div className="status-title">{detail}</div>
                  </section>
                );
              })}
            </div>

            <CalendarMonth events={events} />
            <SyncCentre />
          </div>
        )}

        {view === "work" && <SimpleGrid items={[["🤖 Primary AI","Microsoft Copilot","Meetings, documents, email and internal work content."],["🏙️ Office routine","Wednesday","GLH, London."]]} />}
        {view === "travel" && <SimpleGrid items={[["✈️ Next trip","La Marina, Spain","5–11 September 2026."],["🗺️ Standout ideas","Tabarca · Calpe · El Pinet","Scenery and beach days."]]} />}
        {view === "family" && <FamilyPage />}
        {view === "fitness" && <FitnessPage events={events} />}
        {view === "money" && <MoneyPage />}
        {view === "football" && <SimpleGrid items={[["⚽ Spurs","Transfer intelligence","Credible moves and squad planning."],["📊 Fantasy Football","Data-led team","Competitive from Gameweek 1."]]} />}
        {view === "entertainment" && <SimpleGrid items={[["🎬 Watch next","Mr Inbetween","Strong match for your taste."],["⭐ Taste profile","Gritty, grounded drama","Plus authentic reality TV."]]} />}
        {view === "life" && <NotesPage />}
      </main>
    </div>
  );
}

function SimpleGrid({ items }) {
  return <div className="grid two">{items.map(([label,title,detail]) => <section className="card" key={label}><div className="eyebrow">{label}</div><div className="hero-title small-hero">{title}</div><div className="small">{detail}</div></section>)}</div>;
}

function FamilyPage() {
  return <div className="grid two">{profile.family.map((person) => <section className="card" key={person.name}><div className="hero-title small-hero">{person.emoji} {person.name}</div><div className="small">{person.relationship} · born {new Date(person.birthday+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div></section>)}</div>;
}

function FitnessPage({ events }) {
  const padel = events.filter((event) => event.category === "Fitness");
  return <div className="stack"><div className="grid two"><section className="card"><div className="eyebrow">📆 Weekly routine</div><div className="hero-title small-hero">Monday & Thursday</div><div className="small">Padel at 18:30.</div></section><section className="card"><div className="eyebrow">📱 Apps</div><div className="hero-title small-hero">Matchi + WhatsApp</div><div className="small">Bookings and group comms.</div></section></div><section className="card"><h2>🎾 Upcoming padel</h2>{padel.map((event) => <div className="list-row" key={event.id}><span>{new Date(event.date+"T12:00:00").toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"short"})}</span><strong>{event.time}</strong></div>)}</section></div>;
}

function MoneyPage() {
  return <div className="grid two"><section className="card"><div className="eyebrow">🏦 Pension</div><div className="sensitive hero-title small-hero">£{profile.money.pension.toLocaleString("en-GB")}</div></section><section className="card"><div className="eyebrow">💰 Accessible savings</div><div className="sensitive hero-title small-hero">£{(profile.money.premiumBonds+profile.money.savings).toLocaleString("en-GB")}</div></section></div>;
}

function NotesPage() {
  const [note, setNote] = useState(localStorage.getItem("missionControlNote") || "");
  const [saved, setSaved] = useState("");
  return <section className="card"><h2>📝 Personal note</h2><textarea value={note} onChange={(event)=>setNote(event.target.value)} placeholder="Add something Mission Control should remember on this device..." /><button className="primary-btn" onClick={()=>{localStorage.setItem("missionControlNote",note);setSaved("Saved on this device.");}}>Save note</button><div className="small">{saved}</div></section>;
}
